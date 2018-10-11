/**
 * asn1enc.js
 */

import * as asn1ec from './asn1ec.js';
import * as asn1rsa from './asn1rsa.js';
import params, {getAlgorithmFromOid} from './params.js';
import jseu from 'js-encoding-utils';
import BufferMod from 'buffer';
import {OneAsymmetricKey, SubjectPublicKeyInfo, PrivateKeyStructure} from './asn1def.js';
import {decryptEncryptedPrivateKeyInfo} from './rfc8081.js';
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

  let binKey = (type === 'public') ? SubjectPublicKeyInfo.encode(decoded, 'der') : OneAsymmetricKey.encode(decoded, 'der');
  binKey = new Uint8Array(binKey);

  return (format === 'pem') ? jseu.formatter.binToPem(binKey, type) : binKey;
}

/**
 * Convert spki/pkcs8 key in string or binary format to jwk.
 * @param key
 * @param type
 * @param format
 * @param passphrase
 * @return {*|void}
 */
export async function toJwk(key, {type, format, passphrase}){
  // Peel the pem strings
  const binKey = (format === 'pem') ? jseu.formatter.pemToBin(key, type) : key;

  // decode binary spki/pkcs8-formatted key to parsed object
  let decoded;
  if (type === 'public') decoded = SubjectPublicKeyInfo.decode(Buffer.from(binKey), 'der');
  else {
    decoded = PrivateKeyStructure.decode(Buffer.from(binKey), 'der');
    if(decoded.type === 'encryptedPrivateKeyInfo') decoded = await decryptEncryptedPrivateKeyInfo(decoded.value, passphrase);
    else if (decoded.type === 'oneAsymmetricKey') decoded = decoded.value;
  }

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


