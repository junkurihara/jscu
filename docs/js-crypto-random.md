Universal Module for Secure Random Generator in JavaScript
--
[![npm version](https://badge.fury.io/js/js-crypto-random.svg)](https://badge.fury.io/js/js-crypto-random)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-random)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-random)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview

This library is designed to 'universally' provide functions of random sequence generators, i.e., it works both on most modern browsers and on Node.js just by importing from NPM/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation

At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-random // npm
  $ yarn add js-crypto-random // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-random
  & yarn build
  ```

Then you should import the package as follows.

```shell
import aes from 'js-crypto-random'; // for npm
import aes from 'path/to/js-crypto-random/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-random/dist/jscrandom.bundle.js` for a use case where the module is imported as a `window.jscrandom` object via `script` tags.
  
# Usage

## Generate random byte sequence

```javascript
// now you get an Uint8Array of 32 bytes filled with randomly generated values
const randomBytes = random.getRandomBytes(32);
```

## Generate random ascii sequence

```javascript
// now you get a string of 32 ASCII characters generated in a cryptographically random manner
const randomAscii = random.getRandomAsciiString(32);
```

# License

Licensed under the MIT license, see `LICENSE` file.