Universal Module for RSA Cryptography (RSA-OAEP and RSASSA-PSS/PKCS1-V1_5) in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-rsa.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-rsa)
> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as an RSA cryptography library, i.e., it works both on most browsers and on Node.js just by importing from npm/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. This library provides APIs to employ RSA-OAEP, RSA-PSS/RSASSA-PKCS1-v1_5 and their key generation, i.e., `sign`, `verify`, `encrypt` and `decrypt`.

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-rsa // npm
  $ yarn add js-crypto-rsa // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-rsa.git
  ```

Then you should import the package as follows.
```shell
import rsa from 'js-crypto-rsa'; // for npm
import rsa from 'js-crypto-rsa/dist/index.js'; // for github/npm
```
  
# Usage
This library always uses JWK-formatted keys ([RFC7517](https://tools.ietf.org/html/rfc7517)) to do any operations. If you utilize keys of other format, like PEM, please use [`js-crypto-key-utils`](https://github.com/junkurihara/js-crypto-key-utils) to convert them to JWK.

## Key generation
```javascript
rsa.generateKey(2048).then( (key) => {
  // now you get the JWK public and private keys
  const publicKey = key.publicKey;
  const privateKey = key.privateKey;
})
```

## Sign and verify
```javascript
const publicJwk = {kty: 'RSA', n: '...', e: '...'}; // public key
const privateJwk = {ktyp: 'RSA', n: 'P-256', e: '...', p: '...', q: '...', dp: '...', dq: '...', qi: '...'}; // paired private key
const msg = ...; // Uint8Array

// sign
rsa.sign(
  msg,
  privateJwk,
  'SHA-256',
  { // optional
    name: 'RSA-PSS', // default. 'RSASSA-PKCS1-v1_5' is also available.
    saltLength: 64
  }
  ).then( (signature) => {
  // now you get the signature in Uint8Array
  return rsa.verify(
    msg,
    sign,
    publicJwk,
    'SHA-256',
      { // optional
        name: 'RSA-PSS', // default. 'RSASSA-PKCS1-v1_5' is also available.
        saltLength: 64 // default is the same as hash length
      } 
    );  
}).then( (valid) => {
  // now you get the result of verification in boolean
});
```

## Encrypt and decrypt
```javascript
const publicJwk = {kty: 'RSA', n: '...', e: '...'}; // public key
const privateJwk = {ktyp: 'RSA', n: 'P-256', e: '...', p: '...', q: '...', dp: '...', dq: '...', qi: '...'}; // paired private key
const msg = ...; // Uint8Array

// sign
rsa.encrypt(
  msg,
  publicJwk,
  'SHA-256', // optional, for OAEP. default is 'SHA-256'
  { // optional
    name: 'RSA-PSS', // default. 'RSASSA-PKCS1-v1_5' is also available.
    // label: new Uint8Array([...]) // optional
  }).then( (encrypted) => {
  // now you get an encrypted message in Uint8Array
    return rsa.decrypt(
      encrypted,
      privateJwk,
      'SHA-256', // optional, for OAEP. default is 'SHA-256'
      { // optional
        name: 'RSA-PSS', // default. 'RSASSA-PKCS1-v1_5' is also available.
        // label: new Uint8Array([...]) // optional
      }
    );  
}).then( (decrypted) => {
  // now you get the decrypted message
});
```

# Note
This library has the following limitations at this point.

- RSA key generation in Node.js is currently unsupported. **It will be available soon from Node.js v10.12.0.** (https://github.com/nodejs/node/pull/22660#issuecomment-423759973)
- This library may not work in legacy browsers like IE11. This library heavily relies on the native (but standardized) implementation of RSA cryptographic modules in browsers and Node.js and it does not employ pure-JS RSA implementations for compatibility yet. Currently, we strongly recommend to use this library in slightly modern environments...

# License
Licensed under the MIT license, see `LICENSE` file.