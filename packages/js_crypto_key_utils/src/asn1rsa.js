/**
 * asn1rsa.js
 */

import asn from 'asn1.js';
import jseu from 'js-encoding-utils';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;
import params from './params.js';
import {appendLeadingZeros, pruneLeadingZeros} from './util';

export function fromJwk(jwk, type){

  const publicKeyAlgorithmOid = params.publicKeyAlgorithms['RSA'].oid;
  // Parameters is always null Ox0500 in ASN.1 as shown in the Section 2.3.1 https://tools.ietf.org/html/rfc3279
  const parameters = Buffer.from([0x05, 0x00]);
  const algorithm = { algorithm: publicKeyAlgorithmOid, parameters };

  const modulusBytes = jseu.encoder.decodeBase64Url(jwk.n);
  const nLen = modulusBytes.length;
  const modulusLength = (nLen % 128 === 0) ? nLen : nLen + (128 - (nLen % 128));

  const modulus = new asn.bignum(appendLeadingZeros(modulusBytes, modulusLength)); // TODO check
  const publicExponent = new asn.bignum(jseu.encoder.decodeBase64Url(jwk.e));

  const decoded = {};
  if(type === 'public'){ // SPKI
    decoded.subjectPublicKey = {
      unused: 0,
      data: RSAPublicKey.encode({ modulus, publicExponent  }, 'der')
    };
    decoded.algorithm = algorithm;
  }
  else if (type === 'private') { // PKCS8
    decoded.version = 0;  // no public key presents for v2 (0)
    decoded.privateKeyAlgorithm = algorithm;
    decoded.privateKey = RSAPrivateKey.encode({
      version: 0,
      modulus,
      publicExponent,
      privateExponent: new asn.bignum( appendLeadingZeros(jseu.encoder.decodeBase64Url(jwk.d), modulusLength)), // TODO check
      prime1: new asn.bignum( appendLeadingZeros(jseu.encoder.decodeBase64Url(jwk.p), modulusLength)),
      prime2: new asn.bignum( appendLeadingZeros(jseu.encoder.decodeBase64Url(jwk.q), modulusLength)),
      exponent1: new asn.bignum( appendLeadingZeros(jseu.encoder.decodeBase64Url(jwk.dp), modulusLength)),
      exponent2: new asn.bignum( appendLeadingZeros(jseu.encoder.decodeBase64Url(jwk.dq), modulusLength)),
      coefficient: new asn.bignum( appendLeadingZeros(jseu.encoder.decodeBase64Url(jwk.qi), modulusLength))
    }, 'der');
  }
  return decoded;
}

/**
 * Convert RSA spki/pkcs8 public/private keys to JWK
 * @param decoded
 * @param type
 * @return {*}
 */
export function toJwk(decoded, type){

  if (type === 'public'){ // SPKI
    // algorithm.algorithm.parameters is always null Ox0500 in ASN.1
    // as shown in the Section 2.3.1 https://tools.ietf.org/html/rfc3279

    // overwrite nested binary object as parsed object
    decoded.subjectPublicKey.data = RSAPublicKey.decode(decoded.subjectPublicKey.data, 'der');
    let modulus = decoded.subjectPublicKey.data.modulus;
    let publicExponent = decoded.subjectPublicKey.data.publicExponent;

    // convert n and e from BN
    // modulus n
    const nLen = modulus.byteLength();
    const len = (nLen % 128 === 0) ? nLen : nLen + (128 - (nLen % 128));
    modulus = new Uint8Array(modulus.toArray('be', len));

    // // publicExponent e;
    publicExponent = new Uint8Array(publicExponent.toArray('be', publicExponent.byteLength()));

    return {
      kty: 'RSA',
      n: jseu.encoder.encodeBase64Url(pruneLeadingZeros(modulus)), // TODO check
      e: jseu.encoder.encodeBase64Url(pruneLeadingZeros(publicExponent))
    };
  }
  else if (type === 'private'){ // PKCS8
    // privateKeyAlgorithm.algorithm.parameters is always null Ox0500 in ASN.1
    // as shown in the Section 2.3.1 https://tools.ietf.org/html/rfc3279

    // overwrite nested binary object as parsed object
    decoded.privateKey = RSAPrivateKey.decode(decoded.privateKey, 'der');

    const privateKeyElems = {};
    privateKeyElems.modulus = decoded.privateKey.modulus;


    // calculate key length from modulus n
    const nLen = privateKeyElems.modulus.byteLength();
    const len = (nLen % 128 === 0) ? nLen : nLen + (128 - (nLen % 128)); // this is actual key length, e.g., 256 bytes


    // convert BN to Uint8Array
    privateKeyElems.modulus = new Uint8Array(privateKeyElems.modulus.toArray('be', len)); // n of length len
    privateKeyElems.publicExponent = new Uint8Array(
      decoded.privateKey.publicExponent.toArray( 'be', decoded.privateKey.publicExponent.byteLength() )
    ); // e of arbitrary small length
    privateKeyElems.privateExponent = new Uint8Array(decoded.privateKey.privateExponent.toArray('be', len)); // d of length len

    const keys = ['prime1', 'prime2', 'exponent1', 'exponent2', 'coefficient']; // elements of length len/2
    keys.forEach( (key) => {
      privateKeyElems[key] = new Uint8Array(decoded.privateKey[key].toArray('be', (len>>1) ));
    });

    // JWW RSA private key: https://tools.ietf.org/html/rfc7517
    return {
      kty: 'RSA',
      n: jseu.encoder.encodeBase64Url(pruneLeadingZeros(privateKeyElems.modulus)), // TODO check
      e: jseu.encoder.encodeBase64Url(pruneLeadingZeros(privateKeyElems.publicExponent)),
      d: jseu.encoder.encodeBase64Url(pruneLeadingZeros(privateKeyElems.privateExponent)),
      p: jseu.encoder.encodeBase64Url(pruneLeadingZeros(privateKeyElems.prime1)),
      q: jseu.encoder.encodeBase64Url(pruneLeadingZeros(privateKeyElems.prime2)),
      dp: jseu.encoder.encodeBase64Url(pruneLeadingZeros(privateKeyElems.exponent1)),
      dq: jseu.encoder.encodeBase64Url(pruneLeadingZeros(privateKeyElems.exponent2)),
      qi: jseu.encoder.encodeBase64Url(pruneLeadingZeros(privateKeyElems.coefficient))
    };
  }
}


///////////
// https://tools.ietf.org/html/rfc3447
const RSAPublicKey = asn.define('RSAPublicKey', function() {
  this.seq().obj(
    this.key('modulus').int(), // n
    this.key('publicExponent').int() // e
  );
});

const RSAPrivateKey = asn.define('RSAPrivateKey', function(){
  this.seq().obj(
    this.key('version').int(), // 0
    this.key('modulus').int(), // n
    this.key('publicExponent').int(), // e
    this.key('privateExponent').int(), // d
    this.key('prime1').int(), // p
    this.key('prime2').int(), // q
    this.key('exponent1').int(), // d mod (p-1)
    this.key('exponent2').int(), // d mod (q-1)
    this.key('coefficient').int(), // (inverse of q) mod p
    this.key('otherPrimeInfos').optional().use(OtherPrimeInfos)
  );
});

const OtherPrimeInfos = asn.define('OtherPrimeInfos', function(){
  this.seqof(OtherPrimeInfo);
});

const OtherPrimeInfo = asn.define('OtherPrimeInfo', function(){
  this.seq().obj(
    this.key('prime').int(),
    this.key('exponent').int(),
    this.key('coefficient').int()
  );
});