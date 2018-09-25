/**
 * crypto.mjs
 */
import cryptoUtil from './util/index.mjs';
import jseu from 'js-encoding-utils';
import {jwkToPem} from './keyconv.mjs';

import elliptic from './elliptic/index.mjs';

import pino from 'pino';
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
  const sessionKeySalt = await cryptoUtil.hkdf.getKeySalt(sharedSecret, 'SHA-256', options.keyLength, options.info);

  let data;
  if(Object.keys(cryptoUtil.defaultParams.ciphers).indexOf(options.encrypt) >= 0){
    if(options.encrypt === 'AES-GCM') {  // or TODO: other iv-required algorithms
      if (!options.iv) options.iv = await cryptoUtil.random.getRandomBytes(cryptoUtil.defaultParams.ciphers[options.encrypt].ivLength);
    }
    data = await cryptoUtil.aes.encrypt(options.encrypt, msg, sessionKeySalt.key, options.iv);
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
  const sessionKeySalt = await cryptoUtil.hkdf.getKeySalt(sharedSecret, 'SHA-256', options.keyLength, options.info, options.salt);

  let msg;
  if(Object.keys(cryptoUtil.defaultParams.ciphers).indexOf(options.encrypt) >= 0){
    msg = await cryptoUtil.aes.decrypt(options.encrypt, data, sessionKeySalt.key, options.iv);
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
  logger.debug('derive ECDH shared secret');
  const webCrypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await cryptoUtil.env.getEnvNodeCrypto(); // node crypto

  let sharedKey;
  try{
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
      && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.deriveBits === 'function'
    // && false // eslint-disable-line //TODO 強制False
    ) {
      const privKeyObj = await webCrypto.subtle.importKey('jwk', privkey, algo, false, ['deriveBits']);
      const pubKeyObj = await webCrypto.subtle.importKey('jwk', pubkey, algo, false, []);
      const bitlen = async () => { const arr = await jseu.encoder.decodeBase64Url(privkey.x); return 8*arr.length; };
      sharedKey = new Uint8Array(await webCrypto.subtle.deriveBits(Object.assign(algo, {public: pubKeyObj}), privKeyObj, await bitlen()));
    }
    else if (typeof nodeCrypto !== 'undefined'){
      const curve = cryptoUtil.defaultParams.curves[algo.namedCurve].nodeName;
      const ecdh = nodeCrypto.createECDH(curve);
      const privKeyBuf = await jseu.encoder.decodeBase64Url(privkey.d);
      const payloadSize = cryptoUtil.defaultParams.curves[algo.namedCurve].payloadSize;
      const pubKeyBuf = new Uint8Array( payloadSize * 2 + 1 );
      pubKeyBuf[0] = 0xFF & 0x04;
      pubKeyBuf.set(await jseu.encoder.decodeBase64Url(pubkey.x), 1);
      pubKeyBuf.set(await jseu.encoder.decodeBase64Url(pubkey.y), payloadSize + 1);
      ecdh.setPrivateKey(privKeyBuf);
      sharedKey = new Uint8Array(ecdh.computeSecret(pubKeyBuf));
    }
    else throw new Error('fallback to elliptic');
  }
  catch (e) {
    logger.info(e, 'web crypto api is not supported for key derivation. fallen back to pure javascript shared secret derivation.');
    sharedKey = await elliptic.crypto.deriveSharedKey(algo, pubkey, privkey);
  }

  return sharedKey;

}

/**
 * sign message with given private key in jwk
 * @param privkey
 * @param msg
 * @param hash
 * @return {Promise<ArrayBuffer>}
 */
export async function sign(msg, privkey, hash = {name: 'SHA-256'} ){
  logger.debug('sign message');

  const algo = cryptoUtil.algo.getWebCryptoParamsFromJwk(privkey, 'sign');
  algo.hash = hash;
  const webCrypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await cryptoUtil.env.getEnvNodeCrypto(); // node crypto

  let signature;
  if(privkey.kty !== 'EC') throw new Error('RSA is not supported at this point');
  try{
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
      && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.sign === 'function') {
      logger.debug('webCrypto ECDSA');
      const key = await webCrypto.subtle.importKey('jwk', privkey, algo, false, ['sign']);
      signature = await webCrypto.subtle.sign(algo, key, msg);
    }
    else if (typeof nodeCrypto !== 'undefined'){
      logger.debug('nodeCrypto ECDSA');
      const pemKey = await jwkToPem(privkey, 'private');
      const sign = nodeCrypto.createSign(cryptoUtil.defaultParams.hashes[hash.name].name);
      sign.update(msg);
      const asn1sig = sign.sign(pemKey);
      signature = elliptic.keyconv.decodeAsn1Signature(asn1sig, algo.namedCurve);
    }
    else throw new Error('fallback to elliptic');
  }
  catch (e) {
    logger.info(e, 'web crypto api is not supported for signing of the parameter. fallen back to pure javascript ecdsa signing.');
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

  const algo = cryptoUtil.algo.getWebCryptoParamsFromJwk(pubkey, 'verify');
  algo.hash = hash;
  const webCrypto = await cryptoUtil.env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await cryptoUtil.env.getEnvNodeCrypto(); // node crypto

  let result;

  if(pubkey.kty !== 'EC') throw new Error('RSA is not supported at this point');
  try{
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
      && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.verify === 'function') {
      logger.debug('webCrypto ECDSA');
      const key = await webCrypto.subtle.importKey('jwk', pubkey, algo, false, ['verify']);
      result =  await webCrypto.subtle.verify(algo, key, sig, msg);
    }
    else if (typeof nodeCrypto !== 'undefined'){
      logger.debug('nodeCrypto ECDSA');
      const pemKey = await jwkToPem(pubkey, 'public');
      const verify = nodeCrypto.createVerify(cryptoUtil.defaultParams.hashes[hash.name].name);
      verify.update(msg);
      const asn1sig = elliptic.keyconv.encodeAsn1Signature(sig, algo.namedCurve);
      result = verify.verify(pemKey, asn1sig);
    }
    else throw new Error('fallback to elliptic');
  }
  catch (e) {
    logger.info(e, 'web crypto api is not supported for verification of the parameter. fallen back to pure javascript ecdsa verification');
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

  if(keyParams.keyType !== 'EC') throw new Error('RSA is not supported at this point');
  try {
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
      && typeof webCrypto.subtle.exportKey === 'function' && typeof webCrypto.subtle.generateKey === 'function' ) {
      logger.debug('modern webcrypto is available for key generation');
      // generate ecdsa key
      const keys = await webCrypto.subtle.generateKey(
        Object.assign(cryptoUtil.defaultParams.webCryptoKeyParamsEC.algo, {namedCurve: keyParams.namedCurve}),
        cryptoUtil.defaultParams.webCryptoKeyParamsEC.extractable,
        cryptoUtil.defaultParams.webCryptoKeyParamsEC.keyUsage);

      // export keys in jwk format
      const jwkPair = await Promise.all([
        webCrypto.subtle.exportKey('jwk', keys.publicKey),
        webCrypto.subtle.exportKey('jwk', keys.privateKey)
      ]);

      delete jwkPair[0].key_ops; // key pair is exported as both for ecdh and ecdsa
      delete jwkPair[1].key_ops;

      keyPair = {publicKey: {format: 'jwk', key: jwkPair[0]}, privateKey: {format: 'jwk', key: jwkPair[1]}};
    }
    else if (typeof nodeCrypto !== 'undefined'){
      logger.debug('nodeCrypto is available');
      const ecdh = nodeCrypto.ECDH(cryptoUtil.defaultParams.curves[keyParams.namedCurve].nodeName);
      ecdh.generateKeys();
      const rawKeyPair = {publicKey: new Uint8Array(ecdh.getPublicKey()), privateKey: new Uint8Array(ecdh.getPrivateKey())};
      const pubKey = await elliptic.keyconv.convertRawKeyToJwk(rawKeyPair, 'public', keyParams.namedCurve);
      const privKey = await elliptic.keyconv.convertRawKeyToJwk(rawKeyPair, 'private', keyParams.namedCurve);
      keyPair = { publicKey: { format: 'jwk', key: pubKey}, privateKey: { format: 'jwk', key: privKey} };
    }
    else throw new Error('fallback to elliptic');
  }
  catch (e) {
    logger.info(e, 'something wrong maybe do to lack of web crypto api feature. fall back to elliptic to generate key');
    keyPair = await elliptic.crypto.generateKeyPair(
      Object.assign(cryptoUtil.defaultParams.webCryptoKeyParamsEC.algo, {namedCurve: keyParams.namedCurve})
    );
  }

  return keyPair;
}

