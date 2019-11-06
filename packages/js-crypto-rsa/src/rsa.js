/**
 * rsa.js
 */

import * as util from 'js-crypto-env';
import * as webapi from './webapi.js';
import * as nodeapi from './nodeapi.js';
import params from './params.js';
import {checkLength as checkOaepLength} from './oaep.js';
import {checkLength as checkPssLength} from './pss.js';
import jseu from 'js-encoding-utils';

/**
 * Generate RSA public/private key pair.
 * @param {Number} [modulusLength=2048] - Modulus length in bits, i.e., n.
 * @param {Uint8Array} [publicExponent=new Uint8Array([0x01, 0x00, 0x01])] - Public exponent, i.e, e.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>}
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const generateKey = async (modulusLength = 2048, publicExponent = new Uint8Array([0x01, 0x00, 0x01])) => {
  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let errMsg;
  let keyPair = {};
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.generateKey === 'function' && typeof webCrypto.exportKey === 'function') { // for web API
    keyPair = await webapi.generateKey(modulusLength, publicExponent, webCrypto).catch((e) => {
      errMsg = e.message;
    });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    keyPair = await nodeapi.generateKey(modulusLength, publicExponent, nodeCrypto).catch( (e) => {
      errMsg = e.message;
    });
  } else throw new Error('UnsupportedEnvironment');

  if (errMsg) throw new Error(`UnsupportedEnvironment: ${errMsg}`); // TODO: fallback to purejs implementation

  return keyPair;
};

/**
 * RSA Signing parameter check.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} jwkey - Private/Public key for signing/verifying in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'.
 * @param {RSASignAlgorithm} algorithm - Object to specify algorithm parameters.
 * @param {String} mode - 'sign' or 'verify' for PSS parameter check.
 * @return {boolean} - Always true unless thrown.
 * @throws {Error} - Throws if InvalidAlgorithm, UnsupportedHash, InvalidMessageFormat or InvalidJwkRsaKey
 */
const assertSignVerify = (msg, jwkey, hash, algorithm, mode) => {
  if (algorithm.name !== 'RSA-PSS' && algorithm.name !== 'RSASSA-PKCS1-v1_5') throw new Error('InvalidAlgorithm');
  if (Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHash');
  if (!(msg instanceof Uint8Array)) throw new Error('InvalidMessageFormat');
  if (jwkey.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  if (algorithm.name === 'RSA-PSS'){
    checkPssLength(mode, {k: jseu.encoder.decodeBase64Url(jwkey.n).length, hash, saltLength: algorithm.saltLength});
  }
  return true;
};

/**
 * RSA signing via RSA-PSS or RSASSA-PKCS1-v1_5.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key for signing in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @param {RSASignAlgorithm} [algorithm={name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}] - Object to specify algorithm parameters.
 * @return {Promise<Uint8Array>} - Byte array of raw signature.
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const sign = async (msg, privateJwk, hash = 'SHA-256', algorithm = {name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}) => {
  // assertion
  assertSignVerify(msg, privateJwk, hash, algorithm, 'sign');

  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let errMsg;
  let signature;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function') { // for web API
    signature = await webapi.signRsa(msg, privateJwk, hash, algorithm, webCrypto).catch((e) => {
      errMsg = e.message;
    });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    signature = await nodeapi.signRsa(msg, privateJwk, hash, algorithm, nodeCrypto).catch( (e) => {
      errMsg = e.message;
    });
  } else throw new Error('UnsupportedEnvironment');

  if (errMsg) throw new Error(`UnsupportedEnvironment: ${errMsg}`); // TODO: fallback to purejs implementation

  return signature;

};

/**
 * Verification of RSA signature via RSA-PSS or RSASSA-PKCS1-v1_5.
 * @param {Uint8Array} msg - Byte array of message signed.
 * @param {Uint8Array} signature - Byte array of raw signature.
 * @param {JsonWebKey} publicJwk - public key for signing in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @param {RSASignAlgorithm} [algorithm={name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}] - Object to specify algorithm parameters.
 * @return {Promise<boolean>} - Result of verification.
 * @throws {Error} - Throws if InvalidSignatureFormat, or UnsupportedEnvironment.
 */
export const verify = async (msg, signature, publicJwk, hash = 'SHA-256', algorithm = {name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}) => {
  // assertion
  assertSignVerify(msg, publicJwk, hash, algorithm, 'verify');
  if (!(signature instanceof Uint8Array)) throw new Error('InvalidSignatureFormat');

  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let errMsg;
  let valid;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.verify === 'function') { // for web API
    valid = await webapi.verifyRsa(msg, signature, publicJwk, hash, algorithm, webCrypto).catch((e) => {
      errMsg = e.message;
    });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    valid = await nodeapi.verifyRsa(msg, signature, publicJwk, hash, algorithm, nodeCrypto).catch( (e) => {
      errMsg = e.message;
    });
  } else throw new Error('UnsupportedEnvironment');

  if (errMsg) throw new Error(`UnsupportedEnvironment: ${errMsg}`); // TODO: fallback to purejs implementation

  return valid;
};

/**
 * RSA Encryption/Decryption Parameter Check.
 * @param {Uint8Array} data - message or encrypted message byte array.
 * @param {JsonWebKey} jwkey - Public/Private key in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} label - RSA-OAEP label.
 * @param {String} mode - 'encrypt' or 'decrypt'
 * @return {boolean} - Always true, otherwise thrown.
 * @throws {Error} - Throws if UnsuppotedHash, InvalidMessageFormat, InvalidLabelFormat or InvalidJwkRsaKey.
 */
const assertEncryptDecrypt = (data, jwkey, hash, label, mode) => {
  if (Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHash');
  if (!(data instanceof Uint8Array)) throw new Error('InvalidMessageFormat');
  if (!(label instanceof Uint8Array)) throw new Error('InvalidLabelFormat');
  if (jwkey.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  checkOaepLength(mode,
    Object.assign({ k: jseu.encoder.decodeBase64Url(jwkey.n).length, label, hash},
      (mode === 'encrypt') ? {mLen: data.length, cLen: 0} : {mLen: 0, cLen: data.length} )
  );

  return true;
};
/**
 * RSA-OAEP Encryption
 * @param {Uint8Array} msg - Byte array of message to be encrypted.
 * @param {JsonWebKey} publicJwk - Public/Private key in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} [label=new Uint8Array([])] - RSA-OAEP label.
 * @return {Promise<Uint8Array>} - Encrypted message.
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export async function encrypt(msg, publicJwk, hash = 'SHA-256', label = new Uint8Array([])){
  // assertion
  assertEncryptDecrypt(msg, publicJwk, hash, label, 'encrypt');

  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let errMsg;
  let encrypted;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') { // for web API
    encrypted = await webapi.encryptRsa(msg, publicJwk, hash, label, webCrypto).catch((e) => {
      errMsg = e.message;
    });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    try {
      encrypted = nodeapi.encryptRsa(msg, publicJwk, hash, label, nodeCrypto);
    } catch(e) {
      errMsg = e.message;
    }
  } else throw new Error('UnsupportedEnvironment'); // TODO: fallback to pure js implementation

  if (errMsg) throw new Error(`UnsupportedEnvironment: ${errMsg}`);

  return encrypted;
}

/**
 * RSA-OAEP Decryption.
 * @param {Uint8Array} data - Byte array of encrypted message to be decrypted.
 * @param {JsonWebKey} privateJwk - Private key in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} [label=new Uint8Array([])] - RSA-OAEP label.
 * @return {Promise<Uint8Array>} - Decrypted message.
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const decrypt = async (data, privateJwk, hash = 'SHA-256', label = new Uint8Array([])) => {
  // assertion
  assertEncryptDecrypt(data, privateJwk, hash, label, 'decrypt');

  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let errMsg;
  let decrypted;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.decrypt === 'function') { // for web API
    decrypted = await webapi.decryptRsa(data, privateJwk, hash, label, webCrypto).catch((e) => {
      errMsg = e.message;
    });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    try {
      decrypted = nodeapi.decryptRsa(data, privateJwk, hash, label, nodeCrypto);
    } catch(e) {
      errMsg = e.message;
    }
  } else throw new Error('UnsupportedEnvironment');

  // TODO: fallback to purejs implementation
  if (errMsg) throw new Error(`UnsupportedEnvironment: ${errMsg}`);

  return decrypted;
};
