import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const aes = env.library;
const envName = env.envName;

import random from 'js-crypto-random/dist/index.js';
import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe(`${envName}: Encryption and Decryption with AES-CBC Test`, () => {
  const keyLength = [16, 32]; // 24 bytes (192 bits) AES key is not supported in Chrome at this point
  let msg;
  let iv;
  before( async () => {
    msg = new Uint8Array(1024);
    iv = new Uint8Array(16);
    for(let i = 0; i < 1024; i++) msg[i] = 0xFF & i;
    for(let i = 0; i < 16; i++) iv[i] = 0xFF & i;
  });

  it('Encrypt and decrypt with AES-CBC succeeds correctly', async function() {
    this.timeout(5000);
    await Promise.all( keyLength.map( async (keyLen) => {
      const key = await random.getRandomBytes(keyLen);
      const encrypted = await aes.encrypt(msg, key, {name: 'AES-CBC', iv});
      const decrypted = await aes.decrypt(encrypted, key, {name: 'AES-CBC', iv});
      expect(msg.toString() === decrypted.toString()).to.be.true;
    }));
  });


  it('IV must be 16 bytes for AES-CBC', async () => {
    let result = true;
    const key = await random.getRandomBytes(12);
    const ivz = new Uint8Array(12);
    await aes.encrypt(msg, key, {name: 'AES-CBC', ivz}).catch( () => {result = false; });
    expect(result).to.be.false;
  });
});