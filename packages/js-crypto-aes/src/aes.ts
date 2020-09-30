/**
 * aes.js
 */

import * as util from 'js-crypto-env';
import * as nodeapi from './nodeapi';
import * as webapi from './webapi';
import params, {cipherTypes, cipherOptions} from './params';


interface aesAlgorithm {
  name: cipherTypes,
  iv?: Uint8Array,
  tagLength?: number
}
/**
 * Check if the given algorithm spec is valid.
 * @param {String} name - Name of the specified algorithm like 'AES-GCM'.
 * @param {Uint8Array} iv - IV byte array if required
 * @param {Number} tagLength - Authentication tag length if required
 * @throws {Error} - Throws if UnsupportedAlgorithm, InvalidArguments, InvalidIVLength, or InvalidTagLength.
 */
const assertAlgorithms = ({name, iv, tagLength}: aesAlgorithm) => {
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
export const encrypt = async (
  msg: Uint8Array,
  key: Uint8Array,
  {name = 'AES-GCM', iv, additionalData=new Uint8Array([]), tagLength}: cipherOptions
): Promise<Uint8Array> => {
  // assertion and sanitizing
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const env = util.getCrypto();

  if (env.name === 'webCrypto') {// for web API
    if (typeof env.crypto.importKey !== 'function' || typeof env.crypto.encrypt !== 'function') throw new Error('UnsupportedWebCrypto');
    return webapi.encrypt(msg, key, {name, iv, additionalData, tagLength}, env.crypto);
  }
  else if (env.name === 'nodeCrypto') { // for node
    return nodeapi.encrypt(msg, key, {name, iv, additionalData, tagLength}, env.crypto);

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
export const decrypt = async (
  data: Uint8Array,
  key: Uint8Array,
  {name='AES-GCM', iv, additionalData=new Uint8Array([]), tagLength}: cipherOptions
): Promise<Uint8Array> => {
  // assertion and sanitizing
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const env = util.getCrypto();

  if (env.name === 'webCrypto') {// for web API
    if (typeof env.crypto.importKey !== 'function' || typeof env.crypto.decrypt !== 'function') throw new Error('UnsupportedWebCrypto');
    return webapi.decrypt(data, key, {name, iv, additionalData, tagLength}, env.crypto);
  }
  else if (env.name === 'nodeCrypto') { // for node
    return nodeapi.decrypt(data, key, {name, iv, additionalData, tagLength}, env.crypto);
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
  keyToBeWrapped: Uint8Array,
  wrappingKey: Uint8Array,
  {name}: {name: 'AES-KW'}
): Promise<Uint8Array> => {
  // assertion
  if(keyToBeWrapped.length % 8 > 0) throw new Error('WrappedKeyMustBeMultipleOf8');

  const env = util.getCrypto();

  const iv = <Uint8Array>(params.wrapKeys['AES-KW'].defaultIv);

  if (env.name === 'webCrypto') {// for web API
    if (typeof env.crypto.importKey !== 'function' || typeof env.crypto.wrapKey !== 'function') throw new Error('UnsupportedWebCrypto');
    return webapi.wrapKey(keyToBeWrapped, wrappingKey, {name, iv}, env.crypto);
  }
  else if (env.name === 'nodeCrypto') { // for node
    return nodeapi.wrapKey(keyToBeWrapped, wrappingKey, {name, iv}, env.crypto);
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
  wrappedKey: Uint8Array,
  wrappingKey: Uint8Array,
  {name}: {name: 'AES-KW'}
) => {
  const env = util.getCrypto();

  const iv = <Uint8Array>(params.wrapKeys['AES-KW'].defaultIv);

  if (env.name === 'webCrypto') {// for web API
    if (typeof env.crypto.importKey !== 'function' || typeof env.crypto.unwrapKey !== 'function') throw new Error('UnsupportedWebCrypto');
    return webapi.unwrapKey(wrappedKey, wrappingKey, {name, iv}, env.crypto);
  }
  else if (env.name === 'nodeCrypto') { // for node
    return nodeapi.unwrapKey(wrappedKey, wrappingKey, {name, iv}, env.crypto);
  } else {
    throw new Error('UnsupportedEnvironment'); // TODO:fallback to native implementation
  }
};
