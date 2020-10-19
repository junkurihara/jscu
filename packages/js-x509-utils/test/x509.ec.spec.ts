import {getTestEnv} from './prepare';
const env = getTestEnv();
const x509 = env.library;
const envName = env.envName;

import ec from 'js-crypto-ec';

import {CurveTypes} from 'js-crypto-ec/dist/typedef';
import {SignatureType} from '../src/typedef';

const curves: Array<CurveTypes> = ['P-256', 'P-384', 'P-521', 'P-256K'];
const sigopt: Array<SignatureType> = ['ecdsa-with-sha256', 'ecdsa-with-sha384', 'ecdsa-with-sha512', 'ecdsa-with-sha1'];
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

describe(`${envName}: Generated JWK EC public key should be successfully converted to X509 PEM certificate and vice versa`, () => {
  let keySet: Array<any> = [];
  let msg;
  beforeAll(async () => {
    keySet = await Promise.all(curves.map(async (crv) => await ec.generateKey(crv)));
    msg = new Uint8Array(32);
    for (let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  }, 20000);

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
          let re;
          try {
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
            console.log(x509.info(crt,'pem'));
            const parsed = x509.parse(crt, 'pem');
            // console.log(parsed.signatureAlgorithm);
            re = await ec.verify(parsed.tbsCertificate, parsed.signatureValue, kp.publicKey, parsed.signatureAlgorithm.parameters.hash, 'der');
          } catch (e) { re = false; }
          expect(re).toBeTruthy();
          result = re && result;
        }));
        return result;
      })
    );
    console.log(array);
    expect(array.every( (x) => x)).toBeTruthy();
  },20000);

  it('Transform X509 Self Signed PEM to JWK, and verify it', async () => {
    const jwkey = await x509.toJwk(crtsample, 'pem');

    const parsed = x509.parse(crtsample, 'pem');
    const re = await ec.verify(parsed.tbsCertificate, parsed.signatureValue, jwkey, parsed.signatureAlgorithm.parameters.hash, 'der');
    console.log(re);
    expect(re).toBeTruthy();
  }, 20000);

});
