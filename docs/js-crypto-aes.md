Universal Module for AES Encryption and Decryption in JavaScript
--

[![npm version](https://badge.fury.io/js/js-crypto-aes.svg)](https://badge.fury.io/js/js-crypto-aes)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-aes)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-aes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview

This library is designed to 'universally' provide AES encryption and decryption functions, i.e., it works both on most modern browsers and on Node.js just by importing from NPM/source code. Note that in the design principle, the library fully utilizes native APIs like WebCrypto API to accelerate its operation if available. 

# Installation

At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-aes // npm
  $ yarn add js-crypto-aes // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-aes
  & yarn build
  ```

Then you should import the package as follows.

```shell
import aes from 'js-crypto-aes'; // for npm
import aes from 'path/to/js-crypto-aes/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-aes/dist/jscaes.bundle.js` for a use case where the module is imported as a `window.jscaes` object via `script` tags.
  
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

## Encryption in AES-CTR

```javascript
const msg = ...; // arbitrary length of message in Uint8Array
const key = ...; // 16 bytes or 32 bytes key in Uint8Array
const iv = ...; // 12 bytes IV in Uint8Array for AES-CTR mode
aes.encrypt(msg, key, {name: 'AES-CTR', iv}).then( (encrypted) => {
  // now you get an Uint8Array of encrypted message
});
```
The counter block will be `iv||00...01`. If `iv.length = 16`, it should be `iv + 1`.

## Decryption in AES-CTR

```javascript
const data = ...; // encryted message in Uint8Array
const key = ...; // 16 bytes or 32 bytes key in Uint8Array
const iv = ...; // 12 bytes IV in Uint8Array for AES-CTR mode that is exactly same as the one used in encryption
aes.decrypt(data, key, {name: 'AES-CTR', iv}).then( (decrypted) => {
  // now you get an Uint8Array of decrypted message
});
```


## AES-KW Key Wrapping (RFC3394)

```javascript
const kEK = ...; // Key Encryption Key in 128, 192, 256 bits (192 only in Node.js)
const cEK = ...; // Key to be wrapped of 128, 192, 256 bits (192 only in Node.js)

aes.wrapKey(cEK, kEK, {name: 'AES-KW'}).then( (wrapped) => {
 // wrapped key is here
});
```

## AES-KW Key (RFC3394)

```javascript
const kEK = ...; // Key Encryption Key in 128, 192, 256 bits (192 only in Node.js)
const wrapped = ...; // Wrapped key in Uint8Array

aes.unwrapKey(wrapped, kEK, {name: 'AES-KW'}).then( (cEK) => {
 // now you get the plaintext key
});
```



# Note

At this point, this module has the following limitations:
- Supports AES-GCM, AES-CBC and AES-CTR modes
- Supports AES-KW with default initial values (unable to change in WebCrypto)
- Supports 128 bits and 256 bits keys in Chrome (192 bits key works in Node.js)

# License
Licensed under the MIT license, see `LICENSE` file.
