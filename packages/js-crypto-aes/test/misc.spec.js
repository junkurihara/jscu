import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const aes = env.library;
const envName = env.envName;

import random from 'js-crypto-random';
import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe(`${envName}: Miscellaneous Test`, () => {
  const keyLength = [16, 32]; // 24 bytes (192 bits) AES key is not supported in Chrome at this point
  let msg;
  let iv;
  before( async () => {
    msg = new Uint8Array(1024);
    iv = new Uint8Array(12);
    for(let i = 0; i < 1024; i++) msg[i] = 0xFF & i;
    for(let i = 0; i < 12; i++) iv[i] = 0xFF & i;
  });

  it('Unsupported Cipher in encryption', async () => {
    await Promise.all( keyLength.map( async (keyLen) => {
      const key = await random.getRandomBytes(keyLen);
      let fail = false;
      await aes.encrypt(msg, key, {name: 'AES-UNSUPPORT', iv, tagLength: 16})
        .catch( () => { fail = true; });
      expect(fail).to.be.true;
    }));
  });

  it('Unsupported Cipher in decryption', async () => {
    await Promise.all( keyLength.map( async (keyLen) => {
      const key = await random.getRandomBytes(keyLen);
      let fail = false;
      const encrypted = await aes.encrypt(msg, key, {name: 'AES-GCM', iv, tagLength: 16});
      await aes.decrypt(encrypted, key, {name: 'AES-UNSUPPORT', iv, tagLength: 16})
        .catch( () => { fail = true; });
      expect(fail).to.be.true;
    }));
  });

});