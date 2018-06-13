import jscu from '../src/index.mjs';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


const hashes = ['SHA-256', 'SHA-384', 'SHA-512'];
describe('Hash generation test', () => {
  let msg;
  before( async () => {
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('Hash should be generated for each hash algorithms', async () => {
    await Promise.all(hashes.map( async (hash) => {
      const d = await jscu.crypto.hash.getHash(hash, msg);
      expect(d).to.be.a('Uint8Array');
      const len = parseInt(hash.slice(4,7), 10)/8;
      expect(d, `failed at ${hash}`).to.be.length(len);
    }));
  });
});

