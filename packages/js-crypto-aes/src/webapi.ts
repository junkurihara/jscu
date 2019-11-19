/**
 * webapi.js
 */

import {cipherOptions} from './params';


/**
 * WebCrypto KeyWrapping function simply uses encrypt function.
 * @param keyToBeWrapped {Uint8Array} - plaintext key
 * @param wrappingKey {Uint8Array} - wrapping key
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param webCrypto {Object} - crypto.subtle object
 * @return {Uint8Array} - Unwrapped Key
 */
export const wrapKey = async (
  keyToBeWrapped: Uint8Array,
  wrappingKey: Uint8Array,
  {name, iv}: {name: 'AES-KW', iv: Uint8Array},
  webCrypto: any
): Promise<Uint8Array> => {
  // @ts-ignore
  if (typeof window.msCrypto === 'undefined') {
    // modern browsers
    try {
      const kek = await webCrypto.importKey('raw', wrappingKey, {name}, false, ['wrapKey', 'unwrapKey']);
      const cek = await webCrypto.importKey('raw', keyToBeWrapped, {name}, true, ['wrapKey', 'unwrapKey']);
      const data = await webCrypto.wrapKey('raw', cek, kek, {name, iv});
      return new Uint8Array(data);
    } catch (e) { throw new Error(`WebCrypto_FailedToWrapKey - ${e.message}`); }
  }
  else {
    throw new Error('ThrowAwayIeAsap');
  }
};

/**
 * WebCrypto KeyUnwrapping function as well as keyWrapping
 * @param wrappedKey {Uint8Array} - Wrapped key
 * @param unwrappingKey {Uint8Array} - Key used for wrapping
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param webCrypto {Object} - crypto.subtle object
 * @return {Uint8Array} - Unwrapped Key
 */
export const unwrapKey = async (
  wrappedKey: Uint8Array,
  unwrappingKey: Uint8Array,
  {name, iv}: {name: 'AES-KW', iv: Uint8Array},
  webCrypto: any
): Promise<Uint8Array> => {
  // @ts-ignore
  if (typeof window.msCrypto === 'undefined') {
    // modern browsers
    try {
      const kek = await webCrypto.importKey('raw', unwrappingKey, {name}, false, ['wrapKey', 'unwrapKey']);
      const cek = await webCrypto.unwrapKey('raw', wrappedKey, kek, {name, iv}, {name: 'AES-GCM'}, true, ['encrypt', 'decrypt']);
      return new Uint8Array(await webCrypto.exportKey('raw', cek));
    } catch (e) { throw new Error(`WebCrypto_FailedToUnwrapKey - ${e.message}`); }
  }
  else {
    throw new Error('ThrowAwayMsIeAsap');
  }
};

/**
 * Encrypt data through AES of WebCrypto API.
 * @param {Uint8Array} msg - Plaintext message to be encrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} webCrypto - WebCrypto object, i.e., window.crypto.subtle or window.msCrypto.subtle
 * @return {Promise<Uint8Array>} - Encrypted data byte array.
 * @throws {Error} - Throws if UnsupportedCipher.
 */
export const encrypt = async (
  msg: Uint8Array,
  key: Uint8Array,
  {name = 'AES-GCM', iv, additionalData, tagLength}: cipherOptions,
  webCrypto: any
): Promise<Uint8Array> => {
  const encryptionConfig = setCipherParams({name, iv, additionalData, tagLength});

  // @ts-ignore
  if (typeof window.msCrypto === 'undefined') {
    // modern browsers
    try {
      const sessionKeyObj = await webCrypto.importKey('raw', key, encryptionConfig, false, ['encrypt', 'decrypt']);
      const data = await webCrypto.encrypt(encryptionConfig, sessionKeyObj, msg);
      return new Uint8Array(data);
    } catch (e) {
      throw new Error(`WebCrypto_EncryptionFailure: ${e.message}`);
    }
  }
  else {
    try {
      const sessionKeyObj = await msImportKey('raw', key, encryptionConfig, false, ['encrypt', 'decrypt'], webCrypto);
      const encryptedObj = await msEncrypt(encryptionConfig, sessionKeyObj, msg, webCrypto);

      if (name === 'AES-GCM') {
        const data = new Uint8Array((<any>encryptedObj).ciphertext.byteLength + (<any>encryptedObj).tag.byteLength);
        data.set(new Uint8Array((<any>encryptedObj).ciphertext));
        data.set(new Uint8Array((<any>encryptedObj).tag), (<any>encryptedObj).ciphertext.byteLength);
        return data;
      } else return new Uint8Array(<any>encryptedObj);
    } catch (e) {
      throw new Error(`ThrowAwayMsIeAsap: ${e.message}`);
    }
  }
};

/**
 * Decrypt data through AES of WebCrypto API.
 * @param {Uint8Array} data - Encrypted message to be decrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} webCrypto - WebCrypto object, i.e., window.crypto.subtle or window.msCrypto.subtle
 * @return {Promise<Uint8Array>} - Decrypted plaintext message.
 * @throws {Error} - Throws if UnsupportedCipher or DecryptionFailure.
 */
export const decrypt = async (
  data: Uint8Array,
  key: Uint8Array,
  {name, iv, additionalData, tagLength}: cipherOptions,
  webCrypto: any
): Promise<Uint8Array> => {
  const decryptionConfig = setCipherParams({name, iv, additionalData, tagLength});

  // @ts-ignore
  if (!window.msCrypto) {
    // modern browsers
    try {
      const sessionKeyObj = await webCrypto.importKey('raw', key, decryptionConfig, false, ['encrypt', 'decrypt']);
      const msg = await webCrypto.decrypt(decryptionConfig, sessionKeyObj, data);
      return new Uint8Array(msg);
    } catch (e) {
      throw new Error(`WebCrypto_DecryptionFailure: ${e.message}`);
    }
  }
  else {
    try {
      const sessionKeyObj = await msImportKey('raw', key, decryptionConfig, false, ['encrypt', 'decrypt'], webCrypto);
      let msg;
      if (name === 'AES-GCM') {
        const ciphertext = data.slice(0, data.length - <number>tagLength);
        const tag = data.slice(data.length - <number>tagLength, data.length);
        msg = await msDecrypt(Object.assign(decryptionConfig, {tag}), sessionKeyObj, ciphertext, webCrypto);
      } else {
        msg = await msDecrypt(decryptionConfig, sessionKeyObj, data, webCrypto);
      }
      return new Uint8Array(<any>msg);
    } catch (e) {
      throw new Error(`ThrowAwayMsIeAsap: ${e.message}`);
    }
  }
};


interface webcryptoParams extends cipherOptions { counter?: Uint8Array, length?: number}
/**
 * Set params for encryption algorithms.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 */
const setCipherParams = ({name, iv, additionalData, tagLength}: cipherOptions): webcryptoParams => {
  const alg: webcryptoParams = {name, iv, additionalData, tagLength};

  switch(name){
  case 'AES-GCM': {
    alg.tagLength = <number>tagLength * 8;
    break;
  }
  case 'AES-CBC': {
    break;
  }
  case 'AES-CTR': {
    if((<Uint8Array>iv).length === 0 || (<Uint8Array>iv).length > 16) throw new Error('InvalidIVLength');
    alg.counter = new Uint8Array(16);
    alg.counter.set(<Uint8Array>iv);
    alg.counter[15] += 1;
    alg.length = 128; // todo: this might be  (16 - iv.length) * 8.
    break;
  }}

  return alg;
};

// function definitions for IE
// should die asap
const msImportKey = (type: any, key: any, alg: any, ext: any, use: any, webCrypto:any) => new Promise ( (resolve, reject) => {
  const op = webCrypto.importKey(type, key, alg, ext, use);
  op.oncomplete = (evt: any) => { resolve(evt.target.result); };
  op.onerror = () => { reject('KeyImportingFailed'); };
});
const msEncrypt = (alg: any, key: any, msg: any, webCrypto:any) => new Promise ( (resolve, reject) => {
  const op = webCrypto.encrypt(alg, key, msg);
  op.oncomplete = (evt: any) => { resolve(evt.target.result); };
  op.onerror = () => { reject('EncryptionFailure'); };
});
const msDecrypt = (alg: any, key: any, data: any, webCrypto:any) => new Promise ( (resolve, reject) => {
  const op = webCrypto.decrypt(alg, key, data);
  op.oncomplete = (evt: any) => { resolve(evt.target.result); };
  op.onerror = () => { reject('DecryptionFailure'); };
});
