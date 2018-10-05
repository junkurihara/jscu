import keyutils from '../dist/jsckeyutil.bundle.js';
import ec from 'js-crypto-ec/dist/index.js';
import sampleRSA from './rsa_sample.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

const curves = ['P-256', 'P-384', 'P-521'];
const bits = ['2048', '4096'];
const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
describe('JWK thumbprint generation test.', () => {
  
  let keySet = [];
  before(async () => {
    keySet = await Promise.all(curves.map(async (crv) => {
      return await ec.generateKey(crv);
    }));
  });

  it('EC: JWK thumbprint in array buffer is generated successfully for each curve and hashes', async () => {
    const tps = await Promise.all( keySet.map(
      async (jwkey) => await Promise.all( hashes.map(
        async (h) => {
          const tp = await keyutils.getJwkThumbprint(jwkey.publicKey, h);
          expect(tp instanceof Uint8Array).to.be.true;
          return tp;
        }
      ))
    ));
  });

  it('EC: JWK thumbprint in hex string is generated successfully for each curve and hashes', async () => {
    const tps = await Promise.all( keySet.map(
      async (jwkey) => await Promise.all( hashes.map(
        async (h) => {
          const tp = await keyutils.getJwkThumbprint(jwkey.publicKey, h, 'hex');
          expect(typeof(tp)==='string').to.be.true;
          return tp;
        }
      ))
    ));
  });

  it('RSA: JWK thumbprint in array buffer is generated successfully for each bits and hashes', async () => {
    const tps = await Promise.all( bits.map(
      async (bitLen) => await Promise.all( hashes.map(
        async (h) => {
          const tp = await keyutils.getJwkThumbprint(sampleRSA[bitLen].publicKey.jwk, h);
          expect(tp instanceof Uint8Array).to.be.true;
          return tp;
        }
      ))
    ));
  });

  it('RSA: JWK thumbprint in hex string is generated successfully for each bits and hashes', async () => {
    const tps = await Promise.all( bits.map(
      async (bitLen) => await Promise.all( hashes.map(
        async (h) => {
          const tp = await keyutils.getJwkThumbprint(sampleRSA[bitLen].publicKey.jwk, h, 'hex');
          expect(typeof(tp)==='string').to.be.true;
          return tp;
        }
      ))
    ));
  });

});