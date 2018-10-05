/**
 * index.js
 * Structure of API
 * --- keyUtil (key utilities for EC and RSA public keys)
 *  |    |-- jwk
 *  |    |    |-- to
 *  |    |    |-- from
 *  |    |    |-- getThumbprint
 *  |    |-- x509 // TODO verify self-signed certificate in single line
 *  |         |-- toJwk
 *  |         |-- fromJwk
 *  |         |-- parse (verify)
 *  |
 *  |-- pkc (public key crypto, EC and RSA) // TODO: RSA key generation and encrypt/decrypt with ECDH standard procedure
 *  |    |-- generateKey
 *  |    |-- encrypt
 *  |    |-- decrypt
 *  |    |-- sign
 *  |    |-- verify
 *  |
 *  |-- aes
 *  |-- random
 *  |-- hash
 *  |-- hmac
 *  |-- hkdf
 */

import aes from 'js-crypto-aes/dist/index.js';
import random from 'js-crypto-random/dist/index.js';
import hash from 'js-crypto-hash/dist/index.js';
import hmac from 'js-crypto-hmac/dist/index.js';
import hkdf from 'js-crypto-hkdf/dist/index.js';

import * as keyUtil from './keyutil.js';
import * as pkc from './pkc.js';

export {
  keyUtil,
  pkc,
  aes,
  random,
  hash,
  hmac,
  hkdf
};

export default {
  keyUtil,
  pkc,
  aes,
  random,
  hash,
  hmac,
  hkdf
};