Universal Module for HMAC (Hash-based Message Authentication Code) in JavaScript
--
[![npm version](https://badge.fury.io/js/js-crypto-hmac.svg)](https://badge.fury.io/js/js-crypto-hmac)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-hmac)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-hmac)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview

This library is designed to 'universally' provide HMAC (Hash-based Message Authentication Code) functions, i.e., it works both on most modern browsers and on Node.js just by importing from NPM/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation

At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-hmac // npm
  $ yarn add js-crypto-hmac // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-hmac
  & yarn build
  ```

Then you should import the package as follows.

```shell
import hmac from 'js-crypto-hmac'; // for npm
import hmac from 'path/to/js-crypto-hmac/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-hmac/dist/jschmac.bundle.js` for a use case where the module is imported as a `window.jschmac` object via `script` tags.

  
# Usage

## Compute Keyed-Hash (Message Authentication Code) of a Message

```javascript
const msg = ...; // Uint8Array of arbitrary length
const key = ...; // Uint8Array of 32 bytes (since SHA-256 is used)  
const hash = 'SHA-256';
hmac.compute(key, msg, hash).then( (hmac) => {
  // now you get a keyed-hash of msg in Uint8Array
});
```

## Verify Keyed-Hash

```javascript
const msg = ...; // Uint8Array of arbitrary length
const key = ...; // Uint8Array of 32 bytes (since SHA-256 is used)
const mac = ...; // computed keyed hash in Uint8Array   
const hash = 'SHA-256';
hmac.verify(key, msg, mac, hash).then( (result) => {
  // now you get true or false as the result of verification
});
```

# License

Licensed under the MIT license, see `LICENSE` file.