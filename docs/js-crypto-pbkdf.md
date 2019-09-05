Universal Module for Password-based Key Derivation Function (PBKDF) in JavaScript
--
[![npm version](https://badge.fury.io/js/js-crypto-pbkdf.svg)](https://badge.fury.io/js/js-crypto-pbkdf)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-pbkdf)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-pbkdf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview

This library is designed to 'universally' provide PBKDF (Password-based Key Derivation Function) functions, i.e., it works both on most modern browsers and on Node.js just by importing from NPM/source code. This key utility library provides both PBKDF1 and PBKDF2 specified in PKCS#5 v2.1 ([RFC8018](https://tools.ietf.org/html/rfc8018)).

# Installation

At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-pbkdf // npm
  $ yarn add js-crypto-pbkdf // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-pbkdf
  & yarn build
  ```

Then you should import the package as follows.

```shell
import pbkdf from 'js-crypto-pbkdf'; // for npm
import pbkdf from 'path/to/js-crypto-pbkdf/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-pbkdf/dist/jscpbkdf.bundle.js` for a use case where the module is imported as a `window.jscpbkdf` object via `script` tags.

  
# Usage

## PBKDF2

See [RFC8018 Section 5.2](https://tools.ietf.org/html/rfc8018#section-5.2) for detailed specification.

```javascript
const password = 'password'; // string or Uint8Array
const salt = ...; // Uint8Array
const iterationCount = 2048;
const derivedKeyLen = 32;
const hash = 'SHA-256'; // 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-512', 'SHA3-384', 'SHA3-256', or 'SHA3-224' 

pbkdf.pbkdf2(
  password,
  salt,
  iterationCount,
  derivedKeyLen,
  hash
).then( (key) => {
  // now you get the derived key of intended length
});
```

## PBKDF1

See [RFC8018 Section 5.1](https://tools.ietf.org/html/rfc8018#section-5.1) for detailed specification.

```javascript
const password = 'password'; // string or Uint8Array
const salt = ...; // Uint8Array
const iterationCount = 2048;
const derivedKeyLen = 32;
const hash = 'SHA-256'; // 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-512', 'SHA3-384', 'SHA3-256', or 'SHA3-224'  

pbkdf.pbkdf1(
  password,
  salt,
  iterationCount,
  derivedKeyLen,
  hash
).then( (key) => {
  // now you get the derived key of intended length
});
```

# License

Licensed under the MIT license, see `LICENSE` file.
