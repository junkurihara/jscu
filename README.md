JavaScript Cryptographic Utilities for Browsers and Node.js Crypto-Suite Compatibility
--
[![CircleCI](https://circleci.com/gh/junkurihara/jscu.svg?style=svg)](https://circleci.com/gh/junkurihara/jscu)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Overview
This library is being developed to provide unified (and specific) cryptographic APIs for browsers and Node.js. There currently exist various sophisticated cryptographic suites for JavaScript that are implemented as native functions, e.g., WebCrypto API and `crypto` in Node.js. However, they have different interfaces and are NOT supported at all platforms. For instance, FireFox cannot be fed PKCS8-formatted private key in WebCrypto API but Chrome does. On the other hand, such suites have not been designed to keep compatibility to existing non-Web cryptographic suites like OpenSSL. This can be seen from the fact that WebCrypto API does not support PEM-formatted keys. Hence we (actually I!) need to write ugly codes so as to enable apps to work in various environments. From this observation, we aim that this library provides support functions to fill such gaps among JS cryptographic suites and that between JavaScript and other popular crypto suites.

Firstly, this library provides following functions that works in most modern browsers and Node.js.
- ECDSA signing, verification, key generation (P-256/P-384/P-521/P-256K)
- Encryption using ECDH and HKDF. 
- Public/private key format conversion between JWK and PEM/DER (SPKI for public/PKCS8 for private)
- Generation of JWK Thumbprint
- Generation of X.509 public key certificate from JWK and extraction of JWK public key from X.509 public key certificate.
Additionally, this library provides random, hash, HMAC and HKDF functions. 

# Module structure
The module structure of this library can be illustrated as follows.
```
/**
 * Structure of API
 * (root)
 *  |-- keyUtil (Key utilities for EC and RSA public keys)
 *  |    |-- jwk
 *  |    |    |-- to
 *  |    |    |-- from
 *  |    |    |-- getThumbprint
 *  |    |-- x509 // TODO RSA is not implemented yet
 *  |         |-- toJwk
 *  |         |-- fromJwk
 *  |         |-- parse (verify)
 *  |
 *  |-- pkc (public key crypto, EC and RSA) // TODO: RSA is not implemented yet
 *  |    |-- generateKey
 *  |    |-- encrypt
 *  |    |-- decrypt
 *  |    |-- sign
 *  |    |-- verify
 *  |
 *  |-- aes // AES encryption
 *  |-- random // Random
 *  |-- hash // Hash funtion
 *  |-- hmac // HMAC
 *  |-- hkdf // HKDF
 */
```

We should note that most of this library's functions are independently available through NPM and GitHub as modules. In other words, this library is being developed as an integrated wrapper of those independent modules. The independent modules are listed as follows:

- `pkc` (EC): https://github.com/junkurihara/js-crypto-ec
- `keyUtil.jwk`: https://github.com/junkurihara/js-crypto-key-utils
- `keyUtil.x509`: https://github.com/junkurihara/js-x509-utils
- `aes`: https://github.com/junkurihara/js-crypto-aes
- `random`: https://github.com/junkurihara/js-crypto-random
- `hash`: https://github.com/junkurihara/js-crypto-hash
- `hkdf`: https://github.com/junkurihara/js-crypto-hkdf
- `hmac`: https://github.com/junkurihara/js-crypto-hmac

Please refer to the above repos for further information.

**NOTE**: If you would use only few modules and employ neither `keyUtil` nor `pkc`, we highly recommend use our independent modules since those independent ones are relatively small and this library would be overkill. 


# Installation
At your project directory, do either one of the following.

- From npm/yarn:
  ```shell
  $ npm install --save js-crypto-utils // npm
  $ yarn add js-crypt-utils // yarn
  ```
  
- From GitHub:
  ```shell
  $ git clone https://github.com/junkurihara/jscu.git
  ``` 
  
Then you should import the package as follows.
```javascript
import jscu from 'js-crypto-utils'; // for npm
import jscu from 'js-crypto-utils/dist/index.js'; // for npm and for github
```

# Usage
**NOTE:** This library always uses JWK-formatted keys ([RFC7517](https://tools.ietf.org/html/rfc7517)) to do any operations. If you have keys in another format, like PEM, please use `jscu.keyUtil.jwk.to` function at first to convert them to JWK.

## Key generation, sign and verify
```javascript
// case of ECDSA
jscu.pkc.generateKey(  // key generation
  'EC', // ECDSA or ECDH key pair
  {namedCurve: 'P-256'} // or 'P-384', 'P-521', 'P-256K'
)
.then( async (keyPair) => { // get a key pair in JWK
  const msg = new Uint8Array(32);
  for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  
  const sig = await jscu.pkc.sign(msg, keyPair.privateKey, 'SHA-256'); // uint8array
  const result = await jscu.pkc.verify(msg, sig, keyPair.publicKey, 'SHA-256'); // true or false
});
```

## Encryption and decryption through ECDH with AES-GCM of 256 bits key and SHA-256 based HKDF
```javascript
const msg = new Uint8Array(32);
for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;

const remotePublicKey = {...}; // destination's publicKey in JWK
const remotePrivateKey = {...}; // destination's publicKey in JWK

jscu.pkc.generateKey(  // key generation
  'EC', // ECDSA or ECDH key pair
  {namedCurve: 'P-256'} // or 'P-384', 'P-521', 'P-256K'
).then( async (keyPair) => { // get a key pair in JWK
  ////////////////////////////
  // encryption at my side
  ////////////////////////////
  const optionsEncryption = {
    privateKey: keyPair.privateKey, // for ECDH, my private key
    hash: 'SHA-256', // for HKDF
    encrypt: 'AES-GCM', // for encryption of message
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
    encrypt: 'AES-GCM', // for encryption of message
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

### Converting between Json Web Key (JWK) and SPKI-formatted (public key) or PKCS8-formatted (private key) PEM/DER
We shall explain the conversion using an example of elliptic curve cryptography keys. First let an elliptic curve crypto public key is given in the form of JWK ([RFC7517](https://tools.ietf.org/html/rfc7517)) as follows:
```javascript
const publicJwk = {kty: 'EC', crv: 'P-256', x: '...', y: '...'};
```

Given JWKs can be converted to the PEM/DER formatted keys in the following procedure.
```javascript
const publicAsn = jscu.keyUtil.jwk.to(
  'pem', // output format is in string PEM, 'der' is also available
  publicJwk,
  'public', // for public key
  {
    compact: false // if true, compressed form of keys are obtained
  });
```

This library also re-convert keys in PEM/DER to JWK as follows.
```javascript
const publicJwkR = jscu.keyUti.jwk.from(
  'pem', // input key is in PEM format
  publicASN,
  'public' // for public key
  );
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

## Extract JWK from X.509 certificate
```javascript
const crtsample = '-----BEGIN CERTIFICATE-----...'; 
const jwkey = jscu.keyUtil.x509.toJwk(crtsample, 'pem');
// now you get JWK public key from PEM-formatted certificate     
```
  
# Notes
One of the listed APIs/libraries is automatically chosen and leveraged for each implemented function, and unified interfaces are provided for browsers and Node.js.

- ECDSA and ECDH (may not work in IE due to AES):
  * WebCrypto API for browsers
  * NodeCrypto for Node.js 
  * [elliptic](https://github.com/indutny/elliptic) for browsers
- AES: (may not work in IE)
  * WebCrypto API for browsers
  * NodeCrypto for Node.js
- Key format conversion:
  * WebCrypto API for browsers
  * [asn1.js](https://github.com/indutny/asn1.js) for browsers and Node.js
- Random, hash, HKDF, HMAC, JWK Thumbprint:
  * WebCrypto API for browsers
  * MsCrypto for IE
  * NodeCrypto for Node.js

# License
Licensed under the MIT license, see `LICENSE` file.