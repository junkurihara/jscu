/**
 * pkc.js
 */

import ec from 'js-crypto-ec';
import rsa from 'js-crypto-rsa';
import { Key } from 'js-crypto-key-utils';
import {
  DecryptionOption, ECDecryptionOption,
  ECEncryptionOption,
  ECKeyGenerationOption, ECSigningOption, EncryptionOption,
  HashTypes,
  KeyGenOptions,
  KeyPair,
  KeyTypes, PKCCiphertextObject, RSAEncryptionOption,
  RSAKeyGenerationOption, RSASigningOption,
  SigningOption
} from './typedef';
import * as pkcec from './pkcec';
import * as params from './params';

const cloneDeep = require('lodash.clonedeep'); // work around
// import cloneDeep from 'lodash.clonedeep';

/**
 * Generate key pair in JWK format
 * @param {'EC'|'RSA'} [keyType='EC'] - Type of public/private key.
 * @param {ECKeyGenerationOption|RSAKeyGenerationOption} [options={}] - Key generation options.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>} - Generated key pair in JWK format.
 */
export const generateKey = async (
  keyType: KeyTypes = 'EC',
  options: KeyGenOptions,
): Promise<KeyPair> => {
  const localOpt = cloneDeep(options);
  let kp: KeyPair;
  if (keyType === 'EC'){
    kp = await ec.generateKey((<ECKeyGenerationOption>localOpt).namedCurve);
  }
  else if (keyType === 'RSA') {
    if(typeof (<RSAKeyGenerationOption>localOpt).publicExponent === 'undefined'){
      (<RSAKeyGenerationOption>localOpt).publicExponent = new Uint8Array([0x01, 0x00, 0x01]);
    }
    kp = await rsa.generateKey(
      (<RSAKeyGenerationOption>localOpt).modulusLength,
      (<RSAKeyGenerationOption>localOpt).publicExponent
    );
  }
  else throw new Error('UnsupportedKeyType');

  return {
    publicKey: new Key('jwk', kp.publicKey),
    privateKey: new Key('jwk', kp.privateKey)
  };
};


/**
 * Sign message with given private key in jwk
 * @param {Uint8Array} msg - Message byte array to be signed.
 * @param {Key} privateKey - Private key object for signing.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @param {RSASigningOption|ECSigningOption} [options={}] - Signing options.
 * @return {Promise<Uint8Array>} - Signature byte array.
 * @throws {Error} - Throws if NonKeyObject or UnsupportedKeyType.
 */
export const sign = async (
  msg: Uint8Array,
  privateKey: any,
  hash: HashTypes = 'SHA-256',
  options: SigningOption = undefined
): Promise<Uint8Array> => {
  if(!(privateKey instanceof Key)) throw new Error('NonKeyObject');
  const privateJwk = <JsonWebKey>await privateKey.export('jwk');

  let signature;
  if (privateJwk.kty === 'EC'){
    const localOpt: ECSigningOption = (typeof options === 'undefined') ? {format: 'raw'}: cloneDeep(<ECSigningOption>options);
    signature = await ec.sign(msg, privateJwk, hash, localOpt.format);
  }
  else if (privateJwk.kty === 'RSA') {
    const localOpt: RSASigningOption = (typeof options === 'undefined') ? {name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}: cloneDeep(<RSASigningOption>options);
    signature = await rsa.sign(msg, privateJwk, hash, localOpt);
  }
  else throw new Error('UnsupportedKeyType');

  return signature;
};

/**
 * Verify message with given public key
 * @param {Uint8Array} msg - A plaintext message to be verified.
 * @param {Uint8Array} sig - Signature byte array.
 * @param {Key} publicKey - Public key object for verification.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @param {RSASigningOption|ECSigningOption} [options={}] - Signing options.
 * @return {Promise<boolean>} - Result of verification.
 * @throws {Error} - Throws if NonKeyObject or UnsupportedKeyType.
 */
export const verify = async (
  msg: Uint8Array,
  sig: Uint8Array,
  publicKey: any, // TODO
  hash: HashTypes = 'SHA-256',
  options: SigningOption = undefined
): Promise<boolean> => {
  if(!(publicKey instanceof Key)) throw new Error('NonKeyObject');
  const publicJwk = <JsonWebKey>await publicKey.export('jwk');

  let valid: boolean;
  if (publicJwk.kty === 'EC'){
    const localOpt: ECSigningOption = (typeof options === 'undefined') ? {format: 'raw'}: cloneDeep(<ECSigningOption>options);
    valid = await ec.verify(msg, sig, publicJwk, hash, localOpt.format);
  }
  else if (publicJwk.kty === 'RSA') {
    const localOpt: RSASigningOption = (typeof options === 'undefined') ? {name: 'RSA-PSS', saltLength: params.hashes[hash].hashSize}: cloneDeep(<RSASigningOption>options);
    valid = await rsa.verify(msg, sig, publicJwk, hash, localOpt);
  }
  else throw new Error('UnsupportedKeyType');

  return valid;
};



/**
 * Encryption with public key algorithm. in case of ECDH.
 * Session key is derived from HKDF and the data itself will be encrypted by symmetric cipher.
 * @param {Uint8Array} msg - Plaintext message to be encrypted.
 * @param {Key} publicKey - Public key object.
 * @param {RSAEncryptionOption|ECEncryptionOptions} [options={}] - Encryption options.
 * @return {Promise<PKCCiphertextObject>} - Encrypted message object.
 * @throws {Error} - Throws if NonKeyObject, MissingOrInvalidPrivateKeyForECDH, or UnsupportedKeyType.
 */
export const encrypt = async (
  msg: Uint8Array,
  publicKey: any,
  options: EncryptionOption = undefined
): Promise<PKCCiphertextObject> => {
  if(!(publicKey instanceof Key)) throw new Error('NonKeyObject');
  const publicJwk = <JsonWebKey>await publicKey.export('jwk');

  let ciphertext: PKCCiphertextObject;
  if (publicJwk.kty === 'EC'){
    const localOpt: ECEncryptionOption = cloneDeep(<ECEncryptionOption>options);
    if(!localOpt.privateKey || !(localOpt.privateKey instanceof Key)) throw new Error('MissingOrInvalidPrivateKeyForECDH');
    localOpt.privateKey = <JsonWebKey>await localOpt.privateKey.export('jwk');
    ciphertext = await pkcec.encryptEc(msg, publicJwk, localOpt);
  }
  else if (publicJwk.kty === 'RSA') {
    const localOpt: RSAEncryptionOption = cloneDeep(<RSAEncryptionOption>options);
    if(typeof localOpt.hash !== 'undefined') localOpt.hash = 'SHA-256';
    if(typeof localOpt.label !== 'undefined') localOpt.label = new Uint8Array([]);
    ciphertext = {data: await rsa.encrypt(msg, publicJwk, localOpt.hash, localOpt.label)};
  }
  else throw new Error('UnsupportedKeyType');

  return ciphertext;
};


/**
 * Decryption with public key algorithm. in case of ECDH
 * Session key is derived from HKDF and the data itself will be decrypted by symmetric cipher.
 * @param {Uint8Array} data - Encrypted message body, i.e., PKCCiphertextObject.data.
 * @param {Key} privateKey - Private key object
 * @param {RSAEncryptionOption|ECDecryptionOptions} [options={}] - Decryption Options.
 * @return {Promise<Uint8Array>} - Decrypted message byte array.
 * @throws {Error} - Throws if NonKeyObject, MissingPublicKeyForECDH, or UnsupportedKeyType.
 */
export const decrypt = async (
  data: Uint8Array,
  privateKey: any,
  options: DecryptionOption
): Promise<Uint8Array> => {
  if(!(privateKey instanceof Key)) throw new Error('NonKeyObject');
  const privateJwk = <JsonWebKey>await privateKey.export('jwk');

  let msg;
  if (privateJwk.kty === 'EC'){
    const localOpt: ECDecryptionOption = cloneDeep(<ECDecryptionOption>options);
    if(!localOpt.publicKey) throw new Error('MissingPublicKeyForECDH');
    localOpt.publicKey = <JsonWebKey>await localOpt.publicKey.export('jwk');
    msg = await pkcec.decryptEc(data, privateJwk, localOpt);
  }
  else if (privateJwk.kty === 'RSA') {
    const localOpt: RSAEncryptionOption = cloneDeep(<RSAEncryptionOption>options);
    if(typeof localOpt.hash !== 'undefined') localOpt.hash = 'SHA-256';
    if(typeof localOpt.label !== 'undefined') localOpt.label = new Uint8Array([]);
    msg = await rsa.decrypt(data, privateJwk, localOpt.hash, localOpt.label);
  }
  else throw new Error('UnsupportedKeyType');

  return msg;
};
