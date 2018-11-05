/**
 * pkc.js
 */

import ec from 'js-crypto-ec/dist/index.js';
import rsa from 'js-crypto-rsa/dist/index.js';
import * as pkcec from './pkcec.js';
import params from './params.js';

/**
 * Generate key pair in JWK format
 * @param keyType
 * @param options
 * @return {Promise<{publicKey: *, privateKey: *}>}
 */
export async function generateKey(keyType = 'EC', options = {}){
  let kp;
  if (keyType === 'EC'){
    if(typeof options.namedCurve === 'undefined') options.namedCurve = 'P-256';
    kp = await ec.generateKey(options.namedCurve);
  }
  else if (keyType === 'RSA') {
    if(typeof options.modulusLength === 'undefined') options.modulusLength = 2048;
    if(typeof options.publicExponent === 'undefined') options.publicExponent = new Uint8Array([0x01, 0x00, 0x01]);
    kp = await rsa.generateKey(options.modulusLength, options.publicExponent);
  }
  else throw new Error('UnsupportedKeyType');


  return {publicKey: kp.publicKey, privateKey: kp.privateKey};
}


/**
 * Sign message with given private key in jwk
 * @param privkey
 * @param msg
 * @param hash
 * @param options
 * @return {Promise<ArrayBuffer>}
 */
export async function sign(msg, privkey, hash = 'SHA-256', options = {}){
  let signature;
  if (privkey.kty === 'EC'){
    if (typeof options.format === 'undefined') options.format = 'raw';
    signature = await ec.sign(msg, privkey, hash, options.format);
  }
  else if (privkey.kty === 'RSA') {
    if(typeof options.name === 'undefined') options.name = 'RSA-PSS';
    if(typeof options.saltLength === 'undefined') options.saltLength = params.hashes[hash].hashSize;
    signature = await rsa.sign(msg, privkey, hash, options);
  }
  else throw new Error('UnsupportedKeyType');

  return signature;
}

/**
 * Verify message with given public key in jwk
 * @param msg
 * @param sig
 * @param pubkey
 * @param hash
 * @param options
 * @return {Promise<boolean>}
 */
export async function verify(msg, sig, pubkey, hash = 'SHA-256', options = {}){
  let valid;
  if (pubkey.kty === 'EC'){
    if (typeof options.format === 'undefined') options.format = 'raw';
    valid = await ec.verify(msg, sig, pubkey, hash, options.format);
  }
  else if (pubkey.kty === 'RSA') {
    if(typeof options.name === 'undefined') options.name = 'RSA-PSS';
    if(typeof options.saltLength === 'undefined') options.saltLength = params.hashes[hash].hashSize;
    valid = await rsa.verify(msg, sig, pubkey, hash, options);
  }
  else throw new Error('UnsupportedKeyType');

  return valid;
}



/**
 * Encryption with public key algorithm. in case of ECDH.
 * Session key is derived from HKDF and the data itself will be encrypted by symmetric cipher.
 * @param msg
 * @param publicKey
 * @param options
 * @return {Promise<{data: Uint8Array, salt: Uint8Array, iv: Uint8Array}>}
 */
export async function encrypt(msg, publicKey, options = {}){

  let ciphertext = {};
  if (publicKey.kty === 'EC'){
    if(!options.privateKey) throw new Error('MissingPrivateKeyForECDH');
    ciphertext = await pkcec.encrypt(msg, publicKey, options);
  }
  else if (publicKey.kty === 'RSA') {
    if(typeof options.hash !== 'undefined') options.hash = 'SHA-256';
    if(typeof options.label !== 'undefined') options.label = new Uint8Array([]);
    ciphertext.data = await rsa.encrypt(msg, publicKey, options.hash, options.label);
  }
  else throw new Error('UnsupportedKeyType');

  return ciphertext;
}


/**
 * Decryption with public key algorithm. in case of ECDH
 * Session key is derived from HKDF and the data itself will be decrypted by symmetric cipher.
 * @param data
 * @param privateKey
 * @param options
 * @return {Promise<Uint8Array>}
 */
export async function decrypt(data, privateKey, options = {}){

  let msg;
  if (privateKey.kty === 'EC'){
    if(!options.publicKey) throw new Error('MissingPublicKeyForECDH');
    msg = await pkcec.decrypt(data, privateKey, options);
  }
  else if (privateKey.kty === 'RSA') {
    if(typeof options.hash !== 'undefined') options.hash = 'SHA-256';
    if(typeof options.label !== 'undefined') options.label = new Uint8Array([]);
    msg = await rsa.decrypt(data, privateKey, options.hash, options.label);
  }
  else throw new Error('UnsupportedKeyType');

  return msg;
}
