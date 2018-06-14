JavaScript Cryptographic Utilities for Browser and Node.js Crypto-Suite Compatibility
--
[![CircleCI](https://circleci.com/gh/junkurihara/jscu.svg?style=svg)](https://circleci.com/gh/junkurihara/jscu)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Overview
This library is build to provide unified (and specific) APIs for browsers and Node.js. Although there exists various sophisticated cryptographic suites in JavaScript, e.g., WebCrypto API and NodeCrypto, they have different interfaces and natively implemented suites are NOT fully supported by all platforms. For instance, FireFox cannot be fed PKCS8-formatted private key in WebCrypto API but Chrome does. On the other hand, such suites have not been designed to keep compatibility to existing non-Web cryptographic suites like OpenSSL. This can be seen from the fact that WebCrypto API does not support PEM-formatted keys. Hence we (actually I!) need to write ugly codes so as to support various environments. From the observation, we aim that this library provides support functions to bridge such gaps among JS cryptographic suites and that between JS and other popular crypto suites.

Firstly, we just started to provide the following functions that works in most modern browsers (Vivaldi/Chrome/Safari/Firefox/Edge/IE) and Node.js (with and without `--experimental-modules`):
- ECDSA signing, verification, key generation (P-256/P-384/P-521)
- Public/private key format conversion between ECDSA JWK and PEM (SPKI for public/PKCS8 for private) 
- Generation of random byte array
- Generation of message digest (SHA-256/384/512)

The module is totally written in ES6+ and needed to get transpiled with babel for legacy environments.

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  
  ```shell
  $ npm install --save js-crypto-utils // npm
  $ yarn add js-crypt-utils // yarn
  ```
  
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  ``` 

# Usage

- Key generation, sign and verify
  ```javascript
  import jscu from 'js-crypto-utils';
  
  const params = {
    extractable: true,
    keyUsage: ['sign', 'verify'],
    algo: {name: 'ECDSA', namedCurve: 'P-256'} // or 'P-384', 'P-521'
  };
  jscu.crypto.generateKeyPair(params) // key generation
    .then( async (keyPair) => {  
      const msg = new Uint8Array(32);
      for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
      
      const sig = await jscu.crypto.sign(msg, keyPair.privateKey.key, {name: 'SHA-256'}); // uint8array
      const result = await jscu.crypto.verify(msg, sig, keyPair.publicKey.key, {name: 'SHA-256'}); // true or false
    })
  ```

- Key conversion between PEM (SPKI/PKCS8) and JWK
  ```javascript
  import jscu from 'js-crypto-utils';
  
  const jwk = {kty: 'EC', ...}; // JWK formatted ECDSA key
  jscu.crypto.keyconv.jwkToPem(jwk, 'public')  // or 'private'
    .then( async (pemKey) => { // PEM formatted ECDSA key  
      return await jscu.crypto.keyconv.pemToJwk(pem, 'public', {name: 'ECDSA'}); // or 'private'
    })
    .then( (jwkey) =>{
      // now you get the original jwk 
    });
  ```

- Random and Hash
  ```javascript
  import jscu from 'js-crypto-utils';

  const randomMessageAndHash = async () => {
    const msg = await jscu.crypto.random.getRandomBytes(32);
    const digest = await jscu.crypto.hash.getHash('SHA-256', msg);
    return {msg: msg, digest: digest};
  };
  ```

# Notes
One of the listed APIs/libraries is automatically chosen and leveraged for each implemented function, and unified interfaces are provided for browsers and Node.js.

- ECDSA functions:
  * WebCrypto API for browsers;
  * [elliptic](https://github.com/indutny/elliptic) for browsers; and
  * [node-webcrypto-ossl](https://github.com/PeculiarVentures/node-webcrypto-ossl) for Node.js
- Key format conversion:
  * WebCrypto API for browsers;
  * [asn1.js](https://github.com/indutny/asn1.js) for browsers; and
  * [node-webcrypto-ossl](https://github.com/PeculiarVentures/node-webcrypto-ossl) for Node.js
- Random and digest functions:
  * WebCrypto API for browsers;
  * MsCrypto for IE; and
  * [node-webcrypto-ossl](https://github.com/PeculiarVentures/node-webcrypto-ossl) for Node.js

# License
Licensed under the MIT license, see `LICENSE` file.