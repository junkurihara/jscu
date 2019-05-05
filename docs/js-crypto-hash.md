Universal Module for Hash Function in JavaScript
--
[![npm version](https://badge.fury.io/js/js-crypto-hash.svg)](https://badge.fury.io/js/js-crypto-hash)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-hash)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-hash)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview

This library is designed to 'universally' provide hash functions, i.e., it works both on most modern browsers and on Node.js just by importing from NPM/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation

At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-hash // npm
  $ yarn add js-crypto-hash // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-hash
  & yarn build
  ```

Then you should import the package as follows.

```shell
import hash from 'js-crypto-hash'; // for npm
import hash from 'path/to/js-crypto-hash/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-hash/dist/jschash.bundle.js` for a use case where the module is imported as a `window.jschash` object via `script` tags.
  
# Usage

## Compute hash value

```javascript
const msg = ...; // Uint8Array of arbitrary length  
const algo = 'SHA-256';
hash.compute(msg, algo).then( (digest) => {
  // now you get a hash of msg in Uint8Array
});
```

# License
Licensed under the MIT license, see `LICENSE` file.