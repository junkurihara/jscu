/**
 * nodeapi.js
 */

import params from './params.js';

/**
 * Encrypt plaintext message via AES Node.js crypto API
 * @param {Uint8Array} msg - Plaintext message to be encrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} nodeCrypto - NodeCrypto object, i.e., require(crypto) in Node.js.
 * @return {Uint8Array} - Encrypted message byte array.
 * @throws {Error} - Throws error if UnsupportedCipher.
 */
export const encrypt = (msg, key, {name, iv, additionalData, tagLength}, nodeCrypto) => {
  let alg = params.ciphers[name].nodePrefix;
  alg = `${alg}-${(key.byteLength*8).toString()}-`;
  alg = alg + params.ciphers[name].nodeSuffix;

  let cipher;
  switch(name){
  case 'AES-GCM': {
    cipher = nodeCrypto.createCipheriv(alg, key, iv, {authTagLength: tagLength});
    cipher.setAAD(additionalData);
    break;
  }
  case 'AES-CBC': {
    cipher = nodeCrypto.createCipheriv(alg, key, iv);
    break;
  }}

  const body = new Uint8Array(cipher.update(msg));
  const final = new Uint8Array(cipher.final());

  let tag = new Uint8Array([]);
  if(name === 'AES-GCM') tag = new Uint8Array(cipher.getAuthTag());

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
 * @throws {Error} - Throws error if UnsupportedCipher or DecryptionFailure.
 */
export const decrypt = (data, key, {name, iv, additionalData, tagLength}, nodeCrypto) => {
  let alg = params.ciphers[name].nodePrefix;
  alg = `${alg}-${(key.byteLength*8).toString()}-`;
  alg = alg + params.ciphers[name].nodeSuffix;

  let decipher;
  let body;
  switch(name){
  case 'AES-GCM': {
    decipher = nodeCrypto.createDecipheriv(alg, key, iv, {authTagLength: tagLength});
    decipher.setAAD(additionalData);
    body = data.slice(0, data.length - tagLength);
    const tag = data.slice(data.length - tagLength);
    decipher.setAuthTag(tag);
    break;
  }
  case 'AES-CBC': {
    decipher = nodeCrypto.createDecipheriv(alg, key, iv);
    body = data;
    break;
  }
  default: throw new Error('UnsupportedCipher');
  }

  const decryptedBody = decipher.update(body);
  let final;
  try{
    final = decipher.final();
  } catch (e) {
    throw new Error('DecryptionFailure');
  }
  const msg = new Uint8Array(final.length + decryptedBody.length);
  msg.set(decryptedBody);
  msg.set(final, decryptedBody.length);

  return msg;
};
