Universal Module for RFC5869 HKDF (Hash-based Key Derivation Function) in JavaScript
--
[![npm version](https://badge.fury.io/js/js-crypto-hkdf.svg)](https://badge.fury.io/js/js-crypto-hkdf)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-hkdf)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-hkdf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to 'universally' provide an HKDF (Hash-based Key Derivation Function), i.e., it works both on most modern browsers and on Node.js just by importing from NPM/source code. The original specification is given in RFC5869 (https://tools.ietf.org/html/rfc5869). Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation

At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-hkdf // npm
  $ yarn add js-crypto-hkdf // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-hkdf
  & yarn build
  ```

Then you should import the package as follows.

```shell
import hkdf from 'js-crypto-hkdf'; // for npm
import hkdf from 'path/to/js-crypto-hkdf/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-hkdf/dist/jschkdf.bundle.js` for a use case where the module is imported as a `window.jschkdf` object via `script` tags.

  
# Usage

## Derive key from a master secret without salt (salt is randomly generated inside the function)

```javascript
const masterSecret = ...; // Uint8Array of arbitrary length
const hash = 'SHA-256';
const length = 32; // derived key length
const info = ''; // information specified in rfc5869
hkdf.compute(masterSecret, hash, length, info).then( (derivedKey) => {
  // now you get a automatically-generated salt and a key derived from the masterSecret.
});
```

## Derive key from a master secret with salt

```javascript
const masterSecret = ...; // Uint8Array of arbitrary length
const hash = 'SHA-256';
const length = 32; // derived key length
const info = ''; // information specified in rfc5869
const salt = ...; // Uint8Array of arbitrary length
hkdf.compute(masterSecret, hash, length, info, salt).then( (derivedKey) => {
  // now you get a key derived from the masterSecret
});
``` 

# License

Licensed under the MIT license, see `LICENSE` file.
