/**
 * crypto.mjs
 */


import cryptoUtil from './util/index.mjs';

import pino from 'pino';
import ec from 'js-crypto-ec/dist/index.js';

const logOptions = cryptoUtil.env.getEnvLogOptions(); // log options
const logger = pino(Object.assign(logOptions, {name: 'crypto'}));


/**
 * encryption with public key algorithm. in case of ECDH, the session key is derived from HKDF and the data itself will be encrypted by symmetric cipher.
 * @param msg
 * @param pubkey
 * @param privkey
 * @param options
 * @return {Promise<{data: Uint8Array, salt: Uint8Array, iv: Uint8Array}>}
 */
export async function encrypt(msg, pubkey, privkey=null, options = {hkdf: 'SHA-256', encrypt: 'AES-GCM', keyLength: 32, iv: null, info: ''}){
  logger.debug('encrypt message');

  if(pubkey.kty !== 'EC') throw new Error('RSA is not supported at this point');
  else if(!privkey) throw new Error('Private key must be specified for ECDH');

  // TODO: This is for ecdh only. this must be wrapped with if-statements when we implement another algo.
  const algo = cryptoUtil.algo.getWebCryptoParamsFromJwk(privkey, 'deriveBits');
  const sharedSecret = await deriveECDHSharedSecret(algo, pubkey, privkey);
  const sessionKeySalt = await cryptoUtil.hkdf.compute(sharedSecret, 'SHA-256', options.keyLength, options.info);

  let data;
  if(Object.keys(cryptoUtil.defaultParams.ciphers).indexOf(options.encrypt) >= 0){
    if(options.encrypt === 'AES-GCM') {  // or TODO: other iv-required algorithms
      if (!options.iv) options.iv = await cryptoUtil.random.getRandomBytes(cryptoUtil.defaultParams.ciphers[options.encrypt].ivLength);
    }
    data = await cryptoUtil.aes.encrypt(msg, sessionKeySalt.key, {name: options.encrypt, iv: options.iv});
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
  logger.debug('decrypt message');

  if (privkey.kty !== 'EC') throw new Error('RSA is not supported at this point');
  else if (!pubkey) throw new Error('Public key must be specified for ECDH');

  // TODO: This is for ecdh only. this must be wrapped with if-statements when we implement another algo.
  const algo = cryptoUtil.algo.getWebCryptoParamsFromJwk(privkey, 'deriveBits');
  const sharedSecret = await deriveECDHSharedSecret(algo, pubkey, privkey);
  const sessionKeySalt = await cryptoUtil.hkdf.compute(sharedSecret, 'SHA-256', options.keyLength, options.info, options.salt);

  let msg;
  if(Object.keys(cryptoUtil.defaultParams.ciphers).indexOf(options.encrypt) >= 0){
    msg = await cryptoUtil.aes.decrypt(data, sessionKeySalt.key, {name: options.encrypt, iv: options.iv});
  }
  else throw new Error('unsupported cipher type (currently only AEC-GCM is supported)');

  return msg;
}

/**
 * derive shared secret in ECDH
 * @param algo
 * @param pubkey
 * @param privkey
 * @return {Promise<Uint8Array | *>}
 */
async function deriveECDHSharedSecret(algo, pubkey, privkey){
  return await ec.deriveSecret(pubkey, privkey);
}

/**
 * sign message with given private key in jwk
 * @param privkey
 * @param msg
 * @param hash
 * @return {Promise<ArrayBuffer>}
 */
export async function sign(msg, privkey, hash = {name: 'SHA-256'} ){
  if(privkey.kty !== 'EC') throw new Error('RSA is not supported at this point');

  return await ec.sign(msg, privkey, hash.name, 'raw');
}


/**
 * verify message with given public key in jwk
 * @param msg
 * @param sig
 * @param pubkey
 * @param hash
 * @return {Promise<boolean>}
 */
export async function verify(msg, sig, pubkey, hash = {name: 'SHA-256'}){
  if(pubkey.kty !== 'EC') throw new Error('RSA is not supported at this point');
  return await ec.verify(msg, sig, pubkey, hash.name, 'raw');
}

/**
 * generate key pair in jwk format via web crypto api
 * @param keyParams
 * @return {Promise<{publicKey: {format: string, key: (string|*)}, privateKey: {format: string, key: (string|*)}}>}
 */
export async function generateKeyPair(keyParams){
  if(!keyParams) keyParams=cryptoUtil.defaultParams.keyParams;

  if(keyParams.keyType !== 'EC') throw new Error('RSA is not supported at this point');
  const kp = await ec.generateKey(keyParams.namedCurve);

  return {publicKey: {format: 'jwk', key: kp.publicKey}, privateKey: {format: 'jwk', key: kp.privateKey}};
}

