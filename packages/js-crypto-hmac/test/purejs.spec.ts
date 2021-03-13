import random from 'js-crypto-random';

import {getTestEnv} from './prepare';
import {HashTypes} from '../src/params';
const env = getTestEnv();
const hmac = env.library;
const envName = env.envName;


interface Window { crypto: { subtle: {sign: any}};}
declare const window: Window;

const hashes: Array<HashTypes> = ['SHA-256', 'SHA-384', 'SHA-512', 'MD5', 'SHA-1', 'SHA3-224', 'SHA3-256', 'SHA3-384', 'SHA3-512'];
describe(`${envName}: HMAC test in PureJS environment`, () => {
  const msg = random.getRandomBytes(32);
  beforeAll( async () => {
    if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') window.crypto.subtle.sign = undefined;
  });

  it('HMAC successfully generates and verify a MAC in PureJS environment', async () => {
    const array = await Promise.all(hashes.map( async (hash) => {
      const key = await random.getRandomBytes(32);
      const d: Uint8Array = await hmac.compute(key, msg, hash);
      return hmac.verify(key, msg, d, hash);
    }));
    console.log(array);
    expect(array.every((a) => (a === true))).toBeTruthy();
  });
});

