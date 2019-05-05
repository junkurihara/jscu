Universal Module for Elliptic Curve Cryptography (ECDSA and ECDH) in JavaScript
--
[![npm version](https://badge.fury.io/js/js-crypto-ec.svg)](https://badge.fury.io/js/js-crypto-ec)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-ec)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-ec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview


This library is designed to 'universally' provide an elliptic curve cryptography functions, i.e., it works both on most modern browsers and on Node.js just by importing from NPM/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. This library provides APIs to employ ECDSA, ECDH and their key generation, i.e., `sign`, `verify`, `generateKey` and `deriveSecret`.

# Installation

At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-ec // npm
  $ yarn add js-crypto-ec // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-ec
  & yarn build
  ```

Then you should import the package as follows.

```shell
import ec from 'js-crypto-ec'; // for npm
import ec from 'path/to/js-crypto-ec/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-ec/dist/jscec.bundle.js` for a use case where the module is imported as a `window.jscec` object via `script` tags.

  
# Usage
This library always uses JWK-formatted keys ([RFC7517](https://tools.ietf.org/html/rfc7517)) to do any operations. If you utilize keys of other format, like PEM, please use [`js-crypto-key-utils`](https://github.com/junkurihara/js-crypto-key-utils) to convert them to JWK.

## Key generation

```javascript
elliptic.generateKey('P-256').then( (key) => {
  // now you get the JWK public and private keys
  const publicKey = key.publicKey;
  const privateKey = key.privateKey;
})
```

## Sign and verify

```javascript
const publicJwk = {kty: 'EC', crv: 'P-256', x: '...', y: '...'}; // public key
const privateJwk = {ktyp: 'EC', crv: 'P-256', x: '...', y: '...', d: '...'}; // paired private key
const msg = ...; // Uint8Array

// sign
ec.sign(
  msg,
  privateJwk,
  'SHA-256',
  'raw' // output signature is not formatted. DER-encoded signature is available with 'der'.
  ).then( (signature) => {
  // now you get the signature in Uint8Array
  return ec.verify(
    msg,
    sign,
    publicJwk,
    'SHA-256',
    'raw' // input signature is not formatted. DER-encoded signature is available with 'der'. 
    );  
}).then( (valid) => {
  // now you get the result of verification in boolean
});
```

## Derive shared secret

```javascript
const publicJwkA = {kty: 'EC', crv: 'P-256', x: '...', y: '...'}; // public key of player A
const privateJwkA = {ktyp: 'EC', crv: 'P-256', x: '...', y: '...', d: '...'}; // paired private key of player A

const publicJwkB = {kty: 'EC', crv: 'P-256', x: '...', y: '...'}; // public key of player B
const privateJwkB = {ktyp: 'EC', crv: 'P-256', x: '...', y: '...', d: '...'}; // paired private key of player B

// At A's side
const sharedAtPlayerA = ec.deriveSecret(publicJwkB, privateJwkA).then( (secretAtA) => {
  // now you get the shared secret from my (player A's) private key and player B's public key
})

// At B's side
const sharedAtPlayerB = ec.deriveSecret(publicJwkA, privateJwkB).then( (secretAtB) => {
  // now you get the shared secret from my (player B's) private key and player A's public key
})
```

**NOTE:** We SHOULD NOT use the derived secret as an encryption key directly. We should employ an appropriate key derivation procedure like HKDF to use the secret for symmetric key encryption.

# Note

At this point, this library supports the following curve for elliptic curve cryptography.
- P-256 (secp256r1)
- P-384 (secp384r1)
- P-521 (secp521r1)
- P-256K (secp256k1)

# License

Licensed under the MIT license, see `LICENSE` file.