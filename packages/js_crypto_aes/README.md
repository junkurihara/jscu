Universal Module for AES Encryption and Decryption in JavaScript
--
[![CircleCI](https://circleci.com/gh/junkurihara/js-crypto-aes.svg?style=svg)](https://circleci.com/gh/junkurihara/js-crypto-aes)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to be 'universal' as an AES function, i.e., it works both on most browsers and on Node.js just by importing from npm/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-aes // npm
  $ yarn add js-crypto-aes // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/js-crypto-aes.git
  ```

Then you should import the package as follows.
```shell
import aes from 'js-crypto-aes'; // for npm
import aes from 'js-crypto-aes/dist/index.js'; // for github
```
  
# Usage
## Encryption in AES-GCM
```javascript
const msg = ...; // arbitrary length of message in Uint8Array
const key = ...; // 16 bytes or 32 bytes key in Uint8Array
const iv = ...; // 12 bytes IV in Uint8Array for AES-GCM mode
const additionalData = ...; // optional AAD
aes.encrypt(msg, key, {name: 'AES-GCM', iv, additionalData, tagLength: 16}).then( (encrypted) => {
  // now you get an Uint8Array of encrypted message
});
```

## Decryption in AES-GCM
```javascript
const data = ...; // encryted message in Uint8Array
const key = ...; // 16 bytes or 32 bytes key in Uint8Array
const iv = ...; // 12 bytes IV in Uint8Array for AES-GCM mode that is exactly same as the one used in encryption
const additionalData = ...; // optional AAD
aes.decrypt(data, key, {name: 'AES-GCM', iv, additionalData, tagLength: 16}).then( (decrypted) => {
  // now you get an Uint8Array of decrypted message
});
```

## Encryption in AES-CBC
```javascript
const msg = ...; // arbitrary length of message in Uint8Array
const key = ...; // 16 bytes or 32 bytes key in Uint8Array
const iv = ...; // 16 bytes IV in Uint8Array for AES-CBC mode
aes.encrypt(msg, key, {name: 'AES-CBC', iv}).then( (encrypted) => {
  // now you get an Uint8Array of encrypted message
});
```

## Decryption in AES-CBC
```javascript
const data = ...; // encryted message in Uint8Array
const key = ...; // 16 bytes or 32 bytes key in Uint8Array
const iv = ...; // 16 bytes IV in Uint8Array for AES-CBC mode that is exactly same as the one used in encryption
aes.decrypt(data, key, {name: 'AES-CBC', iv}).then( (decrypted) => {
  // now you get an Uint8Array of decrypted message
});
```


# Note
At this point, this module has the following limitations:
- Supports only AES-GCM and AES-CBC modes
- Supports 128 bits and 256 bits keys in Chrome (192 bits key works in Node.js)

# License
Licensed under the MIT license, see `LICENSE` file.