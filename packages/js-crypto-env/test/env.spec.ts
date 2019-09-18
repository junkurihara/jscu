import env from '../src';

// @ts-ignore
import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Common env test', () => {

  it('Common env test', () => {
    console.log(typeof env.getNodeCrypto());
    console.log(typeof env.getWebCrypto());
    console.log(typeof env.getMsCrypto());
    console.log(typeof env.getWebCryptoAll());
    expect(typeof env.getNodeCrypto() === 'undefined' || typeof env.getNodeCrypto() === 'object').to.be.true;
    expect(typeof env.getWebCrypto() === 'undefined' || typeof env.getWebCrypto() === 'object').to.be.true;
    expect(typeof env.getMsCrypto() === 'undefined' || typeof env.getMsCrypto() === 'object').to.be.true;
    expect(typeof env.getWebCryptoAll() === 'undefined' || typeof env.getWebCryptoAll() === 'object').to.be.true;
  });

});

