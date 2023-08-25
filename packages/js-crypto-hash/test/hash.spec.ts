import {getTestEnv} from './prepare';
const env = getTestEnv();
const hash = env.library;
const envName = env.envName;

import {testVectors} from './test-vector';
import jseu from 'js-encoding-utils';
import params from '../src/params';


const hashes = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-512', 'SHA3-384', 'SHA3-256', 'SHA3-224'];
describe(`${envName}: Hash generation test`, () => {

  it('Hash should be generated for each hash algorithms', async () => {
    const str = Object.keys(testVectors)[0];
    const msg = jseu.encoder.stringToArrayBuffer(str);
    await Promise.all(hashes.map( async (alg) => {

      // @ts-ignore
      const d: Uint8Array = await hash.compute(msg, alg).catch( (e) => console.error(e));
      const hex = jseu.encoder.arrayBufferToHexString(<Uint8Array>d);
      console.log(`${alg}: ${hex}`);
      const len = params.hashes[alg].hashSize;
      expect(d.length === len).toBeTruthy();
      expect(hex).toBe(testVectors[str][alg]);
    }));
  });
});
