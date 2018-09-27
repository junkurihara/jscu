/**
 * aes.js
 */

import * as util from './util.js';
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
 * @return {Promise<Uint8Array>}
 */
export async function encrypt(msg, key, {name = 'AES-GCM', iv, tagLength}){
  // assertion and sanitizing
  if(!(msg instanceof Uint8Array) || !(key instanceof Uint8Array)) throw new Error('InvalidArguments');
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;


  const webCrypto = await util.getWebCrypto(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  let data;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') {
    let alg;
    if(name === 'AES-GCM') alg = { name, iv, tagLength: tagLength * 8};

    const sessionKeyObj = await webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);
    data = await webCrypto.encrypt(alg, sessionKeyObj, msg);
    data = new Uint8Array(data);
  }
  else if (typeof nodeCrypto !== 'undefined'){
    let alg = params.ciphers[name].nodePrefix;
    alg = `${alg}-${(key.byteLength*8).toString()}-`;
    alg = alg + params.ciphers[name].nodeSuffix;

    let cipher;
    if(name === 'AES-GCM') cipher = nodeCrypto.createCipheriv(alg, key, iv, {authTagLength: tagLength});

    const body = new Uint8Array(cipher.update(msg));
    const final = new Uint8Array(cipher.final());

    let tag = new Uint8Array([]);
    if(name === 'AES-GCM') tag = new Uint8Array(cipher.getAuthTag());

    data = new Uint8Array(body.length + final.length + tag.length);
    data.set(body);
    data.set(final, body.length);
    data.set(tag, body.length + final.length);
  }
  else{
    throw new Error('UnsupportedEnvironment');
  }

  return data;
}


/**
 * Decrypt with AES
 * @param data
 * @param key
 * @param name
 * @param iv
 * @return {Promise<Uint8Array>}
 */
export async function decrypt(data, key, {name='AES-GCM', iv, tagLength}){
  // assertion and sanitizing
  if(!(data instanceof Uint8Array) || !(key instanceof Uint8Array)) throw new Error('InvalidArguments');
  assertAlgorithms({name, iv, tagLength});
  if(params.ciphers[name].tagLength && !tagLength) tagLength = params.ciphers[name].tagLength;

  const webCrypto = await util.getWebCrypto(); // web crypto api
  const nodeCrypto = await util.getNodeCrypto(); // node crypto

  let msg;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function') {

    let alg;
    if(name === 'AES-GCM') alg = { name, iv, tagLength: tagLength * 8};

    const sessionKeyObj = await webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);
    msg = await webCrypto.decrypt(alg, sessionKeyObj, data).catch(() => {throw new Error('DecryptionFailure');});
    msg = new Uint8Array(msg);
  }
  else if (typeof nodeCrypto !== 'undefined'){
    let alg = params.ciphers[name].nodePrefix;
    alg = `${alg}-${(key.byteLength*8).toString()}-`;
    alg = alg + params.ciphers[name].nodeSuffix;

    let decipher;
    let body;
    if(name === 'AES-GCM'){
      decipher = nodeCrypto.createDecipheriv(alg, key, iv, {authTagLength: tagLength});
      body = data.slice(0, data.length - tagLength);
      const tag = data.slice(data.length - tagLength);
      decipher.setAuthTag(tag);
    }

    const decryptedBody = decipher.update(body);
    let final;
    try{
      final = decipher.final();
    } catch (e) {
      throw new Error('DecryptionFailure');
    }
    msg = new Uint8Array(final.length + decryptedBody.length);
    msg.set(decryptedBody);
    msg.set(final, decryptedBody.length);
  }
  else {
    throw new Error('UnsupportedEnvironment');
  }

  return msg;
}