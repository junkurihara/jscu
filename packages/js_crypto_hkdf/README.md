Universal Module for RFC5869 HKDF (Hash-based Key Derivation Function) in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-hkdf.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-hkdf)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as an HKDF (Hash-based Key Derivation Function), i.e., it works both on most browsers and on Node.js just by importing from npm/source code. The original specification is given in RFC5869 (https://tools.ietf.org/html/rfc5869). Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-hkdf // npm
  $ yarn add js-crypto-hkdf // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-hkdf.git
  ```

Then you should import the package as follows.
```shell
import hmac from 'js-crypto-hkdf'; // for npm
import hmac from 'js-crypto-hkdf/dist/index.js'; // for github
```
  
# Usage
## Derive key from a master secret with salt
```javascript
const masterSecret = ...; // Uint8Array of arbitrary length
const hash = 'SHA-256';
const length = 32; // derived key length
const info = ''; // information specified in rfc5869
hmac.compute(masterSecret, hash, length, info).then( (derivedKey) => {
  // now you get a automatically-generated salt and a key derived from the masterSecret.
});
```

## Derive key from a master secret without salt (salt is randomly generated inside the function)
```javascript
const masterSecret = ...; // Uint8Array of arbitrary length
const hash = 'SHA-256';
const length = 32; // derived key length
const info = ''; // information specified in rfc5869
const salt = ...; // Uint8Array of arbitrary length
hmac.compute(masterSecret, hash, length, info, salt).then( (derivedKey) => {
  // now you get a key derived from the masterSecret
});
```
```

## How to bundle scripts importing this module via Webpack
When you bundle files importing this module via Webpack for web, the bundler tries to simultaneously bundle modules that are compatible to some native modules of Node.js, i.e., those in`node-libs-browser` module. But this module automatically chooses the native `crypto` module in Node.js and `crypto.subtle` of Web API in browsers by checking its running environment, and hence the bundled modules of `node-libs-browser` are redundant. From this observation, you should exclude them wen you create bundle scripts importing this module. In particular, the `externals` option of `webpack.config.js` is useful as follows.
```javascript
{
  externals: {
    'crypto': true
  }
}
``` 

# License
Licensed under the MIT license, see `LICENSE` file.