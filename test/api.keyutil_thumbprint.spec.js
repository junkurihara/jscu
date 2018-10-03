import jscu from '../src/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

const curves = ['P-256', 'P-384', 'P-521'];
const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
describe('JWK thumbprint generation test.', () => {

  let keySet = [];
  before(async () => {
    keySet = await Promise.all(curves.map(async (crv) => {
      return await jscu.pkc.generateKey('EC', {namedCurve: crv});
    }));
  });

  it('JWK thumbprint in array buffer is generated successfully for each curve and hashes', async () => {
    const tps = await Promise.all( keySet.map(
      async (jwkey) => await Promise.all( hashes.map(
        async (h) => {
          const tp = await jscu.keyUtil.jwk.getThumbrint(jwkey.publicKey, h);
          expect(tp instanceof Uint8Array).to.be.true;
          return tp;
        }
      ))
    ));
  });

  it('JWK thumbprint in hex string is generated successfully for each curve and hashes', async () => {
    const tps = await Promise.all( keySet.map(
      async (jwkey) => await Promise.all( hashes.map(
        async (h) => {
          const tp = await jscu.keyUtil.jwk.getThumbrint(jwkey.publicKey, h, 'hex');
          expect(typeof(tp)==='string').to.be.true;
          return tp;
        }
      ))
    ));
  });

});