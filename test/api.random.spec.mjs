import jscu from '../src/index.mjs';


import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Random generation test', () => {

  it('Hash should be generated for each hash algorithms', async () => {
    const r = await jscu.crypto.random.getRandomBytes(32);
    expect(r).to.be.a('Uint8Array');
    expect(r).to.be.length(32);
  });
});
