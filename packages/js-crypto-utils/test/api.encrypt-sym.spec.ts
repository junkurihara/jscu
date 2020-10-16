import {getTestEnv} from './prepare';
const env = getTestEnv();
//const jscu = env.library;
const envName = env.envName;

import random from 'js-crypto-random';
import aes from 'js-crypto-aes';
import pbdkf from 'js-crypto-pbkdf';

describe(`${envName}: Symmetric Encryption test with PBKDF2`, () => {
  let msg: Uint8Array;
  const password = 'HelloWorldMyPassword';
  beforeAll( async () => {
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  },10000);

  it('AES Encryption/Decryption with Passwords via PBKDF2', async () => {
    //////////////////////
    // Sender
    //////////////////////
    // derive key from password
    // following params (salt, iterationCount, aesKeyLen, hash) must be shared with receiver.
    const salt = random.getRandomBytes(32); // Uint8Array -> must be shared with receiver
    const iterationCount = 2048; // must be shared with receiver
    const aesKeyLen = 32; // AES key length, 16 or 32.
    const hash = 'SHA-256'; // SHA-384, SHA-512, etc.

    const aesKeySender = await pbdkf.pbkdf2(
      password,
      salt,
      iterationCount,
      aesKeyLen,
      hash
    );

    // encryption
    // following iv must be shared with receiver.
    const iv = random.getRandomBytes(12); // 12 bytes IV in Uint8Array for AES-GCM mode
    const additionalData = new Uint8Array([]); // optional AAD
    const encrypted = await aes.encrypt(
      msg,
      aesKeySender,
      { name: 'AES-GCM',
        iv,
        additionalData,
        tagLength: 16 // default
      });

    // sender sends the following object attached to encrypted message (ciphertext).
    // password must be notified to receiver via different way.
    const ciphertextObject = {
      // encrypted message
      data: encrypted,
      // key derivation parameters
      pbkdf2params: {
        salt,
        iterationCount,
        aesKeyLen,
        hash
      },
      // encryption parameters
      aesParams: {
        name: 'AES-GCM',
        iv,
        additionalData,
        tagLength: 16
      }
    };


    //////////////////////
    // Receiver
    //////////////////////
    // derive key from password
    const aesKeyReceiver = await pbdkf.pbkdf2(
      password,
      ciphertextObject.pbkdf2params.salt,
      ciphertextObject.pbkdf2params.iterationCount,
      ciphertextObject.pbkdf2params.aesKeyLen,
      <any>ciphertextObject.pbkdf2params.hash
    );

    // encryption
    const decrypted = await aes.decrypt(
      ciphertextObject.data,
      aesKeyReceiver,
      <any>ciphertextObject.aesParams
    );
    expect(decrypted.toString() === msg.toString()).toBeTruthy();
  });
});

