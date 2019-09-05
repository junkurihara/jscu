/**
 * webapi.js
 */

/**
 * WebCrypto KeyWrapping function simply uses encrypt function.
 * @param keyToBeWrapped {Uint8Array} - plaintext key
 * @param wrappingKey {Uint8Array} - wrapping key
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param nodeCrypto {Object} - crypto.subtle object
 * @return {Uint8Array} - Unwrapped Key
 */
export const wrapKey = async (keyToBeWrapped, wrappingKey, {name = 'AES-KW', iv}, webCrypto) => {
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
 * @param nodeCrypto {Object} - crypto.subtle object
 * @return {Uint8Array} - Unwrapped Key
 */
export const unwrapKey = async (wrappedKey, unwrappingKey, {name = 'AES-KW', iv}, webCrypto) => {
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
export const encrypt = async (msg, key, {name = 'AES-GCM', iv, additionalData, tagLength}, webCrypto) => {
  const encryptionConfig = setCipherParams({name, iv, additionalData, tagLength});

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
        const data = new Uint8Array(encryptedObj.ciphertext.byteLength + encryptedObj.tag.byteLength);
        data.set(new Uint8Array(encryptedObj.ciphertext));
        data.set(new Uint8Array(encryptedObj.tag), encryptedObj.ciphertext.byteLength);
        return data;
      } else return new Uint8Array(encryptedObj);
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
export const decrypt = async (data, key, {name, iv, additionalData, tagLength}, webCrypto) => {
  const decryptionConfig = setCipherParams({name, iv, additionalData, tagLength});

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
        const ciphertext = data.slice(0, data.length - tagLength);
        const tag = data.slice(data.length - tagLength, data.length);
        msg = await msDecrypt(Object.assign(decryptionConfig, {tag}), sessionKeyObj, ciphertext, webCrypto);
      } else {
        msg = await msDecrypt(decryptionConfig, sessionKeyObj, data, webCrypto);
      }
      return new Uint8Array(msg);
    } catch (e) {
      throw new Error(`ThrowAwayMsIeAsap: ${e.message}`);
    }
  }
};

/**
 * Set params for encryption algorithms.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
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
  case 'AES-CTR': {
    if(iv.length === 0 || iv.length > 16) throw new Error('InvalidIVLength');
    alg.name = name;
    alg.counter = new Uint8Array(16);
    alg.counter.set(iv);
    alg.counter[15] += 1;
    alg.length = 128; // todo: this might be  (16 - iv.length) * 8.
    break;
  }}

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
