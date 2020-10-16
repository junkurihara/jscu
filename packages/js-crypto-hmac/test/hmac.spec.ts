import random from 'js-crypto-random';
import jseu from 'js-encoding-utils';

import {getTestEnv} from './prepare';
import {HashTypes} from '../src/params';
const env = getTestEnv();
const hmac = env.library;
const envName = env.envName;

const testKey = jseu.encoder.stringToArrayBuffer('luchse sind halt tolle katzen');
const testMsg = jseu.encoder.stringToArrayBuffer('luchse luchsen luchsig in luxemburg umher');
const testVectors = {
  'SHA-256': '2ce4f6d7e9ac3abc656a8db6ed66df72d6beed9b310f6fc2cffe57db7631c88f',
  'SHA-384': '9fe725ff6a9b0f898028cc5232e35b0370974087fcef3e3c733721bf2d0eb7f99b12437458c6b5a77af74db886c744ab',
  'SHA-512': 'dfaccb94cb57c9c48a22b7a72931e581ba9ef0c3b9fad37abe80a3091ea8d9bf0b37236e6be9e53ef27ad57f10c335d28e3ffdcfb92fd23a7f5e409993b97887',
  'MD5': 'd1031cac3e5fc15a8409f2943bc95e2d',
  'SHA-1': 'f4d0511f0dc7492b3f3819b7c63e7f5c0c788aa7',
  'SHA3-224': '3204e32dbbb7334543fe11cd738dd52125b5a1887038fbc107f921c5',
  'SHA3-256': '3f8c691e77be447d4ecdcf0d61f28b9c8c0067f6fdd822464b9da369f3c2852b',
  'SHA3-384': '152d19cf3538989b1cd1685d94c6f4705fa975c20d2cefca541291c5a401fb5cf977640aa421b92621f53664789355a7',
  'SHA3-512': '6379a3fdebee97d298ba4a1ac63379e81e90b70277ec2770c48f841777789bee5c1f49c33812af4ac5d478413e5c0ffe89dabbea5f46c9f3acdb8952992b9202'
};

const hashes: Array<HashTypes> = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-512', 'SHA3-384', 'SHA3-256', 'SHA3-224'];
describe(`${envName}: HMAC test`, () => {
  beforeAll( () => {});

  it('HMAC successfully generates and verify a MAC', async () =>  {
    const array = await Promise.all(hashes.map( async (hash) => {
      const d: Uint8Array = await hmac.compute(testKey, testMsg, hash);
      //console.log(`${hash}: ${jseu.encoder.arrayBufferToHexString(d)}`);
      expect(jseu.encoder.arrayBufferToHexString(d)).toBe(testVectors[hash]);
      return hmac.verify(testKey, testMsg, d, hash);
    }));
    console.log(array);
    expect(array.every((a) => (a === true))).toBeTruthy();
  }, 20000);

  it('HMAC successfully generates unique MAC for unique key', async () => {
    const msg = random.getRandomBytes(32);
    const array = await Promise.all(hashes.map( async (hash) => {
      const keya = await random.getRandomBytes(32);
      const keyb = await random.getRandomBytes(32);
      const da: Uint8Array = await hmac.compute(keya, msg, hash);
      const db: Uint8Array = await hmac.compute(keyb, msg, hash);
      return da.toString() !== db.toString();
    }));
    console.log(array);
    expect(array.every((a) => (a === true))).toBeTruthy();
  }, 20000);

  it('If msg is overwritten, it can be detected via MAC', async () => {
    const msg = random.getRandomBytes(32);
    const key = await random.getRandomBytes(32);
    const newMsg = new Uint8Array(msg);
    newMsg[1] = 0xFF&0x33;

    const origArray = await Promise.all(hashes.map( async (hash) => jseu.encoder.arrayBufferToHexString(await hmac.compute(key, msg, hash))));
    const altArray = await Promise.all(hashes.map( async (hash) => jseu.encoder.arrayBufferToHexString(await hmac.compute(key, newMsg, hash))));

    const array = origArray.map( (orig, idx) => orig !== altArray[idx]);
    console.log(array);
    console.log(origArray);
    console.log(altArray);

    expect(array.every( (x) => x)).toBeTruthy();

  }, 20000);
});

