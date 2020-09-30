import env from '../src';

import * as chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Common env test', () => {

  it('Common env test', () => {
    console.log(typeof env.getNodeCrypto());
    console.log(typeof env.getWebCrypto());
    console.log(typeof env.getRootWebCrypto());
    console.log(typeof env.getCrypto());
    expect(typeof env.getNodeCrypto() === 'undefined' || typeof env.getNodeCrypto() === 'object').to.be.true;
    expect(typeof env.getWebCrypto() === 'undefined' || typeof env.getWebCrypto() === 'object').to.be.true;
    expect(typeof env.getRootWebCrypto() === 'undefined' || typeof env.getRootWebCrypto() === 'object').to.be.true;
    expect(typeof env.getCrypto() === 'object').to.be.true;
  });

});

