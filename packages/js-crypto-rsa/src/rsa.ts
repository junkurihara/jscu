/**
 * rsa.js
 */

import * as util from 'js-crypto-env';
import jseu from 'js-encoding-utils';

import * as webapi from './webapi';
import * as nodeapi from './nodeapi';
import {HashTypes, JsonWebKeyPair, ModulusLength, RSASignAlgorithm} from './typedef';
import * as params from './params';
import {checkLength as checkOaepLength} from './oaep';
import {checkLength as checkPssLength} from './pss';

/**
 * Generate RSA public/private key pair.
 * @param {Number} [modulusLength=2048] - Modulus length in bits, i.e., n.
 * @param {Uint8Array} [publicExponent=new Uint8Array([0x01, 0x00, 0x01])] - Public exponent, i.e, e.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>}
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const generateKey = async (
  modulusLength: ModulusLength = 2048,
  publicExponent: Uint8Array = new Uint8Array([0x01, 0x00, 0x01])
): Promise<JsonWebKeyPair> => {
  const env = util.getCrypto();

  let pure: boolean = false;
  let keyPair: JsonWebKeyPair;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.generateKey === 'function' && typeof env.crypto.exportKey === 'function') { // for web API
      keyPair = await webapi.generateKey(modulusLength, publicExponent, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      keyPair = await nodeapi.generateKey(modulusLength, publicExponent, env.crypto);
    } else {
      pure = true;
      throw new Error('UnsupportedPureJsEnvironment');
    }

    return keyPair;
  }
  catch(e: unknown){
    if (e instanceof Error) {
      if (pure) throw new Error(e.message);
      else throw new Error(`UnsupportedEnvironment: ${e.message}`);
    } else {
      throw new Error('UnsupportedEnvironment');
    }
  }
};

/**
 * RSA signing via RSA-PSS or RSASSA-PKCS1-v1_5.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key for signing in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @param {RSASignAlgorithm} [algorithm={name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}] - Object to specify algorithm parameters.
 * @return {Promise<Uint8Array>} - Byte array of raw signature.
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const sign = async (
  msg: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes = 'SHA-256',
  algorithm: RSASignAlgorithm = {name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}
) => {
  // assertion
  if (privateJwk.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  if (algorithm.name === 'RSA-PSS'){
    checkPssLength('sign',
      {k: jseu.encoder.decodeBase64Url(<string>(privateJwk.n)).length, hash, saltLength: <number>algorithm.saltLength}
    );
  }

  const env = util.getCrypto();


  let pure: boolean = false;
  let signature: Uint8Array;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.sign === 'function' && typeof env.crypto.importKey === 'function') { // for web API
      signature = await webapi.signRsa(msg, privateJwk, hash, algorithm, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      signature = await nodeapi.signRsa(msg, privateJwk, hash, algorithm, env.crypto);
    } else {
      pure = true;
      throw new Error('UnsupportedPureJsEnvironment');
    }

    return signature;
  }
  catch(e: unknown){
    if (e instanceof Error) {
      if (pure) throw new Error(e.message);
      else throw new Error(`UnsupportedEnvironment: ${e.message}`);
    } else {
      throw new Error('UnsupportedEnvironment');
    }
  }

};

/**
 * Verification of RSA signature via RSA-PSS or RSASSA-PKCS1-v1_5.
 * @param {Uint8Array} msg - Byte array of message signed.
 * @param {Uint8Array} signature - Byte array of raw signature.
 * @param {JsonWebKey} publicJwk - public key for signing in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @param {RSASignAlgorithm} [algorithm={name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}] - Object to specify algorithm parameters.
 * @return {Promise<boolean>} - Result of verification.
 * @throws {Error} - Throws if InvalidSignatureFormat, or UnsupportedEnvironment.
 */
export const verify = async (
  msg: Uint8Array,
  signature: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes = 'SHA-256',
  algorithm: RSASignAlgorithm = {name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}) => {
  // assertion
  if (publicJwk.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  if (algorithm.name === 'RSA-PSS'){
    checkPssLength('verify', {k: jseu.encoder.decodeBase64Url(<string>(publicJwk.n)).length, hash, saltLength: <number>(algorithm.saltLength)});
  }

  const env = util.getCrypto();

  let pure: boolean = false;
  let valid: boolean;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.verify === 'function' && typeof env.crypto.importKey === 'function') { // for web API
      valid = await webapi.verifyRsa(msg, signature, publicJwk, hash, algorithm, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      valid = await nodeapi.verifyRsa(msg, signature, publicJwk, hash, algorithm, env.crypto);
    } else {
      pure = true;
      throw new Error('UnsupportedPureJsEnvironment');
    }

    return valid;
  }
  catch(e: unknown){
    if (e instanceof Error) {
      if (pure) throw new Error(e.message);
      else throw new Error(`UnsupportedEnvironment: ${e.message}`);
    } else {
      throw new Error('UnsupportedEnvironment');
    }
  }
};

/**
 * RSA-OAEP Encryption
 * @param {Uint8Array} msg - Byte array of message to be encrypted.
 * @param {JsonWebKey} publicJwk - Public/Private key in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} [label=new Uint8Array([])] - RSA-OAEP label.
 * @return {Promise<Uint8Array>} - Encrypted message.
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const encrypt = async (
  msg: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes = 'SHA-256',
  label: Uint8Array = new Uint8Array([])
): Promise<Uint8Array> => {
  // assertion
  if (publicJwk.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  checkOaepLength('encrypt',
    { k: jseu.encoder.decodeBase64Url(<string>(publicJwk.n)).length, label, hash, mLen: msg.length, cLen: 0}
  );

  const env = util.getCrypto();

  let pure: boolean = false;
  let encrypted: Uint8Array;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.encrypt === 'function' && typeof env.crypto.importKey === 'function') { // for web API
      encrypted = await webapi.encryptRsa(msg, publicJwk, hash, label, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      encrypted = await nodeapi.encryptRsa(msg, publicJwk, hash, label, env.crypto);
    } else {
      pure = true;
      throw new Error('UnsupportedPureJsEnvironment');
    }

    return encrypted;
  }
  catch(e: unknown){
    if (e instanceof Error) {
      if (pure) throw new Error(e.message);
      else throw new Error(`UnsupportedEnvironment: ${e.message}`);
    } else {
      throw new Error('UnsupportedEnvironment');
    }
  }
};

/**
 * RSA-OAEP Decryption.
 * @param {Uint8Array} data - Byte array of encrypted message to be decrypted.
 * @param {JsonWebKey} privateJwk - Private key in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} [label=new Uint8Array([])] - RSA-OAEP label.
 * @return {Promise<Uint8Array>} - Decrypted message.
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const decrypt = async (
  data: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes = 'SHA-256',
  label: Uint8Array = new Uint8Array([])
): Promise<Uint8Array> => {
  // assertion
  if (privateJwk.kty !== 'RSA') throw new Error('InvalidJwkRsaKey');
  checkOaepLength('decrypt',
    { k: jseu.encoder.decodeBase64Url(<string>(privateJwk.n)).length, label, hash, mLen: 0, cLen: data.length}
  );

  const env = util.getCrypto();

  let pure: boolean = false;
  let decrypted: Uint8Array;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.decrypt === 'function' && typeof env.crypto.importKey === 'function') { // for web API
      decrypted = await webapi.decryptRsa(data, privateJwk, hash, label, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      decrypted = await nodeapi.decryptRsa(data, privateJwk, hash, label, env.crypto);
    } else {
      pure = true;
      throw new Error('UnsupportedPureJsEnvironment');
    }

    return decrypted;
  }
  catch(e: unknown) {
    if (e instanceof Error) {
      if (pure) throw new Error(e.message);
      else throw new Error(`UnsupportedEnvironment: ${e.message}`);
    } else {
      throw new Error('UnsupportedEnvironment');
    }
  }
};
