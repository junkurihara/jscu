/**
 * ec.js
 */

import * as util from './util.js';
import * as webapi from './webapi.js';
import * as nodeapi from './nodeapi.js';
import * as purejs from './purejs.js';

/**
 * Generate elliptic curve cryptography public/private key pair
 * @param namedCurve
 * @return {Promise<void>}
 */
export async function generateKey(namedCurve='P-256'){
  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let keyPair = {};
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.generateKey === 'function' && typeof webCrypto.exportKey === 'function') { // for web API
    keyPair = await webapi.generateKey(namedCurve, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try{
      keyPair = nodeapi.generateKey(namedCurve, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to native implementation
    try{
      keyPair = await purejs.generateKey(namedCurve);
    } catch (e) { throw new Error('UnsupportedEnvironment');}
  }

  return keyPair;
}


/**
 * Sign message with ECDSA
 * @param msg
 * @param privateJWK
 * @param hash
 * @return {Promise<*>}
 */
export async function sign(msg, privateJwk, hash = 'SHA-256') {
  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let signature;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function') { // for web API
    signature = await webapi.sign(msg, privateJwk, hash, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try {
      signature = nodeapi.sign(msg, privateJwk, hash, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to native implementation
    try{
      signature = await purejs.sign(msg, privateJwk, hash);
    } catch (e) { throw new Error('UnsupportedEnvironment');}
  }
  return signature;
}


/**
 * Verify signature with ECDSA
 * @param msg
 * @param signature
 * @param publicJwk
 * @param hash
 * @return {Promise<*>}
 */
export async function verify(msg, signature, publicJwk, hash = 'SHA-256') {
  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let valid;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.verify === 'function') { // for web API
    valid = await webapi.verify(msg, signature, publicJwk, hash, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try {
      valid = nodeapi.verify(msg, signature, publicJwk, hash, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to native implementation
    try{
      valid = await purejs.verify(msg, signature, publicJwk, hash);
    } catch (e) { throw new Error('UnsupportedEnvironment');}
  }

  return valid;
}

/**
 * Derive shared secret from my private key and destination's public key.
 * **NOTE** We SHOULD NOT use the derived secret as an encryption key directly.
 * We should employ an appropriate key derivation procedure like HKDF to use the secret for symmetric key encryption.
 * @param publicJwk
 * @param privateJwk
 * @return {Promise<*>}
 */
export async function deriveSecret(publicJwk, privateJwk){
  // assertion
  if(publicJwk.crv !== privateJwk.crv) throw new Error('UnmatchedCurveName');

  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let secret;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.deriveBits === 'function') { // for web API
    secret = await webapi.deriveSecret(publicJwk, privateJwk, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try {
      secret = nodeapi.deriveSecret(publicJwk, privateJwk, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to native implementation
    try{
      secret = purejs.deriveSecret(publicJwk, privateJwk);
    } catch (e) { throw new Error('UnsupportedEnvironment');}
  }

  return secret;
}