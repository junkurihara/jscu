Universal Module for Hash Function in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-hash.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-hash)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as a hash function module, i.e., it works both on most browsers and on Node.js just by importing from npm/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-hash // npm
  $ yarn add js-crypto-hash // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-hash.git
  ```

Then you should import the package as follows.
```shell
import hash from 'js-crypto-hash'; // for npm
import hash from 'js-crypto-hash/dist/index.js'; // for github
```
  
# Usage
## Compute hash value
```javascript
const msg = ...; // Uint8Array of arbitrary length  
const hash = 'SHA-256';
hmac.compute(msg, hash).then( (digest) => {
  // now you get a hash of msg in Uint8Array
});
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