import * as chai from 'chai';
// const should = chai.should();
const expect = chai.expect;
import {getTestEnv} from './prepare';
const env = getTestEnv();
const random = env.library;
const envName = env.envName;

describe(`${envName}: Random generation test`, () => {

  it('Random bytes of desired length should be generated successfully', () => {
    const r = random.getRandomBytes(32);
    expect(r).to.be.a('Uint8Array');
    expect(r).to.be.length(32);
  });

  it('Random ascii string of desired length should be generated successfully', () => {
    const r = random.getRandomAsciiString(32);
    expect(r).to.be.a('String');
    expect(r).to.be.length(32);
  });

  it('Random sampling from cadidate string with desired length should be generated successfully', () => {
    const r = random.getRandomSampledString(32, 'abcdefghijklmnopqrstuvwxyz0123456789');
    console.log(r);
    expect(r).to.be.a('String');
    expect(r).to.be.length(32);
  });

  it('Random string (uppercase, lowercase and alphanumeric chars) of desired length should be generated successfully', () => {
    const r = random.getRandomString(32);
    console.log(r);
    expect(r).to.be.a('String');
    expect(r).to.be.length(32);
  });
});
