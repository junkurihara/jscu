/**
 * aes.js
 */

import * as util from './util.js';
import * as nodeapi from './nodeapi.js';
import * as webapi from './webapi.js';
import params from './params.js';

/**
 * Check if the given algorithm spec is valid.
 * @param name
 * @param iv
 * @param tagLength
 */
function assertAlgorithms({name, iv, tagLength}){
  if(Object.keys(params.ciphers).indexOf(name) < 0) throw new Error('UnsupportedAlgorithm');
  if(params.ciphers[name].ivLength){
    if(!(iv instanceof Uint8Array)) throw new Error('InvalidArguments');
    if(iv.byteLength < 2 || iv.byteLength > 14) throw new Error('InvalidIVLength');
    if(params.ciphers[name].staticIvLength && (params.ciphers[name].ivLength !== iv.byteLength)) throw new Error('InvalidIVLength');
  }
  if(params.ciphers[name].tagLength && tagLength){
    if(!Number.isInteger(tagLength)) throw new Error('InvalidArguments');
    if(tagLength < 4 || tagLength > 16) throw new Error('InvalidTagLength');
  }
}

/**
 * Encrypt with AES
 * @param msg
 * @param key
 * @param name
 * @param iv
 * @param additionalData
 * @param tagLength
 * @return {Promise<Uint8Array>}
 */
export async function encrypt(msg, key, {name = 'AES-GCM', iv, additionalData=new Uint8Array([]), tagLength}){
  // assertion and sanitizing
  if(!(msg instanceof Uint8Array) || !(key instanceof Uint8Array)) throw new Error('InvalidArguments');
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const webCrypto = await util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  let native = true;
  let data;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') {// for web API including IE...
    data = await webapi.encrypt(msg, key, {name, iv, additionalData, tagLength}, webCrypto)
      .catch(() => {
        native = false;
      });
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    try{
      data = nodeapi.encrypt(msg, key, {name, iv, additionalData, tagLength}, nodeCrypto);
    } catch(e) {
      native = false;
    }
  } else native = false;

  if (native === false){ // fallback to native implementation
    throw new Error('UnsupportedEnvironment');
    // try{
    //   keyPair = await purejs.generateKey(namedCurve);
    // } catch (e) {throw new Error('UnsupportedEnvironment');}
  }

  return data;
}


/**
 * Decrypt with AES
 * @param data
 * @param key
 * @param name
 * @param iv
 * @param additionalData
 * @param tagLength
 * @return {Promise<Uint8Array>}
 */
export async function decrypt(data, key, {name='AES-GCM', iv, additionalData=new Uint8Array([]), tagLength}){
  // assertion and sanitizing
  if(!(data instanceof Uint8Array) || !(key instanceof Uint8Array)) throw new Error('InvalidArguments');
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const webCrypto = await util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  let native = true;
  let errMsg;
  let msg;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') {
    msg = await webapi.decrypt(data, key, {name, iv, additionalData, tagLength}, webCrypto).catch((e) => {
      native = false;
      errMsg = e.message;
    });
  }
  else if (typeof nodeCrypto !== 'undefined'){
    try{
      msg = nodeapi.decrypt(data, key, {name, iv, additionalData, tagLength}, nodeCrypto);
    } catch(e) {
      native = false;
      errMsg = e.message;
    }
  }

  if (native === false){ // fallback to native implementation
    if(errMsg) throw new Error(errMsg);
    else throw new Error('UnsupportedEnvironment');
    // try{
    //   keyPair = await purejs.generateKey(namedCurve);
    // } catch (e) {throw new Error('UnsupportedEnvironment');}
  }

  return msg;
}