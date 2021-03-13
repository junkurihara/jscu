/**
 * nodeapi
 */

import * as params from './params';
import {Key} from 'js-crypto-key-utils';
import jseu from 'js-encoding-utils';
import * as oaep from './oaep';
//import BN from 'bn.js';
const BN = require('bn.js');
require('buffer');// work around

import {HashTypes, JsonWebKeyPair, ModulusLength, RSASignAlgorithm} from './typedef';

/**
 * Generate RSA public/private key pair.
 * @param {Number} modulusLength - Modulus length in bits, i.e., n.
 * @param {Uint8Array} publicExponent - Public exponent, i.e, e.
 * @param {Object} nodeCrypto - NodeCrypto object.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>}
 * @throws {Error} - Throws if KeyGenerationFailedNode.
 */
export const generateKey = async (
  modulusLength: ModulusLength, publicExponent: Uint8Array, nodeCrypto: any
): Promise<JsonWebKeyPair> => {
  const pe = new BN(publicExponent);
  const options = {
    modulusLength,
    publicExponent: pe.toNumber(),
    publicKeyEncoding: {type: 'spki', format: 'der'},
    privateKeyEncoding: {type: 'pkcs8', format: 'der'}

  };
  const nodeKeyGen = (): Promise<{publicKey: Buffer, privateKey: Buffer}> => new Promise( (resolve, reject) => {
    nodeCrypto.generateKeyPair('rsa', options,
      (err: Error, publicKey: any, privateKey: any) => {
        if (err) reject('KeyGenerationFailedNode');
        else resolve({publicKey, privateKey});
      });
  });
  const keyPairDer = await nodeKeyGen().catch( () => {throw new Error('KeyGenerationFailedNode');});
  const publicObj = new Key('der', new Uint8Array(keyPairDer.publicKey));
  const privateObj = new Key('der', new Uint8Array(keyPairDer.privateKey));
  return {
    publicKey: <JsonWebKey>await publicObj.export('jwk'),
    privateKey: <JsonWebKey>await privateObj.export('jwk')
  };
};

/**
 * RSA signing via RSA-PSS or RSASSA-PKCS1-v1_5 in Node.js.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key for signing in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'.
 * @param {Object} algorithm - Object to specify algorithm parameters.
 * @param {Object} nodeCrypto - NodeCrypto object
 * @return {Promise<Uint8Array>} - Byte array of raw signature.
 * @throws {Error} - Throws if NotPublicKeyForRSASign.
 */
export const signRsa = async (
  msg: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes,
  algorithm: RSASignAlgorithm,
  nodeCrypto: any
): Promise<Uint8Array> => {
  const keyObj = new Key('jwk', privateJwk);
  if(!keyObj.isPrivate) throw new Error('NotPrivateKeyForRSASign');
  const privatePem = <string>await keyObj.export('pem');
  const signing = nodeCrypto.createSign(params.hashes[hash].nodeName);
  signing.update(msg);
  const opt = (algorithm.name === 'RSA-PSS') ? {saltLength: algorithm.saltLength, padding: nodeCrypto.constants.RSA_PKCS1_PSS_PADDING} : {};
  return new Uint8Array(signing.sign(Object.assign({key: privatePem}, opt)));
};

/**
 /**
 * Verification of RSA signature via RSA-PSS or RSASSA-PKCS1-v1_5 in Node.js.
 * @param {Uint8Array} msg - Byte array of message signed.
 * @param {Uint8Array} signature - Byte array of raw signature.
 * @param {JsonWebKey} publicJwk - public key for signing in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'.
 * @param {Object} algorithm - Object to specify algorithm parameters.
 * @param {Object} nodeCrypto - NodeCrypto object
 * @return {Promise<boolean>} - Result of verification.
 * @throws {Error} - Throws if NotPublicKeyForRSAVerify.
 */
export const verifyRsa = async (
  msg: Uint8Array,
  signature: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes,
  algorithm: RSASignAlgorithm,
  nodeCrypto: any
): Promise<boolean> => {
  const keyObj = new Key('jwk', publicJwk);
  if(keyObj.isPrivate) throw new Error('NotPublicKeyForRSAVerify');
  const publicPem = <string>await keyObj.export('pem', {outputPublic: true});
  const verify = nodeCrypto.createVerify(params.hashes[hash].nodeName);
  verify.update(msg);
  const opt = (algorithm.name === 'RSA-PSS') ? {saltLength: algorithm.saltLength, padding: nodeCrypto.constants.RSA_PKCS1_PSS_PADDING} : {};
  return verify.verify(Object.assign({key: publicPem}, opt), signature);
};

/**
 * RSA Encryption via NodeCrypto.
 * @param {Uint8Array} msg - Byte array of message to be encrypted
 * @param {JsonWebKey} publicJwk - Public key in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} label - RSA-OAEP label.
 * @param {Object} nodeCrypto - NodeCrypto object.
 * @return {Promise<Uint8Array>} - Encrypted message.
 * @throws {Error} - Throws if NotPublicKeyForRSAEncrypt.
 */
export const encryptRsa = async (
  msg: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes = 'SHA-256',
  label: Uint8Array = new Uint8Array([]),
  nodeCrypto: any
): Promise<Uint8Array> => {
  const keyObj = new Key('jwk', publicJwk);
  if(keyObj.isPrivate) throw new Error('NotPublicKeyForRSAEncrypt');
  const publicPem = await keyObj.export('pem', {outputPublic: true});

  let encrypted;
  if(hash === 'SHA-1') {
    encrypted = nodeCrypto.publicEncrypt({key: publicPem, padding: nodeCrypto.constants.RSA_PKCS1_OAEP_PADDING}, msg);
  } else {
    // https://tools.ietf.org/html/rfc3447
    const em = await oaep.emeOaepEncode(msg, label, jseu.encoder.decodeBase64Url(<string>(publicJwk.n)).length, hash);
    encrypted = nodeCrypto.publicEncrypt({key: publicPem, padding: nodeCrypto.constants.RSA_NO_PADDING}, em);
  }
  return new Uint8Array(encrypted);
};

/**
 * RSA Decryption via NodeCrypto.
 * @param {Uint8Array} data - encrypted message byte array.
 * @param {JsonWebKey} privateJwk - Private key in JWK format.
 * @param {String} hash - Name of hash algorithm like 'SHA-256'
 * @param {Uint8Array} label - RSA-OAEP label.
 * @param {Object} nodeCrypto - NodeCrypto object.
 * @return {Promise<Uint8Array>} - Decrypted message.
 * @throws {Error} - Throws if NotPrivateKeyForRSADecrypt.
 */
export const decryptRsa = async (
  data: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes = 'SHA-256',
  label: Uint8Array = new Uint8Array([]),
  nodeCrypto: any
): Promise<Uint8Array> => {
  const keyObj = new Key('jwk', privateJwk);
  if(!keyObj.isPrivate) throw new Error('NotPrivateKeyForRSADecrypt');
  const privatePem = <string>await keyObj.export('pem');

  let decrypted;
  if(hash === 'SHA-1') {
    decrypted = nodeCrypto.privateDecrypt({key: privatePem, padding: nodeCrypto.constants.RSA_PKCS1_OAEP_PADDING}, data);
  } else {
    // https://tools.ietf.org/html/rfc3447
    const em = nodeCrypto.privateDecrypt({key: privatePem, padding: nodeCrypto.constants.RSA_NO_PADDING}, data);
    decrypted = await oaep.emeOaepDecode(new Uint8Array(em), label, jseu.encoder.decodeBase64Url(<string>(privateJwk.n)).length, hash);
  }
  return new Uint8Array(decrypted);
};


