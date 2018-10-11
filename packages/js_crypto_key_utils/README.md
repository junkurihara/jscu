Universal Module for Cryptographic Key Utilities in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-key-utils.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-key-utils)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as a cryptographic key utilities, i.e., it works both on most browsers and on Node.js just by importing from npm/source code. This key utility library provides useful converters for EC/RSA keys in PEM/DER<->JWK, octet form of EC keys <-> JWK, and computation of JWK thumbprints.

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-key-utils // npm
  $ yarn add js-crypto-key-utils // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-key-utils.git
  ```

Then you should import the package as follows.
```shell
import keyutils from 'js-crypto-key-utils'; // for npm
import keyutils from 'js-crypto-key-utils/dist/index.js'; // or jsckeyutil.bundle.js for github
```
  
# Usage
## Convert public and private keys for elliptic curve cryptography
First let an elliptic key pair is given in the form of JWK ([RFC7517](https://tools.ietf.org/html/rfc7517)) as follows:
```javascript
const publicJwk = {kty: 'EC', crv: 'P-256', x: '...', y: '...'};
const privateJwk = {ktyp: 'EC', crv: 'P-256', x: '...', y: '...', d: '...'};
```
### Converting between Json Web Key (JWK) and octet-formatted keys
The given JWKs can be converted to the octet-formatted keys (see 2.3.3 and 2.3.4 of [SECG SEC1](http://www.secg.org/sec1-v2.pdf), link to PDF) in the following procedure.
```javascript
// uncompressed form of keys are obtained
const publicOct = keyutils.fromJwkTo(
  'oct', publicJwk, 'public', {
    format: 'string', // output form is in string
    compact: false // if true, compressed form of keys are obtained
  });  
const privateOct = keyutils.fromJwkTo(
  'oct', privateJwk, 'private', {
    format: 'binary',  // output form is in binary (Uint8Array)
    compact: false // if true, compressed form of keys are obtained
  });
```
Also keys in the octet form can be re-converted to JWK as
```javascript
const namedCurve = 'P-256'; // octet form includes no information about curve. so it must be externally given.
const publicJwkR = await keyutils.toJwkFrom(
  'oct', publicOct, 'public', {
    format: 'string',  // input octet key is in string form
    namedCurve
  });
const privateJwkR = await keyutils.toJwkFrom(
  'oct', privateOct, 'private', {
    format: 'binary', // input octet key is in binary form  
    namedCurve
  });
```

### Converting between Json Web Key (JWK) and SPKI-formatted (public key) or PKCS8-formatted (private key) PEM/DER
The given JWKs can be converted to the PEM/DER formatted keys in the following procedure.
```javascript
const publicAsn = await keyutils.fromJwkTo(
  'pem', // output format is in string PEM
  publicJwk,
  'public',
  {
    compact: false // if true, compressed form of keys are obtained
  });
const privateAsn = await keyutils.fromJwkTo(
  'der', // output format is in binary DER in Uint8Array
  privateJwk,
  'private',
  {
    compact: false // if true, compressed form of keys are obtained
  });
```
Note that public keys are encoded to the form of `SubjectPublicKeyInfo` (SPKI) defined as a part of X.509 public key certificate ([RFC5280](https://tools.ietf.org/html/rfc5280)). The detailed encoding rule for elliptic cryptographic keys is given in [RFC5480](https://tools.ietf.org/html/rfc5480). On the other hand, private keys are encoded to hte form of `PrivateKeyInfo` defined in PKCS#8 ([RFC5958](https://tools.ietf.org/html/rfc5958)). The detailed encoding rule for elliptic keys is given in [RFC5915](https://tools.ietf.org/html/rfc5915) as well as SPKI.

This library also re-convert keys in PEM/DER to JWK as follows.
```javascript
const publicJwkR = await keyutils.toJwkFrom(
  'pem', // input key is in PEM format
  publicASN,
  'public'
  );
const privateJwkR = await keyutils.toJwkFrom(
  'der', // input key is in DER format 
  privateASN,
  'private'
  );
``` 

## Convert public and private keys for RSA cryptography
Much like elliptic keys, this library supports conversion of RSA keys between JWK and PEM/DER of SPKI and PKCS8. The following example explains how to convert RSA keys.
```javascript
// first given an RSA key pair in JWK
const publicJwk = {kty: 'RSA', n: '...', e: '...'};
const privateJwk = {kty: 'RSA', n: '...', e: '...', d: '...', p: '...', q: '...', dp: '...', dq: '...', qi: '...'};

// convert keys to PEM/DER
const publicASN = await keyutils.fromJwkTo('pem', publicJwk, 'public'); // to DER
const privateASN = await keyutils.fromJwkTo('der', privateJwk, 'private'); // to PEM

// re-converted from PEM/DER to JWK
const publicJwkR = await keyutils.toJwkFrom('pem', publicASN, 'public'); // from PEM
const privateJwkR = await keyutils.toJwkFrom('der', privateASN, 'private'); // from der
```
Please refer to [RFC3447](https://tools.ietf.org/html/rfc3447) for the detailed encoding rule of RSA public and private keys. 

## Compute JWK Thumbprint
This library also provides an API to compute the JWK Thumbprint defined in [RFC7638](https://tools.ietf.org/html/rfc7638). The API can be invoked as follows.
```javascript
const publicJwk = {kty: 'EC', crv: 'P-256', x: '...', y: '...'};

keyutils.getJwkThumbprint(
  publicJwk,
  'SHA-256', // SHA-256 is used to compute the hash
  'hex' // output format is in hex string. 'binary' is also available.
  ) 
  .then( (thumbprint) => {
    // now you get the thumbprint of the key
  });
```
Note that the thumbprint generated from a public key is exactly same as that from its paired private key.

# Note
Now this library supports the following curve for elliptic curve cryptography.
- P-256 (secp256r1)
- P-384 (secp384r1)
- P-521 (secp521r1)
- P-256K (secp256k1)

# License
Licensed under the MIT license, see `LICENSE` file.