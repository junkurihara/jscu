/**
 * crypto.mjs
 */

import params from './params.js';
import ec from 'js-crypto-ec/dist/index.js';
import hkdf from 'js-crypto-hkdf/dist/index.js';
import aes from 'js-crypto-aes/dist/index.js';
import random from 'js-crypto-random/dist/index.js';


/**
 * encryption with public key algorithm. in case of ECDH, the session key is derived from HKDF and the data itself will be encrypted by symmetric cipher.
 * @param msg
 * @param pubkey
 * @param privkey
 * @param options
 * @return {Promise<{data: Uint8Array, salt: Uint8Array, iv: Uint8Array}>}
 */
export async function encrypt(msg, pubkey, privkey=null, options = {hkdf: 'SHA-256', encrypt: 'AES-GCM', keyLength: 32, iv: null, info: ''}){

  if(pubkey.kty !== 'EC') throw new Error('RSA is not supported at this point');
  else if(!privkey) throw new Error('Private key must be specified for ECDH');

  // TODO: This is for ecdh only. this must be wrapped with if-statements when we implement another algo.
  const sharedSecret = await ec.deriveSecret(pubkey, privkey);
  const sessionKeySalt = await hkdf.compute(sharedSecret, 'SHA-256', options.keyLength, options.info);

  let data;
  if(Object.keys(params.ciphers).indexOf(options.encrypt) >= 0){
    if(options.encrypt === 'AES-GCM') {  // or TODO: other iv-required algorithms
      if (!options.iv) options.iv = await random.getRandomBytes(params.ciphers[options.encrypt].ivLength);
    }
    data = await aes.encrypt(msg, sessionKeySalt.key, {name: options.encrypt, iv: options.iv});
  }
  else throw new Error('unsupported cipher type (currently only AEC-GCM is supported)');


  return {data, salt: sessionKeySalt.salt, iv: options.iv};
}


/**
 * decryption with public key algorithm. in case of ECDH, the session key is derived from HKDF and the data itself will be decrypted by symmetric cipher.
 * @param data
 * @param privkey
 * @param pubkey
 * @param options
 * @return {Promise<Uint8Array>}
 */
export async function decrypt(data, privkey, pubkey=null, options = {hkdf: 'SHA-256', encrypt: 'AES-GCM', keyLength: 32, info: '', salt: null, iv: null}) {

  if (privkey.kty !== 'EC') throw new Error('RSA is not supported at this point');
  else if (!pubkey) throw new Error('Public key must be specified for ECDH');

  // TODO: This is for ecdh only. this must be wrapped with if-statements when we implement another algo.
  const sharedSecret = await ec.deriveSecret(pubkey, privkey);
  const sessionKeySalt = await hkdf.compute(sharedSecret, 'SHA-256', options.keyLength, options.info, options.salt);

  let msg;
  if(Object.keys(params.ciphers).indexOf(options.encrypt) >= 0){
    msg = await aes.decrypt(data, sessionKeySalt.key, {name: options.encrypt, iv: options.iv});
  }
  else throw new Error('unsupported cipher type (currently only AEC-GCM is supported)');

  return msg;
}

/**
 * sign message with given private key in jwk
 * @param privkey
 * @param msg
 * @param hash
 * @param format
 * @return {Promise<ArrayBuffer>}
 */
export async function sign(msg, privkey, hash = {name: 'SHA-256'}, format = 'raw' ){
  if(privkey.kty !== 'EC') throw new Error('RSA is not supported at this point');

  return await ec.sign(msg, privkey, hash.name, format);
}


/**
 * verify message with given public key in jwk
 * @param msg
 * @param sig
 * @param pubkey
 * @param hash
 * @param format
 * @return {Promise<boolean>}
 */
export async function verify(msg, sig, pubkey, hash = {name: 'SHA-256'}, format = 'raw'){
  if(pubkey.kty !== 'EC') throw new Error('RSA is not supported at this point');
  return await ec.verify(msg, sig, pubkey, hash.name, format);
}

/**
 * generate key pair in jwk format via web crypto api
 * @param keyParams
 * @return {Promise<{publicKey: {format: string, key: (string|*)}, privateKey: {format: string, key: (string|*)}}>}
 */
export async function generateKeyPair(keyParams){
  if(!keyParams) keyParams=params.keyParams;

  if(keyParams.keyType !== 'EC') throw new Error('RSA is not supported at this point');
  const kp = await ec.generateKey(keyParams.namedCurve);

  return {publicKey: {format: 'jwk', key: kp.publicKey}, privateKey: {format: 'jwk', key: kp.privateKey}};
}

