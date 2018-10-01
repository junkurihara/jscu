import elliptic from '../src/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Elliptic curve cryptography test', () => {

  const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
  const keys = [];
  const msgLen = 128;
  const msg = new Uint8Array(msgLen);
  before( async () => {
    for(let i = 0; i < msgLen; i++) msg[i] = 0xFF & i;
  });

  it('JWK key pair is correctly generated', async function () {
    this.timeout(5000);
    const results = await Promise.all(curves.map( async (crv) => {
      let result = true;
      const key = await elliptic.generateKey(crv).catch( (e) => {result = false;});
      keys.push(key);
      // console.log(key);
      return result;
    }));
    console.log(results);
    console.log(keys);
    expect(results.every( (r) => r)).to.be.true;
  });

  it('Message is successfully signed and verified with generated JWK pairs', async function () {
    this.timeout(5000);
    const results = await Promise.all(keys.map( async (kp) => {
      let result = true;
      const sign = await elliptic.sign(msg, kp.privateKey, 'SHA-256').catch( (e) => {result = false;});
      //console.log(sign);
      const valid = await elliptic.verify(msg, sign, kp.publicKey, 'SHA-256').catch( (e) => {result = false;});
      expect(result).to.be.true;

      return valid;
    }));
    console.log(results);
    expect(results.every( (r) => r)).to.be.true;
  });

  it('Shared secret is correctly computed at each side', async () => {
    const results = await Promise.all(keys.map( async (kp) => {
      let result = true;
      const newKey = await elliptic.generateKey(kp.privateKey.crv).catch( (e) => {result = false;});
      const shared1 = await elliptic.deriveSecret(kp.publicKey, newKey.privateKey).catch( (e) => {result = false;});
      const shared2 = await elliptic.deriveSecret(newKey.publicKey, kp.privateKey).catch( (e) => {result = false;});
      expect(result).to.be.true;

      return (shared1.toString() === shared2.toString());
    }));
    console.log(results);
    expect(results.every( (r) => r)).to.be.true;
  });
});
