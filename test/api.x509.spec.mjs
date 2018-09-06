import jscu from '../src/index.mjs';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

const curves = ['P-256', 'P-384', 'P-521'];
describe('Generated JWK public key should be successfully converted to X509 PEM certificate and vice versa', () => {
  const getKeyParam = (elem) => ({keyType: 'EC', namedCurve: elem});
  let keySet = [];
  let msg;
  before( async () => {

    keySet = await Promise.all(curves.map( async (crv) => {
      const param = getKeyParam(crv);
      return await jscu.crypto.generateKeyPair(param);
    }));
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });


  it('JWK to X509 PEM', async () => {
    const result = await Promise.all(
      keySet.map( async (kp) => {
        const x509 = await jscu.crypto.x509.convertJwkToX509({
          publicJwk: kp.publicKey.key,
          privateJwk: kp.privateKey.key
        });
        console.log(x509);
      })
    );
    console.log('\n');
  });

  it('X509 PEM to JWK', async () => {
    const crtsample = '-----BEGIN CERTIFICATE-----\n' +
      'MIIBDDCBtAIJAKNiq3RlpxdxMAoGCCqGSM49BAMCMA8xDTALBgNVBAoMBFNlbGYw\n' +
      'HhcNMTgwOTA2MTQxMzUwWhcNMjgwOTAzMTQxMzUwWjAPMQ0wCwYDVQQKDARTZWxm\n' +
      'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEnFxCr/Rr1fBB8wfnfRNBIEtyRScY\n' +
      'M/7gEGMKWYCOfvSlbqBoZD5O2Nw7hWykNtLJzAOVu6eWIV8cKPNqbKVrwzAKBggq\n' +
      'hkjOPQQDAgNHADBEAiAd8xI2XQN7vCJ96ODI2EVIB1Cy0wB/43W0OzqoO9xY8AIg\n' +
      'UN9ToXSv3wm+Nab/6TR4CJtZSvAm7MrfR19Tx+jeHNg=\n' +
      '-----END CERTIFICATE-----';
    const jwkey = await jscu.crypto.x509.convertX509ToJwk({certX509Pem: crtsample});
    console.log(jwkey);
  });

});
