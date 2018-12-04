/**
 * aes.js
 */

import * as util from './util.js';
import * as nodeapi from './nodeapi.js';
import * as webapi from './webapi.js';
import params from './params.js';

/**
 * Check if the given algorithm spec is valid.
 * @param name {String}: Name of the specified algorithm like 'AES-GCM'.
 * @param iv {Uint8Array}: IV byte array if required
 * @param tagLength {Number}: Authentication tag length if required
 */
function assertAlgorithms({name, iv, tagLength}){
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
}

/**
 * Encrypt data with AES
 * @param msg {Uint8Array}: Message to be encrypted.
 * @param key {Uint8Array}: The symmetric key used to encrypt the message.
 * @param name {String}: Name of the specified algorithm like 'AES-GCM'.
 * @param iv {Uint8Array}: Byte array of the initial vector if required.
 * @param additionalData {Uint8Array}: Byte array of additional data if required.
 * @param tagLength {Number}: Authentication tag length if required.
 * @return {Promise<Uint8Array>}: Encrypted message.
 */
export async function encrypt(msg, key, {name = 'AES-GCM', iv, additionalData=new Uint8Array([]), tagLength}){
  // assertion and sanitizing
  if(!(msg instanceof Uint8Array) || !(key instanceof Uint8Array)) throw new Error('InvalidArguments');
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const webCrypto = await util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  let data;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') {// for web API including IE...
    data = await webapi.encrypt(msg, key, {name, iv, additionalData, tagLength}, webCrypto)
      .catch((e) => {
        throw new Error(`FailedToEncryptWeb: ${e.message}`);
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try{
      data = nodeapi.encrypt(msg, key, {name, iv, additionalData, tagLength}, nodeCrypto);
    } catch(e) {
      throw new Error(`FailedToEncryptNode: ${e.message}`);
    }
  } else {
    throw new Error('UnsupportedEnvironment'); // TODO:fallback to native implementation
  }

  return data;
}


/**
 * Decrypt data with AES
 * @param data {Uint8Array}: Byte array of encrypted data.
 * @param key {Uint8Array}: Byte array of symmetric key to be used for decryption.
 * @param name {String}: Name of the specified algorithm like 'AES-GCM'.
 * @param iv {Uint8Array}: Byte array of the initial vector if required.
 * @param additionalData {Uint8Array}: {Uint8Array}: Byte array of additional data if required.
 * @param tagLength {Number}: Authentication tag length if required.
 * @return {Promise<Uint8Array>}: Decrypted plaintext message.
 */
export async function decrypt(data, key, {name='AES-GCM', iv, additionalData=new Uint8Array([]), tagLength}){
  // assertion and sanitizing
  if(!(data instanceof Uint8Array) || !(key instanceof Uint8Array)) throw new Error('InvalidArguments');
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const webCrypto = await util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  let msg;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') {
    msg = await webapi.decrypt(data, key, {name, iv, additionalData, tagLength}, webCrypto).catch((e) => {
      throw new Error(`FailedToDecryptWeb: ${e.message}`);
    });
  }
  else if (typeof nodeCrypto !== 'undefined'){
    try{
      msg = nodeapi.decrypt(data, key, {name, iv, additionalData, tagLength}, nodeCrypto);
    } catch(e) {
      throw new Error(`FailedToDecryptNode: ${e.message}`);
    }
  } else throw new Error('UnsupportedEnvironment');

  return msg;
}