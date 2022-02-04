import env from '../src';

describe('Common env test', () => {

  it('Common env test', () => {
    console.log(typeof env.getNodeCrypto());
    console.log(typeof env.getWebCrypto());
    console.log(typeof env.getRootWebCrypto());
    console.log(typeof env.getCrypto());
    expect(typeof env.getNodeCrypto() === 'undefined' || typeof env.getNodeCrypto() === 'object').toBeTruthy();
    expect(typeof env.getWebCrypto() === 'undefined' || typeof env.getWebCrypto() === 'object').toBeTruthy();
    expect(typeof env.getRootWebCrypto() === 'undefined' || typeof env.getRootWebCrypto() === 'object').toBeTruthy();
    expect(typeof env.getCrypto() === 'object').toBeTruthy();
  });

});
