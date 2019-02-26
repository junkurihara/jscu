Universal Module for Cryptographic Key Utilities in JavaScript
--
[![npm version](https://badge.fury.io/js/js-crypto-key-utils.svg)](https://badge.fury.io/js/js-crypto-key-utils)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-key-utils)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-key-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction and Overview
This library is designed to 'universally' provide several functions for a cryptographic key handling, which means it works both on most browsers and on Node.js just by importing from npm/source code. This key utility library provides converters for EC/RSA keys in PEM/DER<->JWK, octet form of EC keys <-> JWK, and computation of JWK thumbprints. Especially for the conversion PEM/DER <->JWK, encryption and decryption of private key in DER/PEM are supported. 

# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-key-utils // npm
  $ yarn add js-crypto-key-utils // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-key-utils
  & yarn build
  ```

Then you should import the package as follows.

```shell
import keyutil from 'js-crypto-key-utils'; // for npm
import keyutil from 'path/to/js-crypto-key-utils/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-key-utils/dist/jsckey.bundle.js` for a use case where the module is imported as a `window.jsckey` object via `script` tags.

  
# Usage
Supported key types are Json Web Key (JWK, [RFC7517](https://tools.ietf.org/html/rfc7517)), and PEM/DER. Octet-Formatted Key ([SECG SEC1](http://www.secg.org/sec1-v2.pdf) 2.3.3 and 2.3.4, link to PDF) is also available for elliptic curve cryptography keys. Note that for PEM/DER, public keys are encoded to the form of `SubjectPublicKeyInfo` (SPKI) defined as a part of X.509 public key certificate ([RFC5280](https://tools.ietf.org/html/rfc5280)). The detailed encoding rule for elliptic curve cryptographic keys is given in [RFC5480](https://tools.ietf.org/html/rfc5480). On the other hand, private keys are encoded to hte form of `PrivateKeyInfo` defined in PKCS#8 ([RFC5958](https://tools.ietf.org/html/rfc5958)). The detailed encoding rule for elliptic curve cryptographic keys is given in [RFC5915](https://tools.ietf.org/html/rfc5915) as well as SPKI. Please refer to [RFC3447](https://tools.ietf.org/html/rfc3447) for the detailed encoding rule of RSA public and private keys.

## Instantiation
At first, you need to instantiate `Key` object by importing various type of keys. 

```javascript
const yourStringPemKey = '------BEGIN PRIVATE...'; // SPKI (public key) or PKCS8 (either encrypted or plaintext private key)
const yourBinaryDerKey = new Uint8Array([...]); // SPKI (public key) or PKCS8 (either encrypted or plaintext private key)
const yourJasonWebKey = {kty: 'EC', ... };
const yourOctetFormKey = new Uint8Array([0x04, ...]) // only for Elliptic Curve Crypto Key.

const keyObjFromPem = new keyutil.Key('pem', yourStringPemKey);
const keyObjFromDer = new keyutil.Key('der', yourBinaryDerKey);
const keyObjFromJwk = new keyutil.Key('jwk', yourJasonWebKey); 
const keyObjFromOct = new keyutil.Key('oct', yourOctetFormKey, {namedCurve: '...'}); //namedCurve like 'P-256K' is required.
```

## Handling key objects
In a case where the imported key is encrypted (pem/der), it needs to be decrypted before getting exported.
```javascript
const keyObj = new keyutil.Key('pem', encryptedPemKey);
const yourPassphrase = '...';

// first now you can check the status
const isEncrypted = keyObj.isEncrypted;

// before using the key object, decrypt the key object with the passphrase.
if(isEncrypted) await keyObj.decrypt(yourPassphrase);

const thisMustBeFalse = keyObj.isEncrypted; // false

// you can lock the key object by encrypting it as well.
if(!thisMustBeFalse) await keyObj.encrypt(yourPassphrase);

const thisMustBeTrue = keyObj.isEncrypted; // true;
```

## Exporting keys in desired format
From instantiated key objects, various types of keys can be exported.
```javascript
const keyObj = new keyutil.Key('pem', pemKey);

// jwk
let jwk;
if(!keyObj.isEncrypted) jwk = await keyObj.export('jwk');
if(keyObj.isPrivate) jwk = await keyObj.export('jwk', {outputPublic: true}); // export public key from private key.

// pem
let pem;
if(!keyObj.isEncrypted) pem = await keyObj.export('pem');
if(keyObj.isPrivate) pem = await keyObj.export('pem', {outputPublic: true}); // export public key from private key.
// Only ECC Key: export compressed form of public key from private/public key.
pem = await keyObj.export('pem', {outputPublic: true, compact: true});

// der
let der;
if(!keyObj.isEncrypted) der = await keyObj.export('der');
if(keyObj.isPrivate) der = await keyObj.export('der', {outputPublic: true}); // export public key from private key.
// Only ECC Keys: export compressed form of public key from private/public key.
der = await keyObj.export('der', {outputPublic: true, compact: true});

// Only ECC Keys
// octet from
let oct;
if(!keyObj.isEncrypted) oct = await keyObj.export('oct');
if(keyObj.isPrivate) oct = await keyObj.export('oct', {outputPublic: true}); // export public key from private key.
// export compressed form of public key from private/public key.
oct = await keyObj.export('oct', {outputPublic: true, compact: true});
```


## Exporting encrypted keys with arbitrary specified passphrase.
All you need to export encrypted private keys in PEM/DER is just putting passphrase in the API. The default encryption algorithm follows PKCS#5 v2.1 ([RFC8018](https://tools.ietf.org/html/rfc8018)) and uses AES256-CBC and HMAC-with-SHA-256 to encrypt your private key.
```javascript
const keyObj = new keyutil.Key('pem', pemKey);

// encrypt with default params
let encryptedPem;
if(!keyObj.isEncrypted && keyObj.isPrivate)
  encryptedPem = await keyObj.export('pem', {encryptParams: {passphrase: 'top secret'}});

// encrypt with intended params
if(!keyObj.isEncrypted && keyObj.isPrivate)
  encryptedPem = await keyObj.export('pem', {
    encryptParams: {
      passphrase: 'top secret',
      algorithm: 'pbes2', // default. 'pbeWith...' is also available, i.e., pbes1.
      cipher: 'aes256-cbc', // default. for encryption. 'aes128-cbc', 'aes192-cbc'(only node), 'des-ede3-cbc' are available as well.
      prf: 'hmacWithSHA256' // default. for key derivation
    }
  });
```

## Getting JWK Thumbprint
You can obtain the JWK Thumbprint defined in [RFC7638](https://tools.ietf.org/html/rfc7638) from instantiated key object. The API can be invoked as follows.
```javascript
const keyObj = new keyutil.Key('pem', pemKey);

let thumbprint;

// with default params (hash is SHA-256, output is in Uint8Array)
if(!keyObj.isEncrypted) thumbprint = await keyObj.getJwkThumbprint();

// with intented params
if(!keyObj.isEncrypted) thumbprint = await keyObj.getJwkThumbprint(
  'SHA-512',
  'hex' // output is hex string
); 
```
Note that the thumbprint generated from a public key is exactly same as that from its paired private key.

# Note
Now this library supports the following curve for elliptic curve cryptography.
- P-256 (secp256r1)
- P-384 (secp384r1)
- P-521 (secp521r1)
- P-256K (secp256k1)

# License
Licensed under the MIT license, see `LICENSE` file.