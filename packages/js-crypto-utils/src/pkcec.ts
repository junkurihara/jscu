/**
 * pkcec.js
 */

import random from 'js-crypto-random';
import ec from 'js-crypto-ec';
import hkdf from 'js-crypto-hkdf';
import aes from 'js-crypto-aes';

import * as params from './params';
import {ECDecryptionOption, ECEncryptionOption} from './typedef';

export const encryptEc = async (
  msg: Uint8Array,
  publicKey: JsonWebKey,
  { privateKey, hash='SHA-256', encrypt='AES-GCM', keyLength=32, info='' }: ECEncryptionOption
) => {
  const sharedSecret = await ec.deriveSecret(publicKey, privateKey);
  const hkdfOutput = await hkdf.compute(sharedSecret, hash, keyLength, info); // use HKDF for key derivation

  let data;
  if(encrypt !== 'AES-KW') {
    const iv = await random.getRandomBytes(<number>params.ciphers[encrypt].ivLength);
    data = await aes.encrypt(msg, hkdfOutput.key, {name: encrypt, iv}); // no specification of tagLength and additionalData
    return {data, salt: hkdfOutput.salt, iv};
  }
  else {
    data = await aes.wrapKey(msg, hkdfOutput.key, {name: encrypt});
    return {data, salt: hkdfOutput.salt};
  }
};


export const decryptEc = async (
  data: Uint8Array,
  privateKey: JsonWebKey,
  { publicKey, hash='SHA-256', encrypt='AES-GCM', keyLength=32, info='', salt, iv }: ECDecryptionOption
) => {
  const sharedSecret = await ec.deriveSecret(publicKey, privateKey);
  const hkdfOutput = await hkdf.compute(sharedSecret, hash, keyLength, info, salt);

  if(encrypt !== 'AES-KW') {
    return aes.decrypt(data, hkdfOutput.key, {name: encrypt, iv}); // no specification of tagLength and additionalData
  }
  else {
    return aes.unwrapKey(data, hkdfOutput.key, {name: encrypt});
  }
};

