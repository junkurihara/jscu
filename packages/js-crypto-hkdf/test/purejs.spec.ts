import {getTestEnv} from './prepare';
const env = getTestEnv();
const hkdf = env.library;
const envName = env.envName;

import {HashTypes} from '../src/params';

interface Window { crypto: { subtle: {deriveBits: any}};}
declare const window: Window;


const hashes: Array<HashTypes> = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-224', 'SHA3-256', 'SHA3-384', 'SHA3-512'];
describe(`${envName}: HKDF test in PureJS environment`, () => {
  let masterSecret: Uint8Array;
  const length = 144;
  beforeAll( async () => {
    if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') window.crypto.subtle.deriveBits = undefined;
    masterSecret = new Uint8Array(32);
    for(let i = 0; i < 32; i++) masterSecret[i] = 0xFF & i;
  });

  it('HKDF is done with automatic salt generation in PureJS Environment', async () => {
    await Promise.all(hashes.map( async (hash) => {
      const d = await hkdf.compute(masterSecret, hash, length, '', null);
      expect(d.key).toBeInstanceOf(Uint8Array);
      expect(d.salt).toBeInstanceOf(Uint8Array);
      expect(d.key.byteLength).toEqual(length);
    }));

  },20000);
});

