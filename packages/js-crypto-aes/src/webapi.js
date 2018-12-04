/**
 * webapi.js
 */

import params from './params.js';

/**
 * Encrypt data through AES of WebCrypto API.
 * @param msg {Uint8Array}: Plaintext message to be encrypted.
 * @param key {Uint8Array}: Byte array of symmetric key.
 * @param name {String}: Name of AES algorithm like 'AES-GCM'.
 * @param iv {Uint8Array}: Byte array of initial vector if required.
 * @param additionalData {Uint8Array}: Byte array of additional data if required.
 * @param tagLength {Number}: Authentication tag length if required.
 * @param webCrypto {Object}: WebCrypto object, i.e., window.crypto.subtle or window.mscrypto.subtle
 * @return {Promise<Uint8Array>}: Encrypted data byte array.
 */
export async function encrypt(msg, key, {name = 'AES-GCM', iv, additionalData, tagLength}, webCrypto) {
  if (Object.keys(params.ciphers).indexOf(name) < 0) throw new Error('UnsupportedCipher');

  const encryptionConfig = setCipherParams({name, iv, additionalData, tagLength});

  if (typeof window.msCrypto === 'undefined') {
    // modern browsers
    const sessionKeyObj = await webCrypto.importKey('raw', key, encryptionConfig, false, ['encrypt', 'decrypt']);
    const data = await webCrypto.encrypt(encryptionConfig, sessionKeyObj, msg);
    return new Uint8Array(data);
  }
  else {
    const sessionKeyObj = await msImportKey('raw', key, encryptionConfig, false, ['encrypt', 'decrypt'], webCrypto);
    const encryptedObj = await msEncrypt(encryptionConfig, sessionKeyObj, msg, webCrypto);

    if (name === 'AES-GCM') {
      const data = new Uint8Array(encryptedObj.ciphertext.byteLength + encryptedObj.tag.byteLength);
      data.set(new Uint8Array(encryptedObj.ciphertext));
      data.set(new Uint8Array(encryptedObj.tag), encryptedObj.ciphertext.byteLength);
      return data;
    } else return new Uint8Array(encryptedObj);
  }
}

/**
 * Decrypt data through AES of WebCrypto API.
 * @param data {Uint8Array}: Encrypted message to be decrypted.
 * @param key {Uint8Array}: BYte array of symmetric key.
 * @param name {String}: Name of AES algorithm like 'AES-GCM'.
 * @param iv {Uint8Array}: Byte array of initial vector if required.
 * @param additionalData {Uint8Array}: Byte array of additional data if required.
 * @param tagLength {Number}: Authentication tag length if required.
 * @param webCrypto {Object}: WebCrypto object, i.e., window.crypto.subtle or window.mscrypto.subtle
 * @return {Promise<Uint8Array>}: Decrypted plaintext message.
 */
export async function decrypt(data, key, {name='AES-GCM', iv, additionalData, tagLength}, webCrypto) {
  if (Object.keys(params.ciphers).indexOf(name) < 0) throw new Error('UnsupportedCipher');

  const decryptionConfig = setCipherParams({name, iv, additionalData, tagLength});

  if (!window.msCrypto) {
    // modern browsers
    const sessionKeyObj = await webCrypto.importKey('raw', key, decryptionConfig, false, ['encrypt', 'decrypt']);
    const msg = await webCrypto.decrypt(decryptionConfig, sessionKeyObj, data).catch((e) => {
      throw new Error(`DecryptionFailure: ${e.message}`);
    });
    return new Uint8Array(msg);
  }
  else {
    const sessionKeyObj = await msImportKey('raw', key, decryptionConfig, false, ['encrypt', 'decrypt'], webCrypto);
    if (name === 'AES-GCM') {
      const ciphertext = data.slice(0, data.length - tagLength);
      const tag = data.slice(data.length - tagLength, data.length);
      const msg = await msDecrypt(Object.assign(decryptionConfig, {tag}), sessionKeyObj, ciphertext, webCrypto).catch((e) => {
        throw new Error(`DecryptionFailure: ${e.message}`);
      });
      return new Uint8Array(msg);
    } else{
      const msg = await msDecrypt(decryptionConfig, sessionKeyObj, data, webCrypto).catch((e) => {
        throw new Error(`DecryptionFailure: ${e.message}`);
      });
      return new Uint8Array(msg);
    }
  }
}

/**
 * Set params for encryption algorithms.
 * @param name {String}: Name of AES algorithm like 'AES-GCM'.
 * @param iv {Uint8Array}: Byte array of initial vector if required.
 * @param additionalData {Uint8Array}: Byte array of additional data if required.
 * @param tagLength {Number}: Authentication tag length if required.
 */
const setCipherParams = ({name, iv, additionalData, tagLength}) => {
  const alg = {};

  switch(name){
  case 'AES-GCM': {
    Object.assign(alg, {name, iv, tagLength: tagLength * 8});
    Object.assign(alg, (additionalData.length > 0) ? {additionalData} : {});
    break;
  }
  case 'AES-CBC': {
    alg.name = name;
    alg.iv = iv;
    break;
  }
  default: break;
  }

  return alg;
};

// function definitions for IE
const msImportKey = (type, key, alg, ext, use, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.importKey(type, key, alg, ext, use);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('KeyImportingFailed'); };
});
const msEncrypt = (alg, key, msg, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.encrypt(alg, key, msg);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('EncryptionFailure'); };
});
const msDecrypt = (alg, key, data, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.decrypt(alg, key, data);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('DecryptionFailure'); };
});