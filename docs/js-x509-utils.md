Universal Module of X.509 Certificate Utilities in JavaScript 
--
[![npm version](https://badge.fury.io/js/js-x509-utils.svg)](https://badge.fury.io/js/js-x509-utils)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-x509-utils)](https://david-dm.org/junkurihara/jscu?path=packages/js-x509-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as a utility to handle X.509 in JavaScript, i.e., it works both on most browsers and on Node.js just by importing from npm/source code. This library provides APIs to convert between Json Web Key (JWK) and X.509 DER/PEM.

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-x509-utils // npm
  $ yarn add js-x509-utils // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-x509-utils
  & yarn build
  ```

Then you should import the package as follows.

```shell
import rsa from 'js-x509-utils'; // for npm
import rsa from 'path/to/js-x509-utils/dist/index.js'; // for github
```

The bundled file is also given as `js-x509-utils/dist/x509.bundle.js` for a use case where the module is imported as a `window.x509` object via `script` tags.
  
# Usage
This library always uses JWK-formatted keys ([RFC7517](https://tools.ietf.org/html/rfc7517)) to do any operations. If you utilize keys of other format, like PEM, please use [`js-crypto-key-utils`](https://github.com/junkurihara/js-crypto-key-utils) to convert them to JWK.


## Create X.509 from JWK-formatted public key
### ECDSA
```javascript
const publicJwk = {kty: 'EC', crv: 'P-256', x: '...', y: '...'}; // public key to be signed
const privateJwk = {ktyp: 'EC', crv: 'P-256', x: '...', y: '...', d: '...'}; // private key

const name = { // this is optional
      countryName: 'JP',
      stateOrProvinceName: 'Tokyo',
      localityName: 'Chiyoda',
      organizationName: 'example',
      organizationalUnitName: 'Research',
      commonName: 'example.com'
    };

// sign
x509.fromJwk(
  publicJwk,
  privateJwk,
  'pem',
  {
    signature: 'ecdsa-with-sha256', // signature algorithm
    days: 365, // expired in days
    issuer: name, // issuer
    subject: name // assume that issuer = subject, i.e., self-signed certificate
  },
  'pem' // output signature is in PEM. DER-encoded signature is available with 'der'.
).then( (cert) => {
  // now you get the certificate in PEM string
});
```

### RSA-PSS
```javascript
const publicJwk = {kty: 'RSA', n: '...', e: '...'}; // public key to be signed
const privateJwk = {ktyp: 'RSA', n: '...', e: '...', d: '...', p: '...', q: '...', ...}; // private key

const name = {
  countryName: 'JP',
  stateOrProvinceName: 'Tokyo',
  localityName: 'Chiyoda',
  organizationName: 'example',
  organizationalUnitName: 'Research',
  commonName: 'example.com'
};

x509.fromJwk(
  publicJwk,
  privateJwk,
  'pem',
  {
    signature: 'rsassaPss',
    days: 365,
    issuer: name,
    subject: name,
    pssParams: {
      saltLength: 32, // if unspecified, 20 will be applied as default value
      hash: 'SHA-256' // if unspecified, 'SHA-1' will be applied as default value (but I do not not recommend SHA-1)
    }
  }
).then( (crt) => {
  // now you get a certificate
});
```

### RSASSA-PKCS1-v1_5
```javascript
const publicJwk = {kty: 'RSA', n: '...', e: '...'}; // public key to be signed
const privateJwk = {ktyp: 'RSA', n: '...', e: '...', d: '...', p: '...', q: '...', ...}; // private key

const name = {
  countryName: 'JP',
  stateOrProvinceName: 'Tokyo',
  localityName: 'Chiyoda',
  organizationName: 'example',
  organizationalUnitName: 'Research',
  commonName: 'example.com'
};

x509.fromJwk(
  publicJwk,
  privateJwk,
  'pem',
  {
    signature: 'sha256WithRSAEncryption',
    days: 365,
    issuer: name,
    subject: name
  }
).then( (crt) => {
  // now you get a certificate
});
```


## Extract JWK from X.509 certificate
```javascript
const crtsample = '-----BEGIN CERTIFICATE-----...'; 
const jwkey = x509.toJwk(crtsample, 'pem');
// now you get JWK public key from PEM-formatted certificate     
```

## Extract signature and message body from X.509 certificate
```javascript
const crtsample = '-----BEGIN CERTIFICATE-----...';
const parsed = x509.parse(crtsample, 'pem');
// now you get parsed object from PEM-formatted certificate
// {tbsCertificate, signatureValue, signatureAlgorithm}
```

# Note
## Limitations
Due to the lack of native implementations of some primitive algorithms, the following signing algorithms do not work in legacy IE11.
- ECDSA: `ecdsa-with-sha1` and `ecdsa-with-sha512`
- RSASSA-PKCS-v1_5: `Sha1WithRsaEncryption` and `Sha512WithRsaEncryption`
- RSA-PSS: All

Also the followings are not supported in Edge.
- ECDSA: `ecdsa-with-sha1`
- RSASSA-PKCS-v1_5: `Sha1WithRsaEncryption`
- RSA-PSS: All

**Note that referring to RFC, `Sha1WithRsaEncryption` is the default algorithm when empty params for RSA-SSA-PKCS-v1_5, and hence MS environment does not support such existing certificates. Hence we strongly recommend to use other modern browsers.** 


## ECDSA
At this point, this library supports only certificate signed with ECDSA using the following curve for elliptic curve cryptography.
- P-256 (secp256r1)
- P-384 (secp384r1)
- P-521 (secp521r1)
- P-256K (secp256k1)

# License
Licensed under the MIT license, see `LICENSE` file.