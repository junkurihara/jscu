import {getTestEnv} from './prepare';
const env = getTestEnv();
const aes = env.library;
const envName = env.envName;

import random from 'js-crypto-random';

describe(`${envName}: Encryption and Decryption with AES-CBC Test`, () => {
  const keyLength = [16, 32]; // 24 bytes (192 bits) AES key is not supported in Chrome at this point
  let msg: Uint8Array;
  let iv: Uint8Array;
  beforeAll( async () => {
    msg = new Uint8Array(1024);
    iv = new Uint8Array(16);
    for(let i = 0; i < 1024; i++) msg[i] = 0xFF & i;
    for(let i = 0; i < 16; i++) iv[i] = 0xFF & i;
  });

  it('Encrypt and decrypt with AES-CBC succeeds correctly', async () => {
    await Promise.all( keyLength.map( async (keyLen) => {
      const key = await random.getRandomBytes(keyLen);
      const encrypted = await aes.encrypt(msg, key, {name: 'AES-CBC', iv});
      const decrypted = await aes.decrypt(encrypted, key, {name: 'AES-CBC', iv});
      expect(msg.toString() === decrypted.toString()).toBeTruthy();
    }));
  }, 50000);


  it('IV must be 16 bytes for AES-CBC', async () => {
    let result = true;
    const key = await random.getRandomBytes(12);
    const ivz = new Uint8Array(12);
    await aes.encrypt(msg, key, {name: 'AES-CBC', iv: ivz}).catch( () => {result = false; });
    expect(result).toBeFalsy();
  });
});
