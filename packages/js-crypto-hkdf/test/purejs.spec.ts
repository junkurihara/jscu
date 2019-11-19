import {getTestEnv} from './prepare';
const env = getTestEnv();
const hkdf = env.library;
const envName = env.envName;


import * as chai from 'chai';
import {HashTypes} from '../src/params';
// const should = chai.should();
const expect = chai.expect;


interface Window { crypto: { subtle: {deriveBits: any}}; msCrypto: { subtle: {deriveBits: any}}; }
declare const window: Window;


let hashes: Array<HashTypes> = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-224', 'SHA3-256', 'SHA3-384', 'SHA3-512'];
describe(`${envName}: HKDF test in PureJS environment`, () => {
  let masterSecret: Uint8Array;
  const length = 144;
  before( async () => {
    if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') window.crypto.subtle.deriveBits = undefined;
    masterSecret = new Uint8Array(32);
    for(let i = 0; i < 32; i++) masterSecret[i] = 0xFF & i;
  });

  it('HKDF is done with automatic salt generation in PureJS Environment', async function () {
    this.timeout(20000);
    if(typeof window !== 'undefined' && typeof (<any>window).msCrypto !== 'undefined') hashes = ['SHA-256', 'SHA-384']; // SHA-512 doesn't work in IE
    await Promise.all(hashes.map( async (hash) => {
      const d = await hkdf.compute(masterSecret, hash, length, '', null);
      expect(d.key).to.be.a('Uint8Array');
      expect(d.salt).to.be.a('Uint8Array');
      expect(d.key.byteLength, `failed at ${hash}`).to.be.equal(length);
    }));

  });
});

