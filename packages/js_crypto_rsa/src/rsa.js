/**
 * rsa.js
 */

import * as util from './util.js';
import * as webapi from './webapi.js';
import * as nodeapi from './nodeapi.js';
import params from './params.js';
import {checkLength as checkOaepLength} from './oaep.js';
import {checkLength as checkPssLength} from './pss.js';
import jseu from 'js-encoding-utils';

/**
 *
 * @param modulusLength
 * @param publicExponent
 * @return {Promise<void>}
 */
export async function generateKey(modulusLength = 2048, publicExponent = new Uint8Array([0x01, 0x00, 0x01])){
  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let keyPair = {};
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.generateKey === 'function' && typeof webCrypto.exportKey === 'function') { // for web API
    keyPair = await webapi.generateKey(modulusLength, publicExponent, webCrypto)
      .catch((e) => {
        errMsg = e.message;
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try{
      keyPair = nodeapi.generateKey(modulusLength, publicExponent, nodeCrypto);
    } catch(e) {
      errMsg = e.message;
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error(`UnsupportedEnvironment: ${errMsg}`);
    // try{
    //   keyPair = await purejs.generateKey(namedCurve);
    // } catch (e) { throw new Error('UnsupportedEnvironment');}
  }

  return keyPair;
}

/**
 *
 * @param msg
 * @param privateJwk
 * @param hash
 * @param algorithm
 * @return {Promise<*>}
 */
export async function sign(msg, privateJwk, hash = 'SHA-256', algorithm) {
  if (typeof algorithm === 'undefined') algorithm = {name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize};

  // assertion
  if (algorithm.name !== 'RSA-PSS' && algorithm.name !== 'RSASSA-PKCS1-v1_5') throw new Error('InvalidAlgorithm');
  if (Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHash');
  if (!(msg instanceof Uint8Array)) throw new Error('InvalidMessageFormat');
  if (privateJwk.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  if (algorithm.name === 'RSA-PSS'){
    checkPssLength('sign', {k: jseu.encoder.decodeBase64Url(privateJwk.n).length, hash, saltLength: algorithm.saltLength});
  }

  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let signature;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function') { // for web API
    signature = await webapi.sign(msg, privateJwk, hash, algorithm, webCrypto)
      .catch((e) => {
        errMsg = e.message;
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try {
      signature = await nodeapi.sign(msg, privateJwk, hash, algorithm, nodeCrypto);
    } catch(e) {
      errMsg = e.message;
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error(`UnsupportedEnvironment: ${errMsg}`);
    // try{
    //   signature = await purejs.sign(msg, privateJwk, hash, algorithm, signatureFormat);
    // } catch (e) { throw new Error('UnsupportedEnvironment');}
  }
  return signature;

}

/**
 *
 * @param msg
 * @param signature
 * @param publicJwk
 * @param hash
 * @param algorithm
 * @return {Promise<*>}
 */
export async function verify(msg, signature, publicJwk, hash = 'SHA-256', algorithm) {
  if (typeof algorithm === 'undefined') algorithm = {name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize};

  // assertion
  if (algorithm.name !== 'RSA-PSS' && algorithm.name !== 'RSASSA-PKCS1-v1_5') throw new Error('InvalidAlgorithm');
  if (Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHash');
  if (!(signature instanceof Uint8Array)) throw new Error('InvalidSignatureFormat');
  if (!(msg instanceof Uint8Array)) throw new Error('InvalidMessageFormat');
  if (publicJwk.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  if (algorithm.name === 'RSA-PSS'){
    checkPssLength('verify', {k: jseu.encoder.decodeBase64Url(publicJwk.n).length, hash, saltLength: algorithm.saltLength});
  }

  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let valid;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.verify === 'function') { // for web API
    valid = await webapi.verify(msg, signature, publicJwk, hash, algorithm, webCrypto)
      .catch((e) => {
        errMsg = e.message;
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    try {
      valid = await nodeapi.verify(msg, signature, publicJwk, hash, algorithm, nodeCrypto);
    } catch(e) {
      errMsg = e.message;
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error(`UnsupportedEnvironment: ${errMsg}`);
    // try{
    //   signature = await purejs.verify(msg, signature, publicJwk, hash, algorithm);
    // } catch (e) { throw new Error('UnsupportedEnvironment');}
  }
  return valid;
}

/**
 *
 * @param msg
 * @param publicJwk
 * @param hash
 * @param label
 * @return {Promise<*>}
 */
export async function encrypt(msg, publicJwk, hash = 'SHA-256', label = new Uint8Array([])){
  // assertion
  if (Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHash');
  if (!(msg instanceof Uint8Array)) throw new Error('InvalidMessageFormat');
  if (!(label instanceof Uint8Array)) throw new Error('InvalidLabelFormat');
  if (publicJwk.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  checkOaepLength('encrypt', {k: jseu.encoder.decodeBase64Url(publicJwk.n).length, label, hash, mLen: msg.length});

  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let encrypted;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') { // for web API
    encrypted = await webapi.encrypt(msg, publicJwk, hash, label, webCrypto)
      .catch((e) => {
        errMsg = e.message;
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    try {
      encrypted = nodeapi.encrypt(msg, publicJwk, hash, label, nodeCrypto);
    } catch(e) {
      errMsg = e.message;
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error(`UnsupportedEnvironment: ${errMsg}`);
  }
  return encrypted;
}

/**
 *
 * @param data
 * @param privateJwk
 * @param hash
 * @param label
 * @return {Promise<*>}
 */
export async function decrypt(data, privateJwk, hash = 'SHA-256', label = new Uint8Array([])){
  // assertion
  if (Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHash');
  if (!(data instanceof Uint8Array)) throw new Error('InvalidMessageFormat');
  if (!(label instanceof Uint8Array)) throw new Error('InvalidLabelFormat');
  if (privateJwk.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  checkOaepLength('decrypt', {k: jseu.encoder.decodeBase64Url(privateJwk.n).length, label, hash, cLen: data.length});

  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let decrypted;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.decrypt === 'function') { // for web API
    decrypted = await webapi.decrypt(data, privateJwk, hash, label, webCrypto)
      .catch((e) => {
        errMsg = e.message;
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    try {
      decrypted = nodeapi.decrypt(data, privateJwk, hash, label, nodeCrypto);
    } catch(e) {
      errMsg = e.message;
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error(`UnsupportedEnvironment: ${errMsg}`);
  }
  return decrypted;
}
