Universal Module for Password-based Key Derivation Function (PBKDF) in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-pbkdf.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-pbkdf)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as a module for password-based key derivation function (PBKDF), i.e., it works both on most browsers and on Node.js just by importing from npm/source code. This key utility library provides both PBKDF1 and PBKDF2 specified in PKCS#5 v2.1 ([RFC8018](https://tools.ietf.org/html/rfc8018)).

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-pbkdf // npm
  $ yarn add js-crypto-pbkdf // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-pbkdf.git
  ```

Then you should import the package as follows.
```shell
import pbkdf from 'js-crypto-pbkdf'; // for npm
import pbkdf from 'js-crypto-pbkdf/dist/index.js'; // or jscpbkdf.bundle.js for github
```
  
# Usage
## PBKDF2
See [RFC8018 Section 5.2](https://tools.ietf.org/html/rfc8018#section-5.2) for detailed specification.
```javascript
const password = 'password'; // string or Uint8Array
const salt = ...; // Uint8Array
const iterationCount = 2048;
const derivedKeyLen = 32;
const hash = 'SHA-256'; // 'SHA-384', 'SHA-512', 'SHA-1' or 'MD5' 

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
const hash = 'SHA-256'; // 'SHA-384', 'SHA-512', 'SHA-1' or 'MD5' 

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