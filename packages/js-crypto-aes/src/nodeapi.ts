/**
 * nodeapi.js
 */

import params, {cipherOptions, cipherParams, cipherTypes} from './params';

/**
 * Node.js KeyWrapping function simply uses encrypt function.
 * @param keyToBeWrapped {Uint8Array} - plaintext key
 * @param wrappingKey {Uint8Array} - wrapping key
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param nodeCrypto {Object} - NodeCrypto object
 * @return {Uint8Array} - Unwrapped Key
 */
export const wrapKey = (
  keyToBeWrapped: Uint8Array,
  wrappingKey: Uint8Array,
  {name, iv}: {name: 'AES-KW', iv: Uint8Array},
  nodeCrypto: any
): Uint8Array => encrypt(
  keyToBeWrapped, wrappingKey, {name, iv}, nodeCrypto, true
);


/**
 * Node.js KeyUnwrapping function as well as keyWrapping
 * @param wrappedKey {Uint8Array} - Wrapped key
 * @param unwrappingKey {Uint8Array} - Key used for wrapping
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param nodeCrypto {Object} - NodeCrypto object
 * @return {Uint8Array} - Unwrapped Key
 */
export const unwrapKey = (
  wrappedKey: Uint8Array,
  unwrappingKey: Uint8Array,
  {name, iv}: {name: 'AES-KW', iv: Uint8Array},
  nodeCrypto: any
) => decrypt(
  wrappedKey, unwrappingKey, {name, iv}, nodeCrypto, true
);

/**
 * Encrypt plaintext message via AES Node.js crypto API
 * @param {Uint8Array} msg - Plaintext message to be encrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} nodeCrypto - NodeCrypto object, i.e., require(crypto) in Node.js.
 * @param wrapKey {Boolean} [false] - true if called as AES-KW
 * @return {Uint8Array} - Encrypted message byte array.
 * @throws {Error} - Throws error if UnsupportedCipher.
 */
export const encrypt = (
  msg: Uint8Array,
  key: Uint8Array,
  {name, iv, additionalData, tagLength}: cipherOptions,
  nodeCrypto: any,
  wrapKey: boolean = false
): Uint8Array => {
  const alg = getNodeName(name, key.byteLength, (wrapKey)? params.wrapKeys : params.ciphers);

  let cipher;
  switch(name){
  case 'AES-GCM': {
    cipher = nodeCrypto.createCipheriv(alg, key, iv, {authTagLength: tagLength});
    cipher.setAAD(additionalData);
    break;
  }
  case 'AES-CTR': {
    if((<Uint8Array>iv).length === 0 || (<Uint8Array>iv).length > 16) throw new Error('InvalidIVLength');
    const counter = new Uint8Array(16);
    counter.set((<Uint8Array>iv));
    counter[15] += 1;
    cipher = nodeCrypto.createCipheriv(alg, key, counter);
    break;
  }
  default: { // AES-CBC or AES-KW
    cipher = nodeCrypto.createCipheriv(alg, key, iv);
    break;
  }}

  let body;
  let final;
  let tag;

  try {
    body = new Uint8Array(cipher.update(msg));
    final = new Uint8Array(cipher.final());

    tag = new Uint8Array([]);
    if(name === 'AES-GCM') tag = new Uint8Array(cipher.getAuthTag());
  }
  catch (e) {
    throw new Error('NodeCrypto_EncryptionFailure');
  }

  const data = new Uint8Array(body.length + final.length + tag.length);
  data.set(body);
  data.set(final, body.length);
  data.set(tag, body.length + final.length);

  return data;
};


/**
 * Decrypt data through AES Node.js crypto API.
 * @param {Uint8Array} data - Encrypted message to be decrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} nodeCrypto - NodeCrypto object, i.e., require(crypto) in Node.js.
 * @return {Uint8Array} - Decrypted message byte array.
 * @param unwrapKey {Boolean} [false] - true if called as AES-KW
 * @throws {Error} - Throws error if UnsupportedCipher or DecryptionFailure.
 */
export const decrypt = (
  data: Uint8Array,
  key: Uint8Array,
  {name, iv, additionalData, tagLength}: cipherOptions,
  nodeCrypto: any,
  unwrapKey: boolean =false
): Uint8Array => {
  const alg = getNodeName(name, key.byteLength, (unwrapKey)? params.wrapKeys : params.ciphers);

  let decipher;
  let body;
  switch(name){
  case 'AES-GCM': {
    decipher = nodeCrypto.createDecipheriv(alg, key, iv, {authTagLength: tagLength});
    decipher.setAAD(additionalData);
    body = data.slice(0, data.length - <number> tagLength);
    const tag = data.slice(data.length - <number> tagLength);
    decipher.setAuthTag(tag);
    break;
  }
  case 'AES-CTR': {
    if((<Uint8Array>iv).length === 0 || (<Uint8Array>iv).length > 16) throw new Error('InvalidIVLength');
    const counter = new Uint8Array(16);
    counter.set(<Uint8Array>iv);
    counter[15] += 1;
    decipher = nodeCrypto.createDecipheriv(alg, key, counter);
    body = data;
    break;
  }
  default : { // AES-CBC or AES-KW
    decipher = nodeCrypto.createDecipheriv(alg, key, iv);
    body = data;
    break;
  }}

  let decryptedBody;
  let final;
  try{
    decryptedBody = decipher.update(body);
    final = decipher.final();
  } catch (e) {
    throw new Error('NodeCrypto_DecryptionFailure');
  }

  const msg = new Uint8Array(final.length + decryptedBody.length);
  msg.set(decryptedBody);
  msg.set(final, decryptedBody.length);

  return msg;
};


/**
 * get node algorithm name
 * @param name {string} - name of webcrypto alg like AES-GCM
 * @param keyLength {number} - aes encryption key
 * @param dict {object} - params.ciphers or params.wrapKeys
 * @return {string} - node algorithm name
 */
const getNodeName = (name: cipherTypes, keyLength: number, dict: {[index: string]: cipherParams}) => {
  let alg = dict[name].nodePrefix;
  alg = `${alg}${(keyLength * 8).toString()}`;
  return alg + dict[name].nodeSuffix;
};
