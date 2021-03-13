import {getTestEnv} from './prepare';
const env = getTestEnv();
const keyutils = env.library;
const envName = env.envName;

import sampleEC from './sampleEc';
import sampleRSA from './sampleRsa';

import {HashTypes} from '../src/typedef';

//const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
const bits = ['2048', '4096'];
const hashes: HashTypes[] = [ 'SHA-256', 'SHA-384', 'SHA-512'];
describe(`${envName}: JWK thumbprint generation test.`, () => {

  let keySet: any[] = [];
  beforeAll(async () => {
    keySet= sampleEC.ecKey; //await Promise.all(curves.map(async (crv) => await ec.generateKey(crv)));
  });

  it('EC: JWK thumbprint in array buffer is generated successfully for each curve and hashes', async () => {
    const tps = await Promise.all( keySet.map(
      async (jwkey) => await Promise.all( hashes.map(
        async (h) => {
          const key = new keyutils.Key('jwk', jwkey.publicKey);
          const tp = await key.getJwkThumbprint(h);
          expect(tp instanceof Uint8Array).toBeTruthy();
          return tp;
        }
      ))
    ));
    console.log(tps);
  });

  it('EC: JWK thumbprint in hex string is generated successfully for each curve and hashes', async () => {
    const tps = await Promise.all( keySet.map(
      async (jwkey) => await Promise.all( hashes.map(
        async (h) => {
          const key = new keyutils.Key('jwk', jwkey.publicKey);
          const tp = await key.getJwkThumbprint(h, 'hex');
          expect(typeof(tp)==='string').toBeTruthy();
          return tp;
        }
      ))
    ));
    console.log(tps);
  });

  it('RSA: JWK thumbprint in array buffer is generated successfully for each bits and hashes', async () => {
    const tps = await Promise.all( bits.map(
      async (bitLen) => await Promise.all( hashes.map(
        async (h) => {
          const key = new keyutils.Key('jwk', sampleRSA[bitLen].publicKey.jwk);
          const tp = await key.getJwkThumbprint(h);
          expect(tp instanceof Uint8Array).toBeTruthy();
          return tp;
        }
      ))
    ));
    console.log(tps);
  });

  it('RSA: JWK thumbprint in hex string is generated successfully for each bits and hashes', async () => {
    const tps = await Promise.all( bits.map(
      async (bitLen) => await Promise.all( hashes.map(
        async (h) => {
          const key = new keyutils.Key('jwk', sampleRSA[bitLen].publicKey.jwk);
          const tp = await key.getJwkThumbprint(h, 'hex');
          expect(typeof(tp)==='string').toBeTruthy();
          return tp;
        }
      ))
    ));
    console.log(tps);
  });

});
