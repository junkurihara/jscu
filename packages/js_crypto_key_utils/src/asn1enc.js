/**
 * asn1enc.js
 */

import * as asn1ec from './asn1ec.js';
import * as asn1rsa from './asn1rsa.js';
import params, {getAlgorithmFromOid} from './params.js';
import jseu from 'js-encoding-utils';
import BufferMod from 'buffer';
import {OneAsymmetricKey, SubjectPublicKeyInfo, KeyStructure} from './asn1def.js';
import {encryptEncryptedPrivateKeyInfo, decryptEncryptedPrivateKeyInfo} from './rfc8081.js';
import {getJwkType} from './util.js';
const Buffer = BufferMod.Buffer;

/**
 * Convert jwk to spki/pkcs8 in string or binary format.
 * @param jwkey
 * @param outputPublic {boolean} : derive public key from private key when true
 * @param format {string} : 'pem' or 'der'
 * @param compact {boolean} : 'true' or 'false' for EC public key compressed representation in der/pem
 * @param passphrase
 * @param encOptions
 * @return {Uint8Array}
 */
export async function fromJwk(jwkey, format, {outputPublic, compact=false, passphrase = '', encOptions}){
  const orgType = getJwkType(jwkey);
  let type = (typeof outputPublic === 'boolean' && outputPublic) ? 'public' : orgType;

  let decoded;
  if (jwkey.kty === 'EC') {
    decoded = asn1ec.fromJWK(jwkey, type, compact);
  }
  else if (jwkey.kty === 'RSA'){
    decoded = asn1rsa.fromJwk(jwkey, type);
  }

  let binKey;
  if (type === 'public') {
    binKey = SubjectPublicKeyInfo.encode(decoded, 'der');
  }
  else {
    binKey = OneAsymmetricKey.encode(decoded, 'der');
    if(passphrase.length > 0){
      binKey = await encryptEncryptedPrivateKeyInfo(binKey, passphrase, encOptions);
      type = 'encryptedPrivate';
    }
  }
  binKey = new Uint8Array(binKey);

  return (format === 'pem') ? jseu.formatter.binToPem(binKey, type) : binKey;
}

/**
 * Convert spki/pkcs8 key in string or binary format to jwk.
 * @param key
 * @param format
 * @param outputPublic {boolean} (optional)
 * @param passphrase
 * @return {*|void}
 */
export async function toJwk(key, format, {outputPublic, passphrase}){
  // Peel the pem strings
  const binKey = (format === 'pem') ? jseu.formatter.pemToBin(key) : key;

  // decode binary spki/pkcs8-formatted key to parsed object
  let decoded;
  try { decoded = KeyStructure.decode(Buffer.from(binKey), 'der'); }
  catch (e) { throw new Error('FailedToDecodeKey'); }

  let type;
  if(decoded.type === 'subjectPublicKeyInfo'){
    type = 'public';
    decoded = decoded.value;
  }
  else {
    type = (typeof outputPublic === 'boolean' && outputPublic) ? 'public' : 'private';

    if(decoded.type === 'encryptedPrivateKeyInfo') decoded = await decryptEncryptedPrivateKeyInfo(decoded.value, passphrase);
    else if (decoded.type === 'oneAsymmetricKey') decoded = decoded.value;
    else throw new Error('UnsupportedKeyStructure');
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


