Universal Module for Cryptographic Key Utilities in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-key-utils.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-key-utils)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as a cryptographic key utilities, i.e., it works both on most browsers and on Node.js just by importing from npm/source code. This key utility library provides useful converters for PEM/DER<->JWK, octet form of EC keys <-> JWK, and computation of JWK thumbprints.

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-key-utils // npm
  $ yarn add js-crypto-key-utils // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-key-utils.git
  ```

Then you should import the package as follows.
```shell
import random from 'js-crypto-key-utils'; // for npm
import random from 'js-crypto-key-utils/dist/index.js'; // for github
```
  
# Usage
Writing....

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