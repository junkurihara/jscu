import random from 'js-crypto-random';
import * as chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

import {getTestEnv} from './prepare';
import {HashTypes} from '../src/params';
const env = getTestEnv();
const hmac = env.library;
const envName = env.envName;


interface Window { crypto: { subtle: {sign: any}}; msCrypto: { subtle: {sign: any}}; }
declare const window: Window;

const hashes: Array<HashTypes> = ['SHA-256', 'SHA-384', 'SHA-512', 'MD5', 'SHA-1', 'SHA3-224', 'SHA3-256', 'SHA3-384', 'SHA3-512'];
describe(`${envName}: HMAC test in PureJS environment`, () => {
  const msg = random.getRandomBytes(32);
  before( async () => {
    if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') window.crypto.subtle.sign = undefined;
    if (typeof window !== 'undefined' && typeof window.msCrypto !== 'undefined') window.msCrypto.subtle.sign = undefined;
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

