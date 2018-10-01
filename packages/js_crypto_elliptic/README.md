Universal Module for Elliptic Curve Cryptography (ECDSA and ECDH) in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-ec.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-ec)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as an elliptic curve cryptography library, i.e., it works both on most browsers and on Node.js just by importing from npm/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. This library provides APIs to employ ECDSA, ECDH and their key generation, i.e., `sign`, `verify`, `generateKey` and `deriveSecret`.

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-ec // npm
  $ yarn add js-crypto-ec // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-ec.git
  ```

Then you should import the package as follows.
```shell
import random from 'js-crypto-ec'; // for npm
import random from 'js-crypto-ec/dist/index.js'; // for github
```
  
# Usage
writing....


# License
Licensed under the MIT license, see `LICENSE` file.