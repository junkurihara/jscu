import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const aes = env.library;
const envName = env.envName;

import random from 'js-crypto-random/dist/index.js';
import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe(`${envName}: Encryption and Decryption with AES-GCM Test`, () => {
  const keyLength = [16, 32]; // 24 bytes (192 bits) AES key is not supported in Chrome at this point
  let msg;
  let iv;
  before( async () => {
    msg = new Uint8Array(1024);
    iv = new Uint8Array(12);
    for(let i = 0; i < 1024; i++) msg[i] = 0xFF & i;
    for(let i = 0; i < 12; i++) iv[i] = 0xFF & i;
  });

  it('Encrypt and decrypt with AES-GCM succeeds correctly', async () => {
    await Promise.all( keyLength.map( async (keyLen) => {
      const key = await random.getRandomBytes(keyLen);
      const encrypted = await aes.encrypt(msg, key, {name: 'AES-GCM', iv, tagLength: 16});
      const decrypted = await aes.decrypt(encrypted, key, {name: 'AES-GCM', iv, tagLength: 16});
      expect(msg.toString() === decrypted.toString()).to.be.true;
    }));
  });

  it('Encrypt and decrypt with AES-GCM succeeds correctly with AAD', async () => {
    await Promise.all( keyLength.map( async (keyLen) => {
      const key = await random.getRandomBytes(keyLen);
      const additionalData = await random.getRandomBytes(32);
      const encrypted = await aes.encrypt(msg, key, {name: 'AES-GCM', iv, additionalData, tagLength: 16});
      const decrypted = await aes.decrypt(encrypted, key, {name: 'AES-GCM', iv, additionalData, tagLength: 16});
      expect(msg.toString() === decrypted.toString()).to.be.true;
    }));
  });

  it('Ciphertext alternation can be detected in AES-GCM', async function () {
    this.timeout(2000);
    const key = await random.getRandomBytes(32);
    const encrypted = await aes.encrypt(msg, key, {name: 'AES-GCM', iv});
    encrypted[0] = 0xFF;

    let result = true;
    await aes.decrypt(encrypted, key, {name: 'AES-GCM', iv}).catch( () => { result = false; });
    expect(result).to.be.false;
  });

  it('IV must be 12 bytes for AES-GCM', async () => {
    let result = true;
    const key = await random.getRandomBytes(16);
    const ivz = new Uint8Array(16);
    await aes.encrypt(msg, key, {name: 'AES-GCM', ivz}).catch( () => {result = false; });
    expect(result).to.be.false;
  });
});