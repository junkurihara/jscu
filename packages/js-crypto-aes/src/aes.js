/**
 * aes.js
 */

import * as util from 'js-crypto-env';
import * as nodeapi from './nodeapi.js';
import * as webapi from './webapi.js';
import params from './params.js';

/**
 * Check if the given algorithm spec is valid.
 * @param {String} name - Name of the specified algorithm like 'AES-GCM'.
 * @param {Uint8Array} iv - IV byte array if required
 * @param {Number} tagLength - Authentication tag length if required
 * @throws {Error} - Throws if UnsupportedAlgorithm, InvalidArguments, InvalidIVLength, or InvalidTagLength.
 */
const assertAlgorithms = ({name, iv, tagLength}) => {
  if(Object.keys(params.ciphers).indexOf(name) < 0) throw new Error('UnsupportedAlgorithm');
  if(params.ciphers[name].ivLength){
    if(!(iv instanceof Uint8Array)) throw new Error('InvalidArguments');
    if(iv.byteLength < 2 || iv.byteLength > 16) throw new Error('InvalidIVLength');
    if(params.ciphers[name].staticIvLength && (params.ciphers[name].ivLength !== iv.byteLength)) throw new Error('InvalidIVLength');
  }
  if(params.ciphers[name].tagLength && tagLength){
    if(!Number.isInteger(tagLength)) throw new Error('InvalidArguments');
    if(tagLength < 4 || tagLength > 16) throw new Error('InvalidTagLength');
  }
};

/**
 * Encrypt data with AES
 * @param {Uint8Array} msg - Message to be encrypted.
 * @param {Uint8Array} key - The symmetric key used to encrypt the message.
 * @param {String} [name = 'AES-GCM'] - Name of the specified algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of the initial vector if required.
 * @param {Uint8Array} [additionalData = new Uint8Array([])] - Byte array of additional data if required.
 * @param {Number} [tagLength = params.ciphers[name].tagLength] - Authentication tag length if required.
 * @return {Promise<Uint8Array>} - Encrypted message.
 * @throws {Error} - Throws if InvalidArguments, FaildToEncryptWeb/Node, or UnsupportedEnvironment (no webcrypto/nodecrypto).
 */
export const encrypt = async (msg, key, {name = 'AES-GCM', iv, additionalData=new Uint8Array([]), tagLength}) => {
  // assertion and sanitizing
  if(!(msg instanceof Uint8Array) || !(key instanceof Uint8Array)) throw new Error('InvalidArguments');
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const webCrypto = await util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') {// for web API including IE...
    return webapi.encrypt(msg, key, {name, iv, additionalData, tagLength}, webCrypto);
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    return nodeapi.encrypt(msg, key, {name, iv, additionalData, tagLength}, nodeCrypto);

  } else throw new Error('UnsupportedEnvironment'); // TODO:fallback to native implementation
};


/**
 * Decrypt data with AES
 * @param {Uint8Array} data - Byte array of encrypted data.
 * @param {Uint8Array} key - Byte array of symmetric key to be used for decryption.
 * @param {String} [name = 'AES-GCM'] - Name of the specified algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of the initial vector if required.
 * @param {Uint8Array} [additionalData = new Uint8Array([])] - Byte array of additional data if required.
 * @param {Number} [tagLength = params.ciphers[name].tagLength] - Authentication tag length if required.
 * @return {Promise<Uint8Array>} - Decrypted plaintext message.
 * @throws {Error} - Throws if InvalidArguments, FailedToDecryptWeb/Node, or UnsupportedEnvironment (no webcrypto/nodecrypto).
 */
export const decrypt = async (data, key, {name='AES-GCM', iv, additionalData=new Uint8Array([]), tagLength}) => {
  // assertion and sanitizing
  if(!(data instanceof Uint8Array) || !(key instanceof Uint8Array)) throw new Error('InvalidArguments');
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const webCrypto = await util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') {
    return webapi.decrypt(data, key, {name, iv, additionalData, tagLength}, webCrypto);
  }
  else if (typeof nodeCrypto !== 'undefined'){
    return nodeapi.decrypt(data, key, {name, iv, additionalData, tagLength}, nodeCrypto);
  } else throw new Error('UnsupportedEnvironment');
};


/**
 * AES-KW wrapping
 * @param keyToBeWrapped {Uint8Array} - key bytes to be wrapped
 * @param wrappingKey {Uint8Array} - wrapping key encryption key
 * @param name {'AES-KW'} - this is simply for future extension
 * @return {Promise<Uint8Array>} - output wrapped key
 */
export const wrapKey = async (
  keyToBeWrapped, wrappingKey, {name = 'AES-KW'}
) => {
  // assertion
  if(!(keyToBeWrapped instanceof Uint8Array)) throw new Error('NonUint8ArrayData');
  if(!(wrappingKey instanceof Uint8Array)) throw new Error('NonUint8ArrayKey');
  if(keyToBeWrapped.length % 8 > 0) throw new Error('WrappedKeyMustBeMultipleOf8');

  const webCrypto = await util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  const iv = params.wrapKeys['AES-KW'].defaultIV;

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.wrapKey === 'function') {// for web API including IE...
    return webapi.wrapKey(keyToBeWrapped, wrappingKey, {name, iv}, webCrypto);
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    return nodeapi.wrapKey(keyToBeWrapped, wrappingKey, {name, iv}, nodeCrypto);
  } else {
    throw new Error('UnsupportedEnvironment'); // TODO:fallback to native implementation
  }
};

/**
 * AES-KW unwrapping
 * @param wrappedKey {Uint8Array} - wrapped key bytes
 * @param wrappingKey {Uint8Array} - wrapping key encryption key
 * @param name {'AES-KW'} - this is simply for future extension
 * @return {Promise<Uint8Array>} - output unwrapped key
 */
export const unwrapKey = async (
  wrappedKey, wrappingKey, {name = 'AES-KW'}
) => {
  // assertion
  if(!(wrappedKey instanceof Uint8Array)) throw new Error('NonUint8ArrayData');
  if(!(wrappingKey instanceof Uint8Array)) throw new Error('NonUint8ArrayKey');

  const webCrypto = await util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  const iv = params.wrapKeys['AES-KW'].defaultIV;

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.wrapKey === 'function') {// for web API including IE...
    return webapi.unwrapKey(wrappedKey, wrappingKey, {name, iv}, webCrypto);
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    return nodeapi.unwrapKey(wrappedKey, wrappingKey, {name, iv}, nodeCrypto);
  } else {
    throw new Error('UnsupportedEnvironment'); // TODO:fallback to native implementation
  }
};
