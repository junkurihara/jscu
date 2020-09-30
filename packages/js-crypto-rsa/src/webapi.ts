/**
 * webapi.js
 */

import {HashTypes, ModulusLength, RSASignAlgorithm} from './typedef';

/**
 * Generate RSA public/private key pair.
 * @param {Number} modulusLength - Modulus length in bits, i.e., n.
 * @param {Uint8Array} publicExponent - Public exponent, i.e, e.
 * @param {Object} webCrypto - WebCryptoSubtle object, i.e., window.crypto.subtle
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>}
 */
export const generateKey = async (
  modulusLength: ModulusLength,
  publicExponent: Uint8Array,
  webCrypto: any
) => {
  // generate rsa key
  // hash is used for signing and verification. never be used for key generation
  const alg = {name: 'RSA-OAEP', modulusLength, publicExponent, hash: {name: 'SHA-256'}};

  const keys = await webCrypto.generateKey(alg, true, ['encrypt', 'decrypt']);
  const publicKey: JsonWebKey = await webCrypto.exportKey('jwk', keys.publicKey); // export keys in jwk format
  const privateKey: JsonWebKey = await webCrypto.exportKey('jwk', keys.privateKey); // export keys in jwk format

  // delete optional entries to export as general rsa sign/encrypt key
  delete publicKey.key_ops;
  delete publicKey.alg;
  delete publicKey.ext;
  delete privateKey.key_ops;
  delete privateKey.alg;
  delete privateKey.ext;

  return {publicKey, privateKey};
};

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
export async function signRsa(
  msg: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes,
  algorithm: RSASignAlgorithm,
  webCrypto: any
): Promise<Uint8Array> {
  const algo = {name: algorithm.name, hash: {name: hash}, saltLength: algorithm.saltLength};

  const key = await webCrypto.importKey('jwk', privateJwk, algo, false, ['sign']);
  const signature = await webCrypto.sign(algo, key, msg);

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
export const verifyRsa = async (
  msg: Uint8Array,
  signature: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes,
  algorithm: RSASignAlgorithm,
  webCrypto: any
): Promise<boolean> => {
  const algo = {name: algorithm.name, hash: {name: hash}, saltLength: algorithm.saltLength};

  const key = await webCrypto.importKey('jwk', publicJwk, algo, false, ['verify']);
  return webCrypto.verify(algo, key, signature, msg);
};

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
export const encryptRsa = async (
  msg: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes,
  label: Uint8Array,
  webCrypto: any
): Promise<Uint8Array> => {
  const algo = {name: 'RSA-OAEP', hash: {name: hash}, label};

  const key = await webCrypto.importKey('jwk', publicJwk, algo, false, ['encrypt']);
  const encrypted = await webCrypto.encrypt(algo, key, msg);

  return new Uint8Array(encrypted);
};

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
export const decryptRsa = async (
  msg: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes,
  label: Uint8Array,
  webCrypto: any
) => {
  const algo = {name: 'RSA-OAEP', hash: {name: hash}, label};

  const key = await webCrypto.importKey('jwk', privateJwk, algo, false, ['decrypt']);
  const decrypted = await webCrypto.decrypt(algo, key, msg);

  return new Uint8Array(decrypted);
};
