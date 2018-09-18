import jscu from '../src/index.mjs';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

const curves = ['P-256', 'P-384', 'P-521'];
const sigopt = ['ecdsa-with-sha256', 'ecdsa-with-sha384', 'ecdsa-with-sha512'];
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


  it('Transform JWKs to X509 PEMs as self certs and verify generated ones', async () => {
    const name = {
      countryName: 'JP',
      stateOrProvinceName: 'Tokyo',
      localityName: 'Chiyoda',
      organizationName: 'example',
      organizationalUnitName: 'Research',
      commonName: 'example.com'
    };

    let result = true;
    await Promise.all(
      keySet.map( async (kp) => sigopt.map( async (so) => {
        const x509 = await jscu.crypto.x509.convertJwkToX509({
          publicJwk: kp.publicKey.key,
          privateJwk: kp.privateKey.key,
          options: {
            signature: so,
            days: 365,
            format: 'pem',
            issuer: name,
            subject: name
          }
        });
        console.log(x509);
        const parsed = await jscu.crypto.x509.parseX509forVerification({certX509: x509, publicJWK: kp.publicKey.key});
        const re = await jscu.crypto.verify(parsed.tbsCertificate, parsed.signature, kp.publicKey.key, parsed.hash);
        console.log('verification result: ' + re);
        expect(re).to.be.true;
        result = re && result;
      }))
    );
    expect(result).to.be.true;
    console.log('\n');
  });

  it('Transform X509 Self Signed PEM to JWK, and verify it', async () => {
    const jwkey = await jscu.crypto.x509.convertX509ToJwk({certX509: crtsample});

    const parsed = await jscu.crypto.x509.parseX509forVerification({certX509: crtsample, publicJWK: jwkey});
    const re = await jscu.crypto.verify(parsed.tbsCertificate, parsed.signature, jwkey, parsed.hash);
    console.log(jwkey);
    console.log(re);
    expect(re).to.be.true;
  });

});
