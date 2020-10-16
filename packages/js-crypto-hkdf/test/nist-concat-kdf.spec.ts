import {getTestEnv} from './prepare';
const env = getTestEnv();
const hkdf = env.library;
const envName = env.envName;

describe(`${envName}: NIST Concat KDF Test`, () => {
  it('test', async () => {
    const concat = await hkdf.nistConcatKdf(
      new Uint8Array([158, 86, 217, 29, 129, 113, 53, 211, 114, 131, 66, 131, 191, 132,
        38, 156, 251, 49, 110, 163, 218, 128, 106, 72, 246, 218, 167, 121,
        140, 254, 144, 196]),
      new Uint8Array([0, 0, 0, 7, 65, 49, 50, 56, 71, 67, 77, 0, 0, 0, 5, 65, 108, 105, 99, 101, 0, 0, 0, 3, 66, 111, 98, 0, 0, 0, 128]),
      16,
      'SHA-256'
    );
    const testVec = new Uint8Array([86, 170, 141, 234, 248, 35, 109, 32, 92, 34, 40, 205, 113, 167, 16, 26]);
    expect(testVec.toString()).toEqual(concat.toString());
  });
});
