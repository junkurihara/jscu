/**
 * asn1enc.js
 */

import * as asn1ec from './asn1ec.js';
import * as asn1rsa from './asn1rsa.js';
import params, {getAlgorithmFromOid} from './params.js';
import jseu from 'js-encoding-utils';
import BufferMod from 'buffer';
import {OneAsymmetricKey, SubjectPublicKeyInfo, KeyStructure} from './asn1def.js';
import {encryptEncryptedPrivateKeyInfo, decryptEncryptedPrivateKeyInfo} from './rfc8018.js';
import {getJwkType} from './util.js';
const Buffer = BufferMod.Buffer;

/**
 * Convert jwk to spki/pkcs8 in string or binary format.
 * @param {JsonWebKey} jwkey - A key object in JWK format to be encoded.
 * @param {boolean} outputPublic - Derive public key from private key when true
 * @param {AsnFormat} format - 'pem' or 'der'
 * @param {boolean} compact - 'true' or 'false' for EC public key compressed representation in der/pem
 * @param {String} passphrase - if passphrase is given and the given key is private key, it will be encoded with the passphrase.
 * @param {AsnEncryptOptionsWithPassphrase} encOptions - ASN.1 encryption options
 * @return {Uint8Array|String} - Encoded private key in DER or PEM
 */
export const fromJwk = async (jwkey, format, {outputPublic, compact=false, encOptions}) => {
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
    if(typeof encOptions.passphrase !== 'undefined' && encOptions.passphrase.length > 0){
      binKey = await encryptEncryptedPrivateKeyInfo(binKey, encOptions);
      type = 'encryptedPrivate';
    }
  }
  binKey = new Uint8Array(binKey);

  return (format === 'pem') ? jseu.formatter.binToPem(binKey, type) : binKey;
};

/**
 * Convert SPKI/PKCS8 key in string or binary format to JWK.
 * @param {PEM|DER} key - Key object.
 * @param {AsnFormat} format - 'pem' or 'der'
 * @param {boolean} [outputPublic] - Export public key even from private key if true.
 * @param {String} [passphrase] - Encrypt private key if passphrase is given.
 * @return {JsonWebKey} - Obtained key object in JWK format.
 * @throws {Error} Throws if UnsupportedKeyStructure, UnsupportedKey or InvalidKeyType.
 */
export const toJwk = async (key, format, {outputPublic, passphrase}) => {
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
};


