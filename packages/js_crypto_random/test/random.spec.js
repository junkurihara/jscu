let env;
let random;
if(process.env.TEST_ENV === 'bundle'){
  env = 'From bundle';
  random = require('../dist/jscrandom.bundle.js');
}
else if (process.env.TEST_ENV === 'window'){
  env = 'From window';
  if(typeof window !== 'undefined' && typeof window.jscrandom !== 'undefined'){
    random = window.jscrandom;
  }
  else{
    random = require('../src/index.js');
  }
}
else {
  env = 'From source';
  random = require('../src/index.js');
}

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe(`${env}: Random generation test`, () => {

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
});
