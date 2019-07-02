import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const hash = env.library;
const envName = env.envName;

import jseu from 'js-encoding-utils';
import params from '../src/params.js';
import chai from 'chai';
import {testVectors} from './test-vector';
// const should = chai.should();
const expect = chai.expect;

const str = 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq';

const hashes = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-512', 'SHA3-384', 'SHA3-256', 'SHA3-224'];
describe(`${envName}: Hash generation test in PureJS for webcrypto`, () => {
  before( async () => {
    if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') window.crypto.subtle.digest = undefined;
    if (typeof window !== 'undefined' && typeof window.msCrypto !== 'undefined') window.msCrypto.subtle.digest = undefined;
  });

  it('Hash should be generated for each hash algorithms in Pure JS for webcrypto', async () => {
    const str = Object.keys(testVectors)[0];
    const msg = jseu.encoder.stringToArrayBuffer(str);
    await Promise.all(hashes.map( async (alg) => {
      const d = await hash.compute(msg, alg).catch( (e) => console.error(e));
      const hex = jseu.encoder.arrayBufferToHexString(d);
      console.log(`${alg}: ${hex}`);
      expect(d, `failed at ${alg}`).to.be.a('Uint8Array');
      const len = params.hashes[alg].hashSize;
      expect(d, `failed at ${alg}`).to.be.length(len);
      expect(hex).to.equal(testVectors[str][alg]);
    }));
  });
});

