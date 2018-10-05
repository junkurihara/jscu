import x509 from '../dist/x509.bundle.js';
import ec from 'js-crypto-ec/dist/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
const sigopt = ['ecdsa-with-sha256', 'ecdsa-with-sha384', 'ecdsa-with-sha512', 'ecdsa-with-sha1'];
const crtsample = '-----BEGIN CERTIFICATE-----\n' +
  'MIIBxjCCAWwCCQCEZlhfc33wtzAKBggqhkjOPQQDAjBrMQswCQYDVQQGEwJKUDEO\n' +
  'MAwGA1UECAwFVG9reW8xEDAOBgNVBAcMB0NoaXlvZGExFjAUBgNVBAoMDVNlbGYg\n' +
  'RW1wbG95ZWQxDDAKBgNVBAsMA1ImRDEUMBIGA1UEAwwLZXhhbXBsZS5jb20wHhcN\n' +
  'MTgwOTE4MTA0OTM0WhcNMjgwOTE1MTA0OTM0WjBrMQswCQYDVQQGEwJKUDEOMAwG\n' +
  'A1UECAwFVG9reW8xEDAOBgNVBAcMB0NoaXlvZGExFjAUBgNVBAoMDVNlbGYgRW1w\n' +
  'bG95ZWQxDDAKBgNVBAsMA1ImRDEUMBIGA1UEAwwLZXhhbXBsZS5jb20wWTATBgcq\n' +
  'hkjOPQIBBggqhkjOPQMBBwNCAAScXEKv9GvV8EHzB+d9E0EgS3JFJxgz/uAQYwpZ\n' +
  'gI5+9KVuoGhkPk7Y3DuFbKQ20snMA5W7p5YhXxwo82pspWvDMAoGCCqGSM49BAMC\n' +
  'A0gAMEUCIQDG0lRQgVAYaXVkkIYQ8YC1A/NzvtlzlP2Kk07Ox6GCVwIgNS5BnBHj\n' +
  'UR3om5rYSWmj7rgz0uJxoaZkkNH4xM2Zfss=\n' +
  '-----END CERTIFICATE-----';

describe('Generated JWK EC public key should be successfully converted to X509 PEM certificate and vice versa', () => {
  let keySet = [];
  let msg;
  before(async () => {

    keySet = await Promise.all(curves.map(async (crv) => {
      return await ec.generateKey(crv);
    }));
    msg = new Uint8Array(32);
    for (let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('Transform JWKs to X509 PEMs as self certs and verify generated ones', async () => {
    const name = {
      countryName: 'JP',
      stateOrProvinceName: 'Tokyo',
      localityName: 'Chiyoda',
      organizationName: 'example',
      organizationalUnitName: 'Research',
      commonName: 'example.com'
    };

    const array = await Promise.all(
      keySet.map( async (kp) => {
        let result = true;
        await Promise.all(sigopt.map(async (so) => {
          const crt = await x509.fromJwk(
            kp.publicKey,
            kp.privateKey,
            'pem',
            {
              signature: so,
              days: 365,
              issuer: name,
              subject: name
            }
          );
          const parsed = await x509.parse(crt, 'pem');
          // console.log(parsed.signatureAlgorithm);
          const re = await ec.verify(parsed.tbsCertificate, parsed.signatureValue, kp.publicKey, parsed.signatureAlgorithm.parameters.hash, 'der');
          expect(re).to.be.true;
          result = re && result;
        }));
        return result;
      })
    );
    console.log(array);
    expect(array.every( (x) => x)).to.be.true;
  });

  it('Transform X509 Self Signed PEM to JWK, and verify it', async () => {
    const jwkey = x509.toJwk(crtsample, 'pem');

    const parsed = x509.parse(crtsample, 'pem');
    const re = await ec.verify(parsed.tbsCertificate, parsed.signatureValue, jwkey, parsed.signatureAlgorithm.parameters.hash, 'der');
    console.log(re);
    expect(re).to.be.true;
  });

});
