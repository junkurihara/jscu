import {getTestEnv} from './prepare';
const env = getTestEnv();
const random = env.library;
const envName = env.envName;

describe(`${envName}: Random generation test`, () => {

  it('Random bytes of desired length should be generated successfully', () => {
    const r: Uint8Array = random.getRandomBytes(32);
    expect(r.length ===32).toBeTruthy();
  });

  it('Random ascii string of desired length should be generated successfully', () => {
    const r: String = random.getRandomAsciiString(32);
    expect(r.length === 32).toBeTruthy();
  });

  it('Random sampling from cadidate string with desired length should be generated successfully', () => {
    const r: String = random.getRandomSampledString(32, 'abcdefghijklmnopqrstuvwxyz0123456789');
    console.log(r);
    expect(r.length === 32).toBeTruthy();
  });

  it('Random string (uppercase, lowercase and alphanumeric chars) of desired length should be generated successfully', () => {
    const r: String = random.getRandomString(32);
    console.log(r);
    expect(r.length === 32).toBeTruthy();
  });
});
