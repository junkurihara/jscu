import random from 'js-crypto-random';
import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const hmac = env.library;
const envName = env.envName;


const hashes = ['SHA-256', 'SHA-384', 'SHA-512', 'MD5', 'SHA-1'];
describe(`${envName}: HMAC test in PureJS environment`, () => {
  let msg;
  before( async () => {
    if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') window.crypto.subtle.sign = undefined;
    if (typeof window !== 'undefined' && typeof window.msCrypto !== 'undefined') window.msCrypto.subtle.sign = undefined;
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('HMAC successfully generates and verify a MAC in PureJS environment', async function () {
    this.timeout(20000);
    const array = await Promise.all(hashes.map( async (hash) => {
      const key = await random.getRandomBytes(32);
      const d = await hmac.compute(key, msg, hash);
      expect(d).to.be.a('Uint8Array');
      return hmac.verify(key, msg, d, hash);
    }));
    console.log(array);
    expect(array.every((a) => (a === true))).to.be.true;
  });
});

