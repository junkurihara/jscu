const random = (process.env.TEST_ENV === 'bundle')
  ? require('../dist/jscrandom.bundle.js')
  : require('../src/index.js');

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Random generation test', () => {

  it('Random bytes of desired length should be generated successfully', async () => {
    const r = await random.getRandomBytes(32);
    expect(r).to.be.a('Uint8Array');
    expect(r).to.be.length(32);
  });

  it('Random ascii string of desired length should be generated successfully', async () => {
    const r = await random.getRandomAsciiString(32);
    expect(r).to.be.a('String');
    expect(r).to.be.length(32);
  });
});
