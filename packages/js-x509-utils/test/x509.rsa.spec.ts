import {getTestEnv} from './prepare';
const env = getTestEnv();
const x509 = env.library;
const envName = env.envName;

import sample from './sample_crt';

import rsa from 'js-crypto-rsa';
import {Key} from 'js-crypto-key-utils';
import {HashTypes, SignatureType} from '../src/typedef';

const hashes: Array<HashTypes> = ['SHA-256', 'SHA-384', 'SHA-512'];//, 'SHA-1'];
const pkcs1s: Array<SignatureType> = [ 'sha256WithRSAEncryption', 'sha384WithRSAEncryption', 'sha512WithRSAEncryption']; // RSASSA-PKCS1-v1_5
const constantSaltLen = 32;

describe(`${envName}: RSA: Generated JWK public key should be successfully converted to X509 PEM certificate and vice versa`, () => {
  beforeAll(async () => {
  });

  it('Transform JWKs to X509 RSASSA-PKCS1-v1_5 PEM as self signed cert and verify generated one', async () => {
    const name = {
      countryName: 'JP',
      stateOrProvinceName: 'Tokyo',
      localityName: 'Chiyoda',
      organizationName: 'example',
      organizationalUnitName: 'Research',
      commonName: 'example.com'
    };

    const results = await Promise.all(pkcs1s.map( async (signatureAlgorithm) => {
      const publicObj = new Key('pem', sample.rsa.publicKey);
      const privateObj = new Key('pem', sample.rsa.privateKey);
      const crt = await x509.fromJwk(
        <JsonWebKey>await publicObj.export('jwk'),
        <JsonWebKey>await privateObj.export('jwk'),
        'pem',
        {
          signature: signatureAlgorithm,
          days: 365,
          issuer: name,
          subject: name
        }
      );
      console.log(x509.info(crt,'pem'));
      const parsed = await x509.parse(crt, 'pem');
      // console.log(parsed.signatureAlgorithm);
      const re = await rsa.verify(
        parsed.tbsCertificate,
        parsed.signatureValue,
        <JsonWebKey>await publicObj.export('jwk'),
        parsed.signatureAlgorithm.parameters.hash,
        {name: 'RSASSA-PKCS1-v1_5'}
      );
      return re;
    }));
    console.log(results);
    expect(results.every( (elem) => elem === true)).toBeTruthy();
  });

  it('Transform JWKs to X509 RSA-PSS Empty Parameter PEM as self signed cert and verify generated one', async () => {
    const name = {
      countryName: 'JP',
      stateOrProvinceName: 'Tokyo',
      localityName: 'Chiyoda',
      organizationName: 'example',
      organizationalUnitName: 'Research',
      commonName: 'example.com'
    };

    const publicObj = new Key('pem', sample.rsa.publicKey);
    const privateObj = new Key('pem', sample.rsa.privateKey);

    const crt = await x509.fromJwk(
      <JsonWebKey>await publicObj.export('jwk'),
      <JsonWebKey>await privateObj.export('jwk'),
      'pem',
      {
        signature: 'rsassaPss',
        days: 365,
        issuer: name,
        subject: name
      }
    );
    console.log(x509.info(crt,'pem'));
    const parsed = await x509.parse(crt, 'pem');
    const re = await rsa.verify(
      parsed.tbsCertificate,
      parsed.signatureValue,
      <JsonWebKey>await publicObj.export('jwk'),
      parsed.signatureAlgorithm.parameters.hash,
      {name: 'RSA-PSS', saltLength: parsed.signatureAlgorithm.parameters.saltLength}
    );
    console.log(re);
    expect(re).toBeTruthy();
  });

  it('Transform JWKs to X509 RSA-PSS Explicit Parameter PEM as self signed cert and verify generated one', async () => {
    const name = {
      countryName: 'JP',
      stateOrProvinceName: 'Tokyo',
      localityName: 'Chiyoda',
      organizationName: 'example',
      organizationalUnitName: 'Research',
      commonName: 'example.com'
    };

    const publicObj = new Key('pem', sample.rsa.publicKey);
    const privateObj = new Key('pem', sample.rsa.privateKey);

    const results = await Promise.all(hashes.map( async (hash) => {
      const crt = await x509.fromJwk(
        <JsonWebKey>await publicObj.export('jwk'),
        <JsonWebKey>await privateObj.export('jwk'),
        'pem',
        {
          signature: 'rsassaPss',
          days: 365,
          issuer: name,
          subject: name,
          pssParams: {saltLength: constantSaltLen, hash}
        }
      );
      console.log(x509.info(crt,'pem'));
      const parsed = x509.parse(crt, 'pem');
      // console.log(parsed.signatureAlgorithm);
      const re = await rsa.verify(
        parsed.tbsCertificate,
        parsed.signatureValue,
        <JsonWebKey>await publicObj.export('jwk'),
        parsed.signatureAlgorithm.parameters.hash,
        {name: 'RSA-PSS', saltLength: parsed.signatureAlgorithm.parameters.saltLength}
      );
      return re;
    }));
    console.log(results);
    expect(results.every( (elem) => elem === true)).toBeTruthy();
  });

  it('Transform X509 Self Signed RSASSA-PKCS1-v1_5 PEM to JWK, and verify it', async () => {
    const jwkey = await x509.toJwk(sample.rsa.certificatePKCS1v1_5, 'pem');
    const parsed = x509.parse(sample.rsa.certificatePKCS1v1_5, 'pem');
    const re = await rsa.verify(
      parsed.tbsCertificate,
      parsed.signatureValue,
      jwkey,
      parsed.signatureAlgorithm.parameters.hash,
      {name: 'RSASSA-PKCS1-v1_5'}
    );
    // = await rsa.verify(parsed.tbsCertificate, parsed.signatureValue, jwkey, parsed.hash, 'der');
    console.log(re);
    expect(re).toBeTruthy();
  });

  it('Transform X509 Self Signed RSA-PSS Explicit Parameter PEM to JWK, and verify it', async () => {
    const samplePss = '-----BEGIN CERTIFICATE-----\n' +
      'MIIFazCCBCKgAwIBAgIJAKmJV6cI/tYpMD4GCSqGSIb3DQEBCjAxoAswCQYFKw4D\n' +
      'AhoFAKEYMBYGCSqGSIb3DQEBCDAJBgUrDgMCGgUAogMCARSjAwIBATCBszELMAkG\n' +
      'A1UEBhMCREUxDzANBgNVBAgTBkhlc3NlbjESMBAGA1UEBxMJRnJhbmtmdXJ0MR4w\n' +
      'HAYDVQQKExVQU1MgdGVzdCBjZXJ0aWZpY2F0ZXMxOTA3BgNVBAsTMGNyZWF0ZWQg\n' +
      'YnkgTWFydGluIEthaXNlciAoaHR0cDovL3d3dy5rYWlzZXIuY3gvKTEkMCIGA1UE\n' +
      'AxMbUFNTIHRlc3RSb290IENBIENlcnRpZmljYXRlMB4XDTEwMDcxMzE5NTc1NVoX\n' +
      'DTE2MDEwMzE5NTc1NVowgbMxCzAJBgNVBAYTAkRFMQ8wDQYDVQQIEwZIZXNzZW4x\n' +
      'EjAQBgNVBAcTCUZyYW5rZnVydDEeMBwGA1UEChMVUFNTIHRlc3QgY2VydGlmaWNh\n' +
      'dGVzMTkwNwYDVQQLEzBjcmVhdGVkIGJ5IE1hcnRpbiBLYWlzZXIgKGh0dHA6Ly93\n' +
      'd3cua2Fpc2VyLmN4LykxJDAiBgNVBAMTG1BTUyB0ZXN0Um9vdCBDQSBDZXJ0aWZp\n' +
      'Y2F0ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMZnLiVdh/4aR2Gj\n' +
      'FKBiDmuNe8o6NJSgNRMXv+zweb1CQRUQ4HzdiZDRBTxAGM+83/ofeD3ALUyDGniX\n' +
      'fbjxv05QyPGnJDjJYpdQ3ilM4MXoEYz7ZfB4/AVh1zvqELFR3a2TZ78oQGYJBeF3\n' +
      'vAmVuDwCrZ8J7xddABt7ceqDtzhhNcvOWDZxXtzK5yDtb4N/RMJZtbK6ZNsLV/+J\n' +
      'OMHT+22xycE6tE2gMCqUUC2b2MpnW71GqtkKxaA36VXl/c4Z0IhNE2Zx3qy5NVsU\n' +
      'Z+NYw6JrWtEw+kf2j0bKj5w0LMlERKbNib4kofcMJ8qPEIvk1u6T30vKUb7HQdU7\n' +
      '2OuTWQ8CAwEAAaOCARwwggEYMB0GA1UdDgQWBBTfH+IBoj70+Wn4OseW1pkNL7bO\n' +
      'MzCB6AYDVR0jBIHgMIHdgBTfH+IBoj70+Wn4OseW1pkNL7bOM6GBuaSBtjCBszEL\n' +
      'MAkGA1UEBhMCREUxDzANBgNVBAgTBkhlc3NlbjESMBAGA1UEBxMJRnJhbmtmdXJ0\n' +
      'MR4wHAYDVQQKExVQU1MgdGVzdCBjZXJ0aWZpY2F0ZXMxOTA3BgNVBAsTMGNyZWF0\n' +
      'ZWQgYnkgTWFydGluIEthaXNlciAoaHR0cDovL3d3dy5rYWlzZXIuY3gvKTEkMCIG\n' +
      'A1UEAxMbUFNTIHRlc3RSb290IENBIENlcnRpZmljYXRlggkAqYlXpwj+1ikwDAYD\n' +
      'VR0TBAUwAwEB/zA+BgkqhkiG9w0BAQowMaALMAkGBSsOAwIaBQChGDAWBgkqhkiG\n' +
      '9w0BAQgwCQYFKw4DAhoFAKIDAgEUowMCAQEDggEBAJ8GcFT/Jdhz65JK0c9EFdAq\n' +
      '8FKa9VWX7QDQlIuu0UbZaHYaFmY1NbXcxlvTOD1ArByCHpFQ8+wrXgLrxedlm/fI\n' +
      '9WkvFsyvC1kSeV88C90E3mh+w9i2Qsz0Gjj2RjD98cPsqqQO7q/7uvKNcHMN5nKi\n' +
      'VuIPMr5fisx0C/IBQAunBfzBfdGmjoNaahDBYCKiyAaU7A+dYorRbMJF7SxBhTr1\n' +
      'WI/N3LlBKLF5mvtDYg7sXx6ULR/xAKKkVeUTIgGMYq/s46ZMP11QrfRHx4zNAwP9\n' +
      'aARZeUz1X0/LM6LgaQvVIhZqbyB637eZhusOP3226TDn7hGx/UdS0UxSwfjrzS8=\n' +
      '-----END CERTIFICATE-----';
    const jwkey = await x509.toJwk(samplePss, 'pem');
    console.log(jwkey);
    const parsed = x509.parse(samplePss, 'pem');
    const re = await rsa.verify(
      parsed.tbsCertificate,
      parsed.signatureValue,
      jwkey,
      parsed.signatureAlgorithm.parameters.hash,
      {name: 'RSA-PSS', saltLength: parsed.signatureAlgorithm.parameters.saltLength}
    );
    // = await rsa.verify(parsed.tbsCertificate, parsed.signatureValue, jwkey, parsed.hash, 'der');
    console.log(re);
    expect(re).toBeTruthy();
  });

  it('Transform X509 Self Signed RSA-PSS Empty Parameter PEM to JWK, and verify it', async () => {
    const samplePss = '-----BEGIN CERTIFICATE-----\n' +
      'MIIFCTCCA/GgAwIBAgIJALCOVlO1QTu1MA0GCSqGSIb3DQEBCjAAMIGzMQswCQYD\n' +
      'VQQGEwJERTEPMA0GA1UECBMGSGVzc2VuMRIwEAYDVQQHEwlGcmFua2Z1cnQxHjAc\n' +
      'BgNVBAoTFVBTUyB0ZXN0IGNlcnRpZmljYXRlczE5MDcGA1UECxMwY3JlYXRlZCBi\n' +
      'eSBNYXJ0aW4gS2Fpc2VyIChodHRwOi8vd3d3LmthaXNlci5jeC8pMSQwIgYDVQQD\n' +
      'ExtQU1MgdGVzdFJvb3QgQ0EgQ2VydGlmaWNhdGUwHhcNMTAwNzEzMTk1NjAzWhcN\n' +
      'MTYwMTAzMTk1NjAzWjCBszELMAkGA1UEBhMCREUxDzANBgNVBAgTBkhlc3NlbjES\n' +
      'MBAGA1UEBxMJRnJhbmtmdXJ0MR4wHAYDVQQKExVQU1MgdGVzdCBjZXJ0aWZpY2F0\n' +
      'ZXMxOTA3BgNVBAsTMGNyZWF0ZWQgYnkgTWFydGluIEthaXNlciAoaHR0cDovL3d3\n' +
      'dy5rYWlzZXIuY3gvKTEkMCIGA1UEAxMbUFNTIHRlc3RSb290IENBIENlcnRpZmlj\n' +
      'YXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2haEKyn8mtVODAPA\n' +
      'EMV9VlNm+HPBh+Mve5nPoU4PZ198E2JQ1llvXbDWmhuKzn/ZyB2janx/imvylkOq\n' +
      'Jmkdqka+VC+69/pDmhHKp2qHL6S/alPG6E2kQhy4FVIEU2Qme6niMZY4005237Pi\n' +
      'fWc1MBEU2c6jdkUIbw5SrWub5dbMIi71lUPHzaLqGovkLaWg2+BnPOSdg13t3jLt\n' +
      'N6Dm9VMpDE0sOu/t582bc2MfCmO/vIsSpu2/iA+gB4vecDBJGyOISYKKvjnc4N2s\n' +
      'Obok9ZgJKeTM40hGXEGzE+cTEDkkh8ydlGVRIJe3o5wjuLH3P51/EFVu0PhCSyV6\n' +
      'FGIO1wIDAQABo4IBHDCCARgwHQYDVR0OBBYEFM4ICyE/5cAobWjQ7LPGLrAU/gbD\n' +
      'MIHoBgNVHSMEgeAwgd2AFM4ICyE/5cAobWjQ7LPGLrAU/gbDoYG5pIG2MIGzMQsw\n' +
      'CQYDVQQGEwJERTEPMA0GA1UECBMGSGVzc2VuMRIwEAYDVQQHEwlGcmFua2Z1cnQx\n' +
      'HjAcBgNVBAoTFVBTUyB0ZXN0IGNlcnRpZmljYXRlczE5MDcGA1UECxMwY3JlYXRl\n' +
      'ZCBieSBNYXJ0aW4gS2Fpc2VyIChodHRwOi8vd3d3LmthaXNlci5jeC8pMSQwIgYD\n' +
      'VQQDExtQU1MgdGVzdFJvb3QgQ0EgQ2VydGlmaWNhdGWCCQCwjlZTtUE7tTAMBgNV\n' +
      'HRMEBTADAQH/MA0GCSqGSIb3DQEBCjAAA4IBAQCBgFRdPf+k9up9PwwbHORNe8HP\n' +
      'c7+yXPDK/qH74bJMQvaNOpXhvb0KWDcj5GPJ0l+eVatV1UzyDZT6exqaBTeWjgKW\n' +
      '1HMfF9z3Ybs1PTKt8IASFNMe4Nizx6vuAvnP/GXTz7LwOZt7QYBTaAOKUQqB/yBQ\n' +
      'D9Vn+P+nqgQCBfFhVXPurUFpAt6npnKpKIG8wmMBoeeuWpzMFs0Rnf9TFJt9SkAn\n' +
      'M8J806yQWShmibcQWmmveHtN8s/69FUUIu6q1h0A8qxISj87CdC4XKvLRV6DSu4C\n' +
      '+b/CfhHaOR8lINDcVYg4j3VZU24nmPlWcH4yXO8gbnoMOLnf36/Ezw3wnVIV\n' +
      '-----END CERTIFICATE-----';
    const jwkey = await x509.toJwk(samplePss, 'pem');
    const parsed = x509.parse(samplePss, 'pem');
    const re = await rsa.verify(
      parsed.tbsCertificate,
      parsed.signatureValue,
      jwkey,
      parsed.signatureAlgorithm.parameters.hash,
      {name: 'RSA-PSS', saltLength: parsed.signatureAlgorithm.parameters.saltLength}
    );
    console.log(re);
    expect(re).toBeTruthy();
  });

});
