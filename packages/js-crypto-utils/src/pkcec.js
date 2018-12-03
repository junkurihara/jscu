/**
 * pkcec.js
 */

import random from 'js-crypto-random/dist/index.js';
import ec from 'js-crypto-ec/dist/index.js';
import hkdf from 'js-crypto-hkdf/dist/index.js';
import aes from 'js-crypto-aes/dist/index.js';

import params from './params.js';

export async function encrypt(
  msg, publicKey,
  { privateKey, hash='SHA-256', encrypt='AES-GCM', keyLength=32, iv=null, info='' }
) {
  const sharedSecret = await ec.deriveSecret(publicKey, privateKey);
  const sessionKeySalt = await hkdf.compute(sharedSecret, hash, keyLength, info);

  // TODO: other iv-required algorithms
  switch (encrypt) {
  case 'AES-GCM': {
    iv = (!iv)
      ? await random.getRandomBytes(params.ciphers[encrypt].ivLength)
      : iv;
    break;
  }
  default:
    throw new Error('UnsupportedSessionKeyAlgorithm');
  }

  const data = await aes.encrypt(msg, sessionKeySalt.key, {name: encrypt, iv}); // no specification of tagLength and additionalData

  return {data, salt: sessionKeySalt.salt, iv};
}


export async function decrypt(
  data, privateKey,
  { publicKey, hash='SHA-256', encrypt='AES-GCM', keyLength=32, info='', salt=null, iv=null }
) {
  const sharedSecret = await ec.deriveSecret(publicKey, privateKey);
  const sessionKeySalt = await hkdf.compute(sharedSecret, hash, keyLength, info, salt);

  let msg;
  if(Object.keys(params.ciphers).indexOf(encrypt) >= 0){
    msg = await aes.decrypt(data, sessionKeySalt.key, {name: encrypt, iv}); // no specification of tagLength and additionalData
  }
  else throw new Error('UnsupportedSessionKeyAlgorithm');

  return msg;
}