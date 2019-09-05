JavaScript Cryptographic Utilities for Browsers and Node.js Crypto-Suite Compatibility
--
[![npm version](https://badge.fury.io/js/js-crypto-utils.svg)](https://badge.fury.io/js/js-crypto-utils)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg?path=packages/js-crypto-utils)](https://david-dm.org/junkurihara/jscu?path=packages/js-crypto-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Overview
This library is being developed to provide unified cryptographic APIs for browsers and Node.js. There currently exist various sophisticated cryptographic suites for JavaScript that are implemented as native functions, e.g., WebCrypto API and `crypto` in Node.js. However, they have different interfaces and are NOT supported at all platforms. For instance, FireFox cannot be fed PKCS8-formatted private key in WebCrypto API but Chrome does. On the other hand, such suites have not been designed to keep compatibility to existing non-Web cryptographic suites like OpenSSL. This can be seen from the fact that WebCrypto API does not support PEM-formatted keys. Hence we (actually I!) need to write ugly codes so as to enable apps to work in various environments. From this observation, we aim that this library provides support functions to fill such gaps among JS cryptographic suites and that between JavaScript and other popular crypto suites.

Firstly, this library provides following functions that works in most modern browsers and Node.js.
- ECDSA signing, verification, key generation (P-256/P-384/P-521/P-256K)
- RSA-PSS/RSASSA-PKCS1-v1_5 signing, verification, key generation.
- Encryption using ECDH and HKDF.
- Encryption using RSA-OAEP. 
- Public/private key format conversion between JWK and PEM/DER (SPKI for public/PKCS8 for private)
- Generation of JWK Thumbprint
- Generation of X.509 public key certificate from JWK and extraction of JWK public key from X.509 public key certificate.
Additionally, this library provides random, hash, AES, HMAC, HKDF, and PBKDF functions. 

# Module structure
The module structure of this library can be illustrated as follows.
```
/**
 * index.js
 * Structure of API
 *  |-- Key (Key object handling EC and RSA public/private keys)
 *  |
 *  |-- pkc (public key crypto, EC and RSA)
 *  |    |-- generateKey
 *  |    |-- encrypt
 *  |    |-- decrypt
 *  |    |-- sign
 *  |    |-- verify
 *  |
 *  |-- x509
 *  |    |-- toJwk
 *  |    |-- fromJwk
 *  |    |-- parse (to verify)
 *  |
 *  |-- aes
 *  |-- random
 *  |-- hash
 *  |-- hmac
 *  |-- hkdf
 *  |-- pbkdf
 */
```

We should note that most of this library's functions are independently available through NPM and GitHub as modules. In other words, this library is being developed as an integrated wrapper of those independent modules. The independent modules are listed as follows:

- `Key`: https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-key-utils
- `pkc` (EC): https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-ec
- `pkc` (RSA): https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-rsa
- `x509`: https://github.com/junkurihara/jscu/tree/develop/packages/js-x509-utils
- `aes`: https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-aes
- `random`: https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-random
- `hash`: https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-hash
- `hkdf`: https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-hkdf
- `pbkdf`: https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-pbkdf
- `hmac`: https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-hmac

Please refer to the above repos for further information.

**NOTE**: If you would use only few modules and employ neither `Key` nor `pkc`, we highly recommend use our independent modules since those independent ones are relatively small and this library would be overkill. 


# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-utils // npm
  $ yarn add js-crypto-utils // yarn
  ```
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  $ cd js-crypto-utils/packages/js-crypto-utils
  & yarn build
  ```

Then you should import the package as follows.

```shell
import jscu from 'js-crypto-utils'; // for npm
import jscu from 'path/to/js-crypto-utils/dist/index.js'; // for github
```

The bundled file is also given as `js-crypto-utils/dist/jscu.bundle.js` for a use case where the module is imported as a `window.jscu` object via `script` tags.


# Usage
**NOTE:** This library always uses `jscu.Key` objects as instances of public and private keys, and the `Key` object can be instantiated from and can export ones in various formats. For the detailed usage of `Key` object, please refer to [another GitHub repo](https://github.com/junkurihara/js-crypto-key-utils).

## Key generation, sign and verify
```javascript
// case of ECDSA
jscu.pkc.generateKey(  // key generation
  'EC', // ECDSA or ECDH key pair
  {namedCurve: 'P-256'} // or 'P-384', 'P-521', 'P-256K'
)
.then( async (keyPair) => { // get a key pair in jscu.Key object
  const msg = new Uint8Array(32);
  for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  
  const sig = await jscu.pkc.sign(msg, keyPair.privateKey, 'SHA-256'); // uint8array
  const result = await jscu.pkc.verify(msg, sig, keyPair.publicKey, 'SHA-256'); // true or false
});
```

```javascript
// case of RSA
jscu.pkc.generateKey(  // key generation
  'RSA', // RSA key pair
  {modulusLength: 2048}
)
.then( async (keyPair) => { // get a key pair in jscu.Key object
  const msg = new Uint8Array(32);
  for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  
  // case of RSA-PSS
  // RSASSA-PKCS1-v1_5 is supported as well. see test files.
  const sig = await jscu.pkc.sign(msg, keyPair.privateKey, 'SHA-256', {name: 'RSA-PSS', saltLength: 32}); // uint8array
  const result = await jscu.pkc.verify(msg, sig, keyPair.publicKey, 'SHA-256', {name: 'RSA-PSS', saltLength: 32}); // true or false
});
```

## Encryption and decryption through ECDH with AES-GCM of 256 bits key and SHA-256 based HKDF
```javascript
const msg = new Uint8Array(32);
for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;

const remotePublicKey = {...}; // destination's publicKey in jscu.Key object
const remotePrivateKey = {...}; // destination's privateKey in jscu.Key object

jscu.pkc.generateKey(  // key generation
  'EC', // ECDSA or ECDH key pair
  {namedCurve: 'P-256'} // or 'P-384', 'P-521', 'P-256K'
).then( async (keyPair) => { // get a key pair in jscu.Key object
  ////////////////////////////
  // encryption at my side
  ////////////////////////////
  const optionsEncryption = {
    privateKey: keyPair.privateKey, // for ECDH, my private key
    hash: 'SHA-256', // for HKDF
    encrypt: 'AES-GCM', // for encryption of message, if message is a key, 'AES-KW' can be used as well.
    keyLength: 32, // key length of AES
    info: '' // for HKDF
  };
  const encrypted = await jscu.pkc.encrypt(msg, remotePublicKey, optionsEncryption);
  // now you get the encrypted message
  
  ////////////////////////////
  // decryption at remote side
  ////////////////////////////
  const optionsDecryption = {
    publicKey: keyPair.publicKey, // for ECDH, my public key
    hash: 'SHA-256', // for HKDF
    encrypt: 'AES-GCM', // for encryption of message. 'AES-KW' can be used as well
    keyLength: 32, // key length of AES
    info: '', // for HKDF
    salt: encrypted.salt, // for HKDF
    iv: encrypted.iv // for AES
  };
  const decrypted = await jscu.pkc.decrypt(encrypted.data, remotePrivateKey, optionsDecryption);
  // now you get decrypted message
});
```
Note that AES and HKDF are independently available from `jscu.aes` and `jscu.hkdf` as well as `random` and `hash`. Also note that the HKDF employed in this library is the one specified in RFC5869 (https://tools.ietf.org/html/rfc5869). 


## RSA-OAEP encryption and decryption
```javascript
const msg = new Uint8Array(32);
for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;

const publicKey = {...}; // publicKey in jscu.Key object
const privateKey = {...}; // privateKey in jscu.Key object

jscu.pkc.encrypt(
  msg,
  publicKey,
  {hash: 'SHA-256'} // for OAEP
).then( (encrypted) => {
 // now you get the encrypted message
 return jscu.pkc.decrypt(
   encrypted, 
   privateKey,
   {hash: 'SHA-256'}); // for OAEP
}).then( (decrypted) => {
  // now you get the decrypted message
})
```

## Converting between Json Web Key (JWK) and SPKI-formatted (public key) or PKCS8-formatted (private key) PEM/DER
We shall explain the conversion using an example of elliptic curve cryptography keys. First let an elliptic curve crypto public key is given in the form of JWK ([RFC7517](https://tools.ietf.org/html/rfc7517)) as follows:
```javascript
const publicJwk = {kty: 'EC', crv: 'P-256', x: '...', y: '...'};
```

Given JWKs can be converted to the PEM/DER formatted keys in the following procedure.
```javascript
const publicKeyObject = new jscu.Key('jwk', publicJwk);
const publicAsn = await publicKeyObject.export(
  'pem', // output format is in string PEM, 'der' is also available
  {
    compact: false // if true, compressed form of keys are obtained
  });
```

This library also re-convert keys in PEM/DER to JWK as follows.
```javascript
const publicKeyObjectR = new jscu.Key('pem', publicASN);
const publicJwkR = publicKeyObjectR.export('jwk');
```
Note that JWK/DER/PEM-formatted RSA keys can be handled in the similar manner to the above. 

## Generation of self-signed X.509 certificate from JWK-formatted public key
```javascript
const publicJwk = {kty: 'EC', crv: 'P-256', x: '...', y: '...'}; // public key to be signed
const privateJwk = {ktyp: 'EC', crv: 'P-256', x: '...', y: '...', d: '...'}; // private key

const name = { // this is optional
      countryName: 'JP',
      stateOrProvinceName: 'Tokyo',
      localityName: 'Chiyoda',
      organizationName: 'example',
      organizationalUnitName: 'Research',
      commonName: 'example.com'
    };

// generation from JWK
jscu.keyUtil.x509.fromJwk(
  publicJwk,
  privateJwk,
  'pem',
  {
    signature: 'ecdsa-with-sha256', // signature algorithm
    days: 365, // expired in days
    issuer: name, // issuer
    subject: name // assume that issuer = subject, i.e., self-signed certificate
  },
  'pem' // output signature is in PEM. DER-encoded signature is available with 'der'.
).then( (cert) => {
  // now you get the certificate in PEM string
});
```
For `signature`, `rsassaPss` (RSA-PSS) and `sha*WithRSAEncryption` (RSASSA-PKCS1-v1_5) are available as well. When `rsassaPss` is specified, `saltLength` and `hash` are required as its params. 

## Extract JWK from X.509 certificate
```javascript
const crtsample = '-----BEGIN CERTIFICATE-----...'; 
const jwkey = jscu.keyUtil.x509.toJwk(crtsample, 'pem');
// now you get JWK public key from PEM-formatted certificate     
```
  
# Notes
One of the listed APIs/libraries is automatically chosen and leveraged for each implemented function, and unified interfaces are provided for browsers and Node.js.

- ECDSA and ECDH:
  * WebCrypto API for browsers
  * NodeCrypto for Node.js 
  * [elliptic](https://github.com/indutny/elliptic) for browsers
- RSA-PSS, RSASSA-PKCS1-v1_5, RSA-OAEP (RSA-PSSS does not work in IE and Edge)
  * WebCrypto API for browsers
  * NodeCrypto for Node.js
- Key format conversion:
  * WebCrypto API for browsers
  * [asn1.js](https://github.com/indutny/asn1.js) for browsers and Node.js
- X.509 generation from JWK, and extraction of JWK from X.509 (may not work in IE due to RSA)
  * WebCrypto API for browsers
  * NodeCrypto for Node.js
  * [elliptic](https://github.com/indutny/elliptic) for browsers
- AES: (may not work in IE)
  * WebCrypto API for browsers
  * NodeCrypto for Node.js
- Random, hash, HKDF, HMAC, JWK Thumbprint
  * WebCrypto API for browsers
  * MsCrypto for IE
  * NodeCrypto for Node.js
  
  Especially for Hash functions, we shall use the following pure JS implementation for some browsers (WebCrypto does not support SHA-3 yet). SHA-512/SHA-1 does not work in IE, SHA-1 doesn't in Edge. I believe IE/Edge should be discarded ASAP.
  * [sha3](https://www.npmjs.com/package/sha3) for SHA3-224, SHA3-256, SHA3-384 and SHA3-512 for browsers
  * [hash.js](https://www.npmjs.com/package/hash.js) for SHA-1, SHA-256, SHA-384, SHA-512 for some legacy browsers
  * [md5](https://www.npmjs.com/package/md5) for MD5 for some legacy browsers

# License
Licensed under the MIT license, see `LICENSE` file.
