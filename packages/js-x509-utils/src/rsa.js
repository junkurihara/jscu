/**
 * rsa.js
 */

import params from './params.js';
import * as util from './util.js';
import rsa from 'js-crypto-rsa/dist/index.js';
import asn from 'asn1.js';
const BN = asn.bignum;
import rfc5280 from 'asn1.js-rfc5280';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;


export async function getSignature(encodedTbsCertificate, privateJwk, algorithm, hash, saltLength){
  let signature;
  if(algorithm === 'rsassaPss'){
    signature = await rsa.sign( encodedTbsCertificate, privateJwk, hash, { name: 'RSA-PSS', saltLength });
  }
  else {
    signature = await rsa.sign( encodedTbsCertificate, privateJwk, params.signatureAlgorithms[algorithm].hash, { name: 'RSASSA-PKCS1-v1_5' });
  }
  return {unused: 0, data: Buffer.from(signature)};
}

export function encodeRsassaPssParams(options){
  if (options.hash === 'SHA-1' && options.saltLength === 20 && options.explicit === false) return Buffer.from([0x30, 0x00]);
  else {
    const pssParams = {
      hashAlgorithm: {
        algorithm: params.hashes[options.hash].oid,
        parameters: Buffer.from(params.ans1null)
      },
      maskGenAlgorithm: {
        algorithm: params.maskGeneratorFunctions.MGF1.oid, // only MGF1 is available
        parameters: rfc5280.AlgorithmIdentifier.encode({
          algorithm: params.hashes[options.hash].oid,
          parameters: Buffer.from(params.ans1null)
        }, 'der')
      },
      saltLength: new BN(options.saltLength),
      trailerField: new BN(1) // default
    };

    return RSASSAPSSParams.encode(pssParams, 'der');
  }
}


export function decodeRsassaPssParams(pssParams){
  let returnParams;
  if((new Uint8Array(pssParams)).toString() !== (new Uint8Array([0x30, 0x00]).toString())){
    // non empty params
    const decodedParams = RSASSAPSSParams.decode(pssParams, 'der');
    decodedParams.maskGenAlgorithm.parameters
      = rfc5280.AlgorithmIdentifier.decode(decodedParams.maskGenAlgorithm.parameters, 'der');
    decodedParams.saltLength = decodedParams.saltLength.toNumber();
    decodedParams.trailerField = decodedParams.trailerField.toNumber();

    const hash = util.getKeyFromOid(decodedParams.hashAlgorithm.algorithm, params.hashes);
    const mgf = util.getKeyFromOid(decodedParams.maskGenAlgorithm.algorithm, params.maskGeneratorFunctions);
    const hashForMgf = util.getKeyFromOid(decodedParams.maskGenAlgorithm.parameters.algorithm, params.hashes);
    if(hash.length === 0 || mgf.length === 0 || hashForMgf === 0) throw new Error('InvalidCertificateFormat');

    returnParams = {hash: hash[0], mgf: mgf[0], hashForMgf: hashForMgf[0], saltLength: decodedParams.saltLength};
  }
  else {
    // if empty, defaults are SHA-1 for Sign and MGF1 with SHA-1, using salt of length 20
    returnParams = {hash: 'SHA-1', mgf: 'MGF1', hashForMgf: 'SHA-1', saltLength: 20};
  }

  return returnParams;
}

/////////////////////////////////////////////////////////////////////////////////////////
// RFC4055 https://tools.ietf.org/html/rfc4055
// RFC7427 https://tools.ietf.org/html/rfc7427
// RSASSA-PSS-params  ::=  SEQUENCE  {
//          hashAlgorithm      [0] HashAlgorithm DEFAULT
//                                    sha1Identifier,
//          maskGenAlgorithm   [1] MaskGenAlgorithm DEFAULT
//                                    mgf1SHA1Identifier,
//          saltLength         [2] INTEGER DEFAULT 20,
//          trailerField       [3] INTEGER DEFAULT 1  }
const RSASSAPSSParams = asn.define('rsassaPssParams', function() {
  this.seq().obj(
    this.key('hashAlgorithm').explicit(0).use(rfc5280.AlgorithmIdentifier),
    this.key('maskGenAlgorithm').explicit(1).use(rfc5280.AlgorithmIdentifier),
    this.key('saltLength').explicit(2).int(),
    this.key('trailerField').explicit(3).int()
  );
});