/**
 * webapi.js
 */

import jseu from 'js-encoding-utils';

/**
 * Generate RSA public/private key pair.
 * @param {Number} modulusLength - Modulus length in bits, i.e., n.
 * @param {Uint8Array} publicExponent - Public exponent, i.e, e.
 * @param {Object} webCrypto - WebCryptoSubtle object, i.e., window.crypto.subtle or window.msCrypto.subtle.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>}
 */
export async function generateKey(modulusLength, publicExponent, webCrypto){
  // generate rsa key
  // hash is used for signing and verification. never be used for key generation
  let publicKey;
  let privateKey;
  const alg = {name: 'RSA-OAEP', modulusLength, publicExponent, hash: {name: 'SHA-256'}};

  if(typeof window.msCrypto === 'undefined') {
    const keys = await webCrypto.generateKey(alg, true, ['encrypt', 'decrypt']);
    publicKey = await webCrypto.exportKey('jwk', keys.publicKey); // export keys in jwk format
    privateKey = await webCrypto.exportKey('jwk', keys.privateKey); // export keys in jwk format
  }
  else {
    const keys = await msGenerateKey(alg, true, ['encrypt', 'decrypt'], webCrypto);
    publicKey = await msExportKey('jwk', keys.publicKey, webCrypto);
    privateKey = await msExportKey('jwk', keys.privateKey, webCrypto);
  }

  // delete optional entries to export as general rsa sign/encrypt key
  ['key_ops', 'alg', 'ext'].forEach((elem) => {
    delete publicKey[elem];
    delete privateKey[elem];
  });

  return {publicKey, privateKey};
}

/**
 * RSA signing via RSA-PSS or RSASSA-PKCS1-v1_5 in WebAPI.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key for signing in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'.
 * @param {RSASignAlgorithm} algorithm - Object to specify algorithm parameters.
 * @param {Object} webCrypto - WebCryptoSubtle object
 * @return {Promise<Uint8Array>} - Byte array of raw signature.
 * @throws {Error} - if RSA-PSS in IE.
 */
export async function sign(msg, privateJwk, hash, algorithm, webCrypto) {
  const algo = {name: algorithm.name, hash: {name: hash}, saltLength: algorithm.saltLength};

  let signature;
  if(typeof window.msCrypto === 'undefined') {
    const key = await webCrypto.importKey('jwk', privateJwk, algo, false, ['sign']);
    signature = await webCrypto.sign(algo, key, msg);
  }
  else {
    if(algorithm.name === 'RSA-PSS') throw new Error('IE does not support RSA-PSS. Use RSASSA-PKCS1-v1_5.');
    const key = await msImportKey('jwk', privateJwk, algo, false, ['sign'], webCrypto);
    signature = await msSign(algo, key, msg, webCrypto);
  }
  return new Uint8Array(signature);
}

/**
 * Verification of RSA signature via RSA-PSS or RSASSA-PKCS1-v1_5 in WebAPI.
 * @param {Uint8Array} msg - Byte array of message signed.
 * @param {Uint8Array} signature - Byte array of raw signature.
 * @param {JsonWebKey} publicJwk - public key for signing in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'.
 * @param {RSASignAlgorithm} algorithm - Object to specify algorithm parameters.
 * @param {Object} webCrypto - WebCryptoSubtle object
 * @return {Promise<boolean>} - Result of verification.
 * @throws {Error} - if RSA-PSS in IE.
 */
export async function verify(msg, signature, publicJwk, hash, algorithm, webCrypto){
  const algo = {name: algorithm.name, hash: {name: hash}, saltLength: algorithm.saltLength};

  let valid;
  if(typeof window.msCrypto === 'undefined') {
    const key = await webCrypto.importKey('jwk', publicJwk, algo, false, ['verify']);
    valid = await webCrypto.verify(algo, key, signature, msg);
  }
  else {
    if(algorithm.name === 'RSA-PSS') throw new Error('IE does not support RSA-PSS. Use RSASSA-PKCS1-v1_5.');
    const key = await msImportKey('jwk', publicJwk, algo, false, ['verify'], webCrypto);
    valid = await msVerify(algo, key, signature, msg, webCrypto);
  }
  return valid;
}

/**
 * RSA Encryption via WebAPI.
 * @param {Uint8Array} msg - Byte array of message to be encrypted
 * @param {JsonWebKey} publicJwk - Public key in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} label - RSA-OAEP label.
 * @param {Object} webCrypto - WebCryptoSubtle object
 * @return {Promise<Uint8Array>} - Encrypted message.
 * @throws {Error} - if RSA-OAEP label is specified in IE.
 */
export async function encrypt(msg, publicJwk, hash, label, webCrypto){
  const algo = {name: 'RSA-OAEP', hash: {name: hash}, label};

  let encrypted;
  if(typeof window.msCrypto === 'undefined') {
    const key = await webCrypto.importKey('jwk', publicJwk, algo, false, ['encrypt']);
    encrypted = await webCrypto.encrypt(algo, key, msg);
  }
  else {
    if (label.toString() !== (new Uint8Array()).toString()) throw new Error('IE does not support RSA-OAEP label.');
    const key = await msImportKey('jwk', publicJwk, algo, false, ['encrypt'], webCrypto);
    encrypted = await msEncrypt(algo, key, msg, webCrypto);
  }
  return new Uint8Array(encrypted);
}

/**
 * RSA Decryption via WebAPI.
 * @param {Uint8Array} msg - encrypted message byte array.
 * @param {JsonWebKey} privateJwk - Private key in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} label - RSA-OAEP label.
 * @param {Object} webCrypto - WebCryptoSubtle object.
 * @return {Promise<Uint8Array>} - Decrypted message.
 * @throws {Error} - if RSA-OAEP label is specified in IE.
 */
export async function decrypt(msg, privateJwk, hash, label, webCrypto){
  const algo = {name: 'RSA-OAEP', hash: {name: hash}, label};

  let decrypted;
  if(typeof window.msCrypto === 'undefined') {
    const key = await webCrypto.importKey('jwk', privateJwk, algo, false, ['decrypt']);
    decrypted = await webCrypto.decrypt(algo, key, msg);
  }
  else {
    if (label.toString() !== (new Uint8Array()).toString()) throw new Error('IE does not support RSA-OAEP label.');
    const key = await msImportKey('jwk', privateJwk, algo, false, ['decrypt'], webCrypto);
    decrypted = await msDecrypt(algo, key, msg, webCrypto);
  }
  return new Uint8Array(decrypted);
}


/////////////////////////////////////////////
// function definitions for IE
const msGenerateKey = (alg, ext, use, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.generateKey(alg, ext, use);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('KeyGenerationFailed'); };
});
const msImportKey = (type, key, alg, ext, use, webCrypto) => new Promise ( (resolve, reject) => {
  let inputKey = key;
  if(type === 'jwk'){
    inputKey = JSON.stringify(key);
    inputKey = jseu.encoder.stringToArrayBuffer(inputKey);
  }
  const op = webCrypto.importKey(type, inputKey, alg, ext, use);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('KeyImportingFailed'); };
});
const msExportKey = (type, key, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.exportKey(type, key);
  op.oncomplete = (evt) => {
    let output = evt.target.result;
    if(type === 'jwk'){
      output = jseu.encoder.arrayBufferToString(new Uint8Array(output));
      output = JSON.parse(output);
    }
    resolve(output);
  };
  op.onerror = () => { reject('KeyExportingFailed'); };
});
const msEncrypt = (alg, key, msg, webCrypto) => new Promise ( (resolve, reject) => {
  delete alg.label; // if exists, the MSCrypto doesn't work...wtf
  const op = webCrypto.encrypt(alg, key, msg);
  op.oncomplete = (evt) => {resolve(evt.target.result); };
  op.onerror = () => { reject('EncryptionFailure'); };
});
const msDecrypt = (alg, key, data, webCrypto) => new Promise ( (resolve, reject) => {
  delete alg.label; // if exists, the MSCrypto doesn't work...wtf
  const op = webCrypto.decrypt(alg, key, data);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('DecryptionFailure'); };
});
const msSign = (alg, key, msg, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.sign(alg, key, msg);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('SigningFailed'); };
});
const msVerify = (alg, key, sig, msg, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.verify(alg, key, sig, msg);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('VerificationFailed'); };
});