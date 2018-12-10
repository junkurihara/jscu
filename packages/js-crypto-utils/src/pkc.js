/**
 * pkc.js
 */

import ec from 'js-crypto-ec';
import rsa from 'js-crypto-rsa';
import { Key } from 'js-crypto-key-utils/dist/key';
import cloneDeep from 'lodash.clonedeep';
import * as pkcec from './pkcec.js';
import params from './params.js';

/**
 * Generate key pair in JWK format
 * @param {'EC'|'RSA'} [keyType='EC'] - Type of public/private key.
 * @param {ECKeyGenerationOption|RSAKeyGenerationOption} [options={}] - Key generation options.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>} - Generated key pair in JWK format.
 */
export async function generateKey(keyType = 'EC', options = {}){
  const localOpt = cloneDeep(options);

  let kp;
  if (keyType === 'EC'){
    if(typeof localOpt.namedCurve === 'undefined') localOpt.namedCurve = 'P-256';
    kp = await ec.generateKey(localOpt.namedCurve);
  }
  else if (keyType === 'RSA') {
    if(typeof localOpt.modulusLength === 'undefined') localOpt.modulusLength = 2048;
    if(typeof localOpt.publicExponent === 'undefined') localOpt.publicExponent = new Uint8Array([0x01, 0x00, 0x01]);
    kp = await rsa.generateKey(localOpt.modulusLength, localOpt.publicExponent);
  }
  else throw new Error('UnsupportedKeyType');

  return {
    publicKey: new Key('jwk', kp.publicKey),
    privateKey: new Key('jwk', kp.privateKey)
  };
}


/**
 * Sign message with given private key in jwk
 * @param {Uint8Array} msg - Message byte array to be signed.
 * @param {Key} privateKey - Private key object for signing.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @param {RSASigningOption|ECSigningOption} [options={}] - Signing options.
 * @return {Promise<Uint8Array>} - Signature byte array.
 * @throws {Error} - Throws if NonKeyObject or UnsupportedKeyType.
 */
export async function sign(msg, privateKey, hash = 'SHA-256', options = {}){
  if(!(privateKey instanceof Key)) throw new Error('NonKeyObject');
  const privateJwk = await privateKey.export('jwk');
  const localOpt = cloneDeep(options);

  let signature;
  if (privateJwk.kty === 'EC'){
    if (typeof localOpt.format === 'undefined') localOpt.format = 'raw';
    signature = await ec.sign(msg, privateJwk, hash, localOpt.format);
  }
  else if (privateJwk.kty === 'RSA') {
    if(typeof localOpt.name === 'undefined') localOpt.name = 'RSA-PSS';
    if(typeof localOpt.saltLength === 'undefined') localOpt.saltLength = params.hashes[hash].hashSize;
    signature = await rsa.sign(msg, privateJwk, hash, localOpt);
  }
  else throw new Error('UnsupportedKeyType');

  return signature;
}

/**
 * Verify message with given public key
 * @param {Uint8Array} msg - A plaintext message to be verified.
 * @param {Uint8Array} sig - Signature byte array.
 * @param {Key} publicKey - Public key object for verification.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @param {RSASigningOption|ECSigningOption} [options={}] - Signing options.
 * @return {Promise<boolean>} - Result of verification.
 * @throws {Error} - Throws if NonKeyObject or UnsupportedKeyType.
 */
export async function verify(msg, sig, publicKey, hash = 'SHA-256', options = {}){
  if(!(publicKey instanceof Key)) throw new Error('NonKeyObject');
  const publicJwk = await publicKey.export('jwk');
  const localOpt = cloneDeep(options);

  let valid;
  if (publicJwk.kty === 'EC'){
    if (typeof localOpt.format === 'undefined') localOpt.format = 'raw';
    valid = await ec.verify(msg, sig, publicJwk, hash, localOpt.format);
  }
  else if (publicJwk.kty === 'RSA') {
    if(typeof localOpt.name === 'undefined') localOpt.name = 'RSA-PSS';
    if(typeof localOpt.saltLength === 'undefined') localOpt.saltLength = params.hashes[hash].hashSize;
    valid = await rsa.verify(msg, sig, publicJwk, hash, localOpt);
  }
  else throw new Error('UnsupportedKeyType');

  return valid;
}



/**
 * Encryption with public key algorithm. in case of ECDH.
 * Session key is derived from HKDF and the data itself will be encrypted by symmetric cipher.
 * @param {Uint8Array} msg - Plaintext message to be encrypted.
 * @param {Key} publicKey - Public key object.
 * @param {RSAEncryptionOption|ECEncryptionOptions} [options={}] - Encryption options.
 * @return {Promise<PKCCiphertextObject>} - Encrypted message object.
 * @throws {Error} - Throws if NonKeyObject, MissingOrInvalidPrivateKeyForECDH, or UnsupportedKeyType.
 */
export async function encrypt(msg, publicKey, options = {}){
  if(!(publicKey instanceof Key)) throw new Error('NonKeyObject');
  const publicJwk = await publicKey.export('jwk');
  const localOpt = cloneDeep(options);

  let ciphertext = {};
  if (publicJwk.kty === 'EC'){
    if(!localOpt.privateKey || !(localOpt.privateKey instanceof Key)) throw new Error('MissingOrInvalidPrivateKeyForECDH');
    localOpt.privateKey = await localOpt.privateKey.export('jwk');
    ciphertext = await pkcec.encrypt(msg, publicJwk, localOpt);
  }
  else if (publicJwk.kty === 'RSA') {
    if(typeof localOpt.hash !== 'undefined') localOpt.hash = 'SHA-256';
    if(typeof localOpt.label !== 'undefined') localOpt.label = new Uint8Array([]);
    ciphertext.data = await rsa.encrypt(msg, publicJwk, localOpt.hash, localOpt.label);
  }
  else throw new Error('UnsupportedKeyType');

  return ciphertext;
}


/**
 * Decryption with public key algorithm. in case of ECDH
 * Session key is derived from HKDF and the data itself will be decrypted by symmetric cipher.
 * @param {Uint8Array} data - Encrypted message body, i.e., PKCCiphertextObject.data.
 * @param {Key} privateKey - Private key object
 * @param {RSAEncryptionOption|ECDecryptionOptions} [options={}] - Decryption Options.
 * @return {Promise<Uint8Array>} - Decrypted message byte array.
 * @throws {Error} - Throws if NonKeyObject, MissingPublicKeyForECDH, or UnsupportedKeyType.
 */
export async function decrypt(data, privateKey, options = {}){
  if(!(privateKey instanceof Key)) throw new Error('NonKeyObject');
  const privateJwk = await privateKey.export('jwk');
  const localOpt = cloneDeep(options);

  let msg;
  if (privateJwk.kty === 'EC'){
    if(!localOpt.publicKey) throw new Error('MissingPublicKeyForECDH');
    localOpt.publicKey = await localOpt.publicKey.export('jwk');
    msg = await pkcec.decrypt(data, privateJwk, localOpt);
  }
  else if (privateJwk.kty === 'RSA') {
    if(typeof localOpt.hash !== 'undefined') localOpt.hash = 'SHA-256';
    if(typeof localOpt.label !== 'undefined') localOpt.label = new Uint8Array([]);
    msg = await rsa.decrypt(data, privateJwk, localOpt.hash, localOpt.label);
  }
  else throw new Error('UnsupportedKeyType');

  return msg;
}
