JavaScript Cryptographic Utilities for Browser and Node.js Crypto-Suite Compatibility
--
[![CircleCI](https://circleci.com/gh/junkurihara/jscu.svg?style=svg)](https://circleci.com/gh/junkurihara/jscu)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Overview
This library is build to provide unified (and specific) APIs for browsers and Node.js. Although there exists various sophisticated cryptographic suites in JavaScript, e.g., WebCrypto API and NodeCrypto, they have different interfaces and natively implemented suites are NOT fully supported by all platforms. For instance, FireFox cannot be fed PKCS8-formatted private key in WebCrypto API but Chrome does. On the other hand, such suites have not been designed to keep compatibility to existing non-Web cryptographic suites like OpenSSL. This can be seen from the fact that WebCrypto API does not support PEM-formatted keys. Hence we (actually I!) need to write ugly codes so as to support various environments. From the observation, we aim that this library provides support functions to bridge such gaps among JS cryptographic suites and that between JS and other popular crypto suites.

Firstly, we just started to provide the following functions that works in most modern browsers (Vivaldi/Chrome/Safari/Firefox/Edge/IE) and Node.js (with and without `--experimental-modules`):
- ECDSA signing, verification, key generation (P-256/P-384/P-521)
- Public/private key format conversion between ECDSA JWK and PEM (SPKI for public/PKCS8 for private)
- Generation of X.509 public key certificate from JWK and extraction of JWK public key from X.509 public key certificate.
- JWK EC public key thumbprint 
- Generation of random byte array
- Generation of message digest (SHA-256/384/512)
- HMAC (SHA-256/384/512)
- HKDF (SHA-256/384/512)

The module is totally written in ES6+ and needed to get transpiled with babel for legacy environments.

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

# Usage

- Key generation, sign and verify
  ```javascript
  import jscu from 'js-crypto-utils';
  
  const params = {keyType: 'EC', namedCurve: 'P-256'}; // or 'P-384', 'P-521'
  jscu.crypto.generateKeyPair(params) // key generation
    .then( async (keyPair) => {  
      const msg = new Uint8Array(32);
      for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
      
      const sig = await jscu.crypto.sign(msg, keyPair.privateKey.key, {name: 'SHA-256'}); // uint8array
      const result = await jscu.crypto.verify(msg, sig, keyPair.publicKey.key, {name: 'SHA-256'}); // true or false
    })
  ```

- Encryption through ECDH with AES-GCM of 256 bits key and SHA-256 based HKDF
  ```javascript
  import jscu from 'js-crypto-utils';

  const msg = new Uint8Array(32);
  for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
      
  let options = { hash: 'SHA-256', encrypt: 'AES-GCM', keyLength: 32};
  jscu.crypto.encrypt(msg, remotePublicJwkey, myPrivateJwkey, options)
  .then( async (encrypted) => { // encrypted data object {data: <Uint8Array>, salt: <Uint8Array>, iv: <Uint8Array>}
    options = { hash: 'SHA-256', encrypt: 'AES-GCM', keyLength: 32, salt: encrypted.salt, iv: encrypted.iv };
    return await jscu.crypto.decrypt(encrypted.data, remotePrivateJwkey, myPublicJwkey, options);
  })
  .then( (decrypted) => {
    // now you get decrypted message
  });
  ```
  Note that AES and HKDF are independently available from `jscu.crypto.aes` and `jscu.crypto.hkdf` as well as `random` and `hash`.
  
- Key conversion between PEM (SPKI/PKCS8) and JWK
  ```javascript
  import jscu from 'js-crypto-utils';
  
  const jwk = {kty: 'EC', ...}; // JWK formatted ECDSA key
  jscu.crypto.keyconv.jwkToPem(jwk, 'public')  // or 'private'
    .then( async (pemKey) => { // PEM formatted ECDSA key  
      return await jscu.crypto.keyconv.pemToJwk(pem, 'public', {keyType: 'EC'}); // or 'private'
      // namedCurve can be specified in addtion to keyType as below. Then native WebCryptoAPI will be used.
      // return await jscu.crypto.keyconv.pemToJwk(pem, 'public', {keyType: 'EC', namedCurve: 'P-256'});
    })
    .then( (jwkey) =>{
      // now you get the original jwk
      // NOTE: key_ops and ext entries will be omitted.
    });
  ```
- Generation of JWK EC public key thumbprint https://tools.ietf.org/html/rfc7638
  ```javascript
  import jscu from 'js-crypto-utils';  

  const jwk = {kty: 'EC', ...}; // JWK formatted ECDSA key
  jscu.crypto.jwkey.getThumbprint(jwk, 'SHA-256') // default (jwk, hash='SHA-256', output='array')
    .then( (uint8Thumbprint) => {
    // now you get jwk thumbprint of uint8array
    });
  jscu.crypto.jwkey.getThumbprint(jwk, 'SHA-256', 'hex')
    .then( (hexThumbprint) => {
    // now you get jwk thumbprint of hex string
    });
  ```
  
- Generation of self-signed X.509 EC public key certificate from JWK-formatted key pair
  ```javascript
  import jscu from 'js-crypto-utils';  

  const kp = {publicKey: {kty: 'EC', ...}, privateKey: {kty: 'EC', ...}}; // JWK formatted ECDSA key pair
  const name = {
        countryName: 'JP',
        stateOrProvinceName: 'Tokyo',
        localityName: 'Chiyoda',
        organizationName: 'example',
        organizationalUnitName: 'Research',
        commonName: 'example.com'
      }; // parameters for issuer and subject fields
   jscu.crypto.x509.convertJwkToX509({
        publicJwk: kp.publicKey, // your public key to be certified
        privateJwk: kp.privateKey, // paired with public JWK for self certified public key
        options: {
          signature: 'ecdsa-with-sha256',
          days: 365,
          format: 'pem',
          issuer: name,
          subject: name
        }
   }).then( (x509) => {
     // now you get x509 formatted public key certificate
   });
  ```
  you can also parse and extract signature/message parts and jwk-formatted public key from x509 with another api.

- Random and Hash
  ```javascript
  import jscu from 'js-crypto-utils';

  const randomMessageAndHash = async () => {
    const msg = await jscu.crypto.random.getRandomBytes(32);
    const digest = await jscu.crypto.hash.getHash('SHA-256', msg);
    return {msg: msg, digest: digest};
  };
  ```

- HKDF
  ```javascript
  import jscu from 'js-crypto-utils';

  const randomMasterKeyAndHKDF = async () => {
    const master = await jscu.crypto.random.getRandomBytes(32);
  
    const sessionKey = await jscu.crypto.hkdf.getKeySalt(master, 'SHA-256', 64, '', null); // with automatic random salt generation
    console.log(sessionKey); // {key: <Uint8Array>, salt: <Uint8Array>}
  
    const duplicated = await jscu.crypto.hkdf.getKeySalt(master, 'SHA-256', 64, '', sessionKey.salt); // with externally-generated salt
    console.log(sessionKey.key.toString() === duplicated.key.toString()); // true
  };
  ```
  
- HMAC
  ```javascript
  import jscu from 'js-crypto-utils';
  
  const hmacWithRandomKey = async () => {
    const msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  
    const key = await jscu.crypto.random.getRandomBytes(32);
    const mac = await jscu.crypto.hmac.getMac(key, msg, 'SHA-256');  
    
    const macx = await jscu.crypto.hmac.getMac(key, msg, 'SHA-256');
    console.log(mac.toString() === macx.toString()); // true
      
    const newmsg = Object.assign({}, {x: msg}).x;
    newmsg[1] = 0x33;
    const macy = await jscu.crypto.hmac.getMac(key, newmsg, 'SHA-256');
    console.log(mac.toString() === macy.toString()); // false
  };
  ```
  
# Notes
One of the listed APIs/libraries is automatically chosen and leveraged for each implemented function, and unified interfaces are provided for browsers and Node.js.

- ECDH and ECDSA functions: (may not work in IE)
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