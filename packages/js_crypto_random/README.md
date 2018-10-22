Universal Module for Secure Random Generator in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-random.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-random)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as a random sequence generator, i.e., it works both on most browsers and on Node.js just by importing from npm/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-random // npm
  $ yarn add js-crypto-random // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-random.git
  ```

Then you should import the package as follows.
```shell
import random from 'js-crypto-random'; // for npm
import random from 'js-crypto-random/dist/index.js'; // for github
```
  
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