import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const hash = env.library;
const envName = env.envName;



import params from '../src/params.js';
import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


const hashes = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5'];
describe(`${envName}: Hash generation test`, () => {
  let msg;
  before( async () => {
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('Hash should be generated for each hash algorithms', async () => {
    await Promise.all(hashes.map( async (alg) => {
      const d = await hash.compute(msg, alg).catch( (e) => console.error(e));
      console.log(`${alg}: ${d}`);
      expect(d, `failed at ${alg}`).to.be.a('Uint8Array');
      const len = params.hashes[alg].hashSize;
      expect(d, `failed at ${alg}`).to.be.length(len);
    }));
  });
});

