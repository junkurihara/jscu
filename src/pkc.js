/**
 * pkc.js
 */


import ec from 'js-crypto-ec/dist/index.js';
import hkdf from 'js-crypto-hkdf/dist/index.js';
import aes from 'js-crypto-aes/dist/index.js';

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
    if(typeof options.hash === 'undefined') options.hash = 'SHA-256';
    throw new Error('RSAIsUnsupported');
  }
  else throw new Error('UnsupportedKeyType');


  return {publicKey: kp.publicKey, privateKey: kp.privateKey};
}


/**
 * Sign message with given private key in jwk
 * @param privkey
 * @param msg
 * @param hash
 * @param format
 * @return {Promise<ArrayBuffer>}
 */
export async function sign(msg, privkey, hash = 'SHA-256', format = 'raw'){
  let signature;
  if (privkey.kty === 'EC'){
    signature = await ec.sign(msg, privkey, hash, format);
  }
  else if (privkey.kty === 'RSA') {
    throw new Error('RSAIsUnsupported');
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
 * @param format
 * @return {Promise<boolean>}
 */
export async function verify(msg, sig, pubkey, hash = 'SHA-256', format = 'raw'){
  let valid;
  if (pubkey.kty === 'EC'){
    valid = await ec.verify(msg, sig, pubkey, hash, format);
  }
  else if (pubkey.kty === 'RSA') {
    throw new Error('RSAIsUnsupported');
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
    throw new Error('RSAIsUnsupported');
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
    throw new Error('RSAIsUnsupported');
  }
  else throw new Error('UnsupportedKeyType');

  return msg;
}
