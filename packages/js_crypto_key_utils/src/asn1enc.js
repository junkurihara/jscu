/**
 * asn1enc.js
 */

import * as asn1ec from './asn1ec.js';
import * as asn1rsa from './asn1rsa.js';
import params, {getAlgorithmFromOid} from './params.js';
import asn from 'asn1.js';
import jseu from 'js-encoding-utils';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;

/**
 * Convert jwk to spki/pkcs8 in string or binary format.
 * @param jwkey
 * @param type {string} : 'public' or 'private'
 * @param format {string} : 'pem' or 'der'
 * @param compact {boolean} : 'true' or 'false' for EC public key compressed representation in der/pem
 * @return {Uint8Array}
 */
export function fromJwk(jwkey, {type, format, compact=false}){
  let decoded;
  if (jwkey.kty === 'EC') {
    decoded = asn1ec.fromJWK(jwkey, type, compact);
  }
  else if (jwkey.kty === 'RSA'){
    decoded = asn1rsa.fromJwk(jwkey, type);
  }

  let binKey = (type === 'public') ? SubjectPublicKeyInfo.encode(decoded, 'der') : PrivateKeyInfo.encode(decoded, 'der');
  binKey = new Uint8Array(binKey);

  return (format === 'pem') ? jseu.formatter.binToPem(binKey, type) : binKey;
}

/**
 * Convert spki/pkcs8 key in string or binary format to jwk.
 * @param key
 * @param type
 * @param format
 * @return {*|void}
 */
export function toJwk(key, {type, format}){
  // Peel the pem strings
  const binKey = (format === 'pem') ? jseu.formatter.pemToBin(key, type) : key;

  // decode binary spki/pkcs8-formatted key to parsed object
  const decoded = (type === 'public')
    ? SubjectPublicKeyInfo.decode(Buffer.from(binKey), 'der')
    : PrivateKeyInfo.decode(Buffer.from(binKey), 'der');
  const keyTypes = getAlgorithmFromOid(
    (type === 'public') ? decoded.algorithm.algorithm : decoded.privateKeyAlgorithm.algorithm,
    params.publicKeyAlgorithms
  );
  if(keyTypes.length < 1) throw new Error('UnsupportedKey');

  if (keyTypes[0] === 'EC') {
    return asn1ec.toJWK(decoded, type);
  }
  else if (keyTypes[0] === 'RSA'){
    return asn1rsa.toJwk(decoded, type);
  }
  else throw new Error('InvalidKeyType');
}


///////
// https://tools.ietf.org/html/rfc5280
const AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function() {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional().any()
  );
});

// https://tools.ietf.org/html/rfc5280
const SubjectPublicKeyInfo = asn.define('SubjectPublicKeyInfo', function() {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  );
});

// https://tools.ietf.org/html/rfc5208
const PrivateKeyInfo = asn.define('PrivateKeyInfo', function() {
  this.seq().obj(
    this.key('version').use(Version),
    this.key('privateKeyAlgorithm').use(AlgorithmIdentifier),
    this.key('privateKey').octstr(),
    this.key('attributes').optional().any()
  );
});

const Version = asn.define('Version', function() {
  this.int();
});