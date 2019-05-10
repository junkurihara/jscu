/**
 * ec.js
 */

import * as util from 'js-crypto-env';
import * as webapi from './webapi.js';
import * as nodeapi from './nodeapi.js';
import * as purejs from './purejs.js';

/**
 * Generate elliptic curve cryptography public/private key pair. Generated keys are in JWK.
 * @param {String} [namedCurve='P-256'] - Name of curve like 'P-256'.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey }>} - The generated keys.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., neither WebCrypto, NodeCrypto, nor PureJS codes works.
 */
export const generateKey = async (namedCurve='P-256') => {
  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let keyPair = {};
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.generateKey === 'function' && typeof webCrypto.exportKey === 'function') { // for web API
    keyPair = await webapi.generateKey(namedCurve, webCrypto).catch((e) => {
      errMsg = e.message;
      native = false;
    });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    keyPair = await nodeapi.generateKey(namedCurve, nodeCrypto).catch( (e) => {
      errMsg = e.message;
      native = false;
    });
  } else native = false;

  if (native === false){ // fallback to native implementation
    keyPair = await purejs.generateKey(namedCurve).catch( (e) => {
      errMsg = `${errMsg} => ${e.message}`;
      throw new Error(`UnsupportedEnvironment: ${errMsg}`);
    });
  }

  return keyPair;
};


/**
 * Sign message with ECDSA.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key object in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} [signatureFormat='raw'] - Signature format. 'raw' indicates the purely raw byte array of signature. It can also take 'der', and then the output is ASN.1 DER formatted.
 * @return {Promise<Uint8Array>} - Output signature byte array in raw or der format.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., neither WebCrypto, NodeCrypto, nor PureJS codes works.
 */
export const sign = async (msg, privateJwk, hash = 'SHA-256', signatureFormat='raw') => {
  // assertion
  if (signatureFormat !== 'raw' && signatureFormat !== 'der') throw new Error('InvalidSignatureFormat');

  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let signature;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function') { // for web API
    signature = await webapi.sign(msg, privateJwk, hash, signatureFormat, webCrypto).catch((e) => {
      errMsg = e.message;
      native = false;
    });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    signature = await nodeapi.sign(msg, privateJwk, hash, signatureFormat, nodeCrypto).catch( (e) => {
      errMsg = e.message;
      native = false;
    });
  } else native = false;

  if (native === false){ // fallback to native implementation
    signature = await purejs.sign(msg, privateJwk, hash, signatureFormat).catch ((e) => {
      errMsg = `${errMsg} => ${e.message}`;
      throw new Error(`UnsupportedEnvironment: ${errMsg}`);
    });
  }
  return signature;
};


/**
 * Verify signature with ECDSA.
 * @param {Uint8Array} msg - Byte array of message that have been signed.
 * @param {Uint8Array} signature - Byte array of signature for the given message.
 * @param {JsonWebKey} publicJwk - Public key object in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} [signatureFormat='raw'] - Signature format. 'raw' indicates the purely raw byte array of signature. It can also take 'der', and then the input must be in ASN.1 DER format.
 * @return {Promise<boolean>} - The result of verification.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., neither WebCrypto, NodeCrypto, nor PureJS codes works.
 */
export const verify = async (msg, signature, publicJwk, hash = 'SHA-256', signatureFormat='raw') => {
  // assertion
  if (signatureFormat !== 'raw' && signatureFormat !== 'der') throw new Error('InvalidSignatureFormat');

  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let valid;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.verify === 'function') { // for web API
    valid = await webapi.verify(msg, signature, publicJwk, hash, signatureFormat, webCrypto).catch((e) => {
      errMsg = e.message;
      native = false;
    });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    valid = await nodeapi.verify(msg, signature, publicJwk, hash, signatureFormat, nodeCrypto).catch( (e) => {
      errMsg = e.message;
      native = false;
    });
  } else native = false;

  if (native === false){ // fallback to native implementation
    valid = await purejs.verify(msg, signature, publicJwk, hash, signatureFormat).catch( (e) => {
      errMsg = `${errMsg} => ${e.message}`;
      throw new Error(`UnsupportedEnvironment: ${errMsg}`);
    });
  }

  return valid;
};

/**
 * ECDH: Elliptic Curve Diffie-Hellman Key Exchange, which derives shared secret from my private key and destination's public key.
 * **NOTE** We SHOULD NOT use the derived secret as an encryption key directly.
 * We should employ an appropriate key derivation procedure like HKDF to use the secret for symmetric key encryption.
 * @param {JsonWebKey} publicJwk - Remote public key object in JWK format.
 * @param {JsonWebKey} privateJwk - Local (my) private key object in JWK format.
 * @return {Promise<Uint8Array>} - The derived master secret via ECDH.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., neither WebCrypto, NodeCrypto, nor PureJS codes works.
 */
export const deriveSecret = async (publicJwk, privateJwk) => {
  // assertion
  if(publicJwk.crv !== privateJwk.crv) throw new Error('UnmatchedCurveName');

  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let native = true;
  let errMsg;
  let secret;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.deriveBits === 'function') { // for web API
    secret = await webapi.deriveSecret(publicJwk, privateJwk, webCrypto)
      .catch((e) => {
        errMsg = e.message;
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try { secret = nodeapi.deriveSecret(publicJwk, privateJwk, nodeCrypto); }
    catch (e) {
      errMsg = e.message;
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to native implementation
    try{
      secret = await purejs.deriveSecret(publicJwk, privateJwk);
    } catch (e) {
      errMsg = `${errMsg} => ${e.message}`;
      throw new Error(`UnsupportedEnvironment: ${errMsg}`);
    }
  }

  return secret;
};
