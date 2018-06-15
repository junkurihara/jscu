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
 * @param privkey
 * @param msg
 * @param hash
 * @return {Promise<ArrayBuffer>}
 */
export async function sign(msg, privkey, hash = {name: 'SHA-256'} ){
  logger.debug('sign message');

  const algo = cryptoUtil.algo.getParamsFromJwk(privkey);
  algo.hash = hash;
  const webCrypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await cryptoUtil.env.getEnvNodeCrypto(); // node crypto

  let signature;
  try{
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
      && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.sign === 'function'
    // && false // eslint-disable-line //TODO 強制False
    ) {
      const key = await webCrypto.subtle.importKey('jwk', privkey, algo, false, ['sign']);
      signature = await webCrypto.subtle.sign(algo, key, msg);
    }
    else if (typeof nodeCrypto !== 'undefined'){
      // TODO: NEED TO IMPLEMENT WITH NODE CRYPTO
      throw new Error('fallback to elliptic');
    }
    else throw new Error('fallback to elliptic');
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
 * @param hash
 * @return {Promise<boolean>}
 */
export async function verify(msg, sig, pubkey, hash = {name: 'SHA-256'}){
  logger.debug('verify message');

  const algo = cryptoUtil.algo.getParamsFromJwk(pubkey);
  algo.hash = hash;
  const webCrypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await cryptoUtil.env.getEnvNodeCrypto(); // node crypto

  let result;
  try{
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
      && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.verify === 'function'
    // && false // eslint-disable-line //TODO 強制False
    ) {
      const key = await webCrypto.subtle.importKey('jwk', pubkey, algo, false, ['verify']);
      result =  await webCrypto.subtle.verify(algo, key, sig, msg);
    }
    else if (typeof nodeCrypto !== 'undefined'){
      // TODO: NEED TO IMPLEMENT WITH NODE CRYPTO
      throw new Error('fallback to elliptic');
    }
    else throw new Error('fallback to elliptic');
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
  const webCrypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await cryptoUtil.env.getEnvNodeCrypto(); // implementation on node.js
  try {
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
      && typeof webCrypto.subtle.exportKey === 'function' && typeof webCrypto.subtle.generateKey === 'function'
    // && false // eslint-disable-line //TODO 強制False
    ) {
      logger.debug('modern webcrypto is available for key generation');
      // generate ecdsa key
      const keys = await webCrypto.subtle.generateKey(keyParams.algo, keyParams.extractable, keyParams.keyUsage);

      // export keys in jwk format
      const jwkPair = await Promise.all([
        webCrypto.subtle.exportKey('jwk', keys.publicKey),
        webCrypto.subtle.exportKey('jwk', keys.privateKey)
      ]);

      keyPair = {publicKey: {format: 'jwk', key: jwkPair[0]}, privateKey: {format: 'jwk', key: jwkPair[1]}};
    }
    else if (typeof nodeCrypto !== 'undefined'){
      // TODO: NEED TO IMPLEMENT WITH NODE CRYPTO
      throw new Error('fallback to elliptic');
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

