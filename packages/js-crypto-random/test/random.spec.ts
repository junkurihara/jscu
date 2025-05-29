import {getTestEnv} from './prepare';

describe('Random generation test', () => {
  let random: any;
  let envName: string;

  beforeAll(async () => {
    const env = await getTestEnv();
    random = env.library;
    envName = env.envName;
  });

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
