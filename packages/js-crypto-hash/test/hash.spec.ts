import {getTestEnv} from './prepare';
const env = getTestEnv();
const hash = env.library;
const envName = env.envName;

import {testVectors} from './test-vector';
import jseu from 'js-encoding-utils';
import params from '../src/params';
import * as chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


const hashes = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-512', 'SHA3-384', 'SHA3-256', 'SHA3-224'];
describe(`${envName}: Hash generation test`, () => {

  it('Hash should be generated for each hash algorithms', async () => {
    const str = Object.keys(testVectors)[0];
    const msg = jseu.encoder.stringToArrayBuffer(str);
    await Promise.all(hashes.map( async (alg) => {

      // @ts-ignore
      const d = await hash.compute(msg, alg).catch( (e) => console.error(e));
      const hex = jseu.encoder.arrayBufferToHexString(<Uint8Array>d);
      console.log(`${alg}: ${hex}`);
      expect(d, `failed at ${alg}`).to.be.a('Uint8Array');
      const len = params.hashes[alg].hashSize;
      expect(d, `failed at ${alg}`).to.be.length(len);
      expect(hex).to.equal(testVectors[str][alg]);
    }));
  });
});

