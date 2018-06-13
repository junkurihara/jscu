/**
 * crypto.mjs
 */
import cryptoUtil from './util/index.mjs';

import pino from 'pino';
const logOptions = cryptoUtil.env.getEnvLogOptions(); // log options
const logger = pino(Object.assign(logOptions, {name: 'crypto'}));

const dynamicLoadElliptic = async () => cryptoUtil.env.dynamicModuleLoad(await import(/* webpackChunkName: 'elliptic' */ './elliptic/index.mjs'));

/**
 * sign message with given private key in jwk
 * @param algo
 * @param privkey
 * @param msg
 * @return {Promise<ArrayBuffer>}
 */
export async function sign(msg, privkey, algo=cryptoUtil.defaultParams.keyParams.algo){
  logger.debug('sign message');

  const crypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api or its implementation on node.js

  let signature;
  try{
    if (typeof crypto !== 'undefined' && typeof crypto.subtle === 'object'
      && typeof crypto.subtle.importKey === 'function' && typeof crypto.subtle.sign === 'function'
    // && false // eslint-disable-line //TODO 強制False
    ) {
      const key = await crypto.subtle.importKey('jwk', privkey, algo, false, ['sign']);
      signature = await crypto.subtle.sign(algo, key, msg);
    }
    else throw new Error('fall back to Elliptic');
  }
  catch (e) {
    logger.info(`web crypto api is not supported for signing of the parameter. fallen back to pure javascript ecdsa signing. ${JSON.stringify(e)}`);
    const elliptic = await dynamicLoadElliptic();
    signature = await elliptic.crypto.sign(algo, privkey, msg);
  }

  return signature;
}


/**
 * verify message with given public key in jwk
 * @param msg
 * @param sig
 * @param pubkey
 * @param algo
 * @return {Promise<boolean>}
 */
export async function verify(msg, sig, pubkey, algo=cryptoUtil.defaultParams.keyParams.algo){
  logger.debug('verify message');

  const crypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api or its implementation on node.js

  let result;
  try{
    if (typeof crypto !== 'undefined' && typeof crypto.subtle === 'object'
      && typeof crypto.subtle.importKey === 'function' && typeof crypto.subtle.verify === 'function'
    // && false // eslint-disable-line //TODO 強制False
    ) {
      const key = await crypto.subtle.importKey('jwk', pubkey, algo, false, ['verify']);
      result =  await crypto.subtle.verify(algo, key, sig, msg);
    }
    else throw new Error('fallback to Elliptic');
  }
  catch (e) {
    logger.info(`web crypto api is not supported for verification of the parameter. fallen back to pure javascript ecdsa verification. ${JSON.stringify(e)}`);
    const elliptic = await dynamicLoadElliptic();
    result = await elliptic.crypto.verify(algo, pubkey, sig, msg);
  }

  return result;
}

/**
 * generate key pair in jwk format via web crypto api
 * @param keyParams
 * @return {Promise<{publicKey: {format: string, key: (string|*)}, privateKey: {format: string, key: (string|*)}}>}
 */
export async function generateKeyPair(keyParams){
  if(!keyParams) keyParams=cryptoUtil.defaultParams.keyParams;
  logger.debug('generate key pair in jwk format');

  let keyPair;
  const crypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api or its implementation on node.js
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.subtle === 'object'
      && typeof crypto.subtle.exportKey === 'function' && typeof crypto.subtle.generateKey === 'function'
    // && false // eslint-disable-line //TODO 強制False
    ) {
      logger.debug('modern webcrypto is available for key generation');
      // generate ecdsa key
      const keys = await crypto.subtle.generateKey(keyParams.algo, keyParams.extractable, keyParams.keyUsage);

      // export keys in jwk format
      const jwkPair = await Promise.all([
        crypto.subtle.exportKey('jwk', keys.publicKey),
        crypto.subtle.exportKey('jwk', keys.privateKey)
      ]);

      keyPair = {publicKey: {format: 'jwk', key: jwkPair[0]}, privateKey: {format: 'jwk', key: jwkPair[1]}};
    }
    else throw new Error('fallback to elliptic');
  }
  catch (e) {
    logger.info(`something wrong maybe do to lack of web crypto api feature. fall back to elliptic to generate key. ${JSON.stringify(e)}`);
    const elliptic = await dynamicLoadElliptic();
    keyPair = await elliptic.crypto.generateKeyPair(keyParams.algo);
  }

  return keyPair;
}

