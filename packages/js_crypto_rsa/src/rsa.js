/**
 * rsa.js
 */

import * as util from './util.js';
import * as webapi from './webapi.js';
import * as nodeapi from './nodeapi.js';

export async function generateKey(modulusLength = 2048, publicExponent = new Uint8Array([0x01, 0x00, 0x01])){
  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let keyPair = {};
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.generateKey === 'function' && typeof webCrypto.exportKey === 'function') { // for web API
    keyPair = await webapi.generateKey(modulusLength, publicExponent, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try{
      keyPair = nodeapi.generateKey(modulusLength, publicExponent, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error('UnsupportedEnvironment');
    // try{
    //   keyPair = await purejs.generateKey(namedCurve);
    // } catch (e) { throw new Error('UnsupportedEnvironment');}
  }

  return keyPair;
}

export async function sign(msg, privateJwk, hash = 'SHA-256', algorithm = {name: 'RSA-PSS', saltLength: 192}) {
  // assertion
  if (algorithm.name !== 'RSA-PSS' && algorithm.name !== 'RSASSA-PKCS1-v1_5') throw new Error('InvalidAlgorithm');

  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let signature;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function') { // for web API
    signature = await webapi.sign(msg, privateJwk, hash, algorithm, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try {
      signature = nodeapi.sign(msg, privateJwk, hash, algorithm, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error('UnsupportedEnvironment');
    // try{
    //   signature = await purejs.sign(msg, privateJwk, hash, algorithm, signatureFormat);
    // } catch (e) { throw new Error('UnsupportedEnvironment');}
  }
  return signature;

}

export async function verify(msg, signature, publicJwk, hash = 'SHA-256', algorithm = {name: 'RSA-PSS', saltLength: 192}) {
  // assertion
  if (algorithm.name !== 'RSA-PSS' && algorithm.name !== 'RSASSA-PKCS1-v1_5') throw new Error('InvalidAlgorithm');

  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let valid;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.verify === 'function') { // for web API
    valid = await webapi.verify(msg, signature, publicJwk, hash, algorithm, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    try {
      valid = nodeapi.verify(msg, signature, publicJwk, hash, algorithm, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error('UnsupportedEnvironment');
    // try{
    //   signature = await purejs.verify(msg, signature, publicJwk, hash, algorithm);
    // } catch (e) { throw new Error('UnsupportedEnvironment');}
  }
  return valid;
}

export async function encrypt(msg, publicJwk, hash = 'SHA-256', label = new Uint8Array([])){
  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let encrypted;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') { // for web API
    encrypted = await webapi.encrypt(msg, publicJwk, hash, label, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    try {
      encrypted = nodeapi.encrypt(msg, publicJwk, hash, label, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error('UnsupportedEnvironment');
  }
  return encrypted;
}

export async function decrypt(data, privateJwk, hash = 'SHA-256', label = new Uint8Array([])){
  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let decrypted;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.decrypt === 'function') { // for web API
    decrypted = await webapi.decrypt(data, privateJwk, hash, label, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined') { // for node
    try {
      decrypted = nodeapi.decrypt(data, privateJwk, hash, label, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to purejs implementation
    throw new Error('UnsupportedEnvironment');
  }
  return decrypted;
}
