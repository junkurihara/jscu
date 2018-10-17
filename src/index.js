/**
 * index.js
 * Structure of API
 * ---- Key (Key object with methods handling EC and RSA public keys)
 *  |
 *  |-- pkc (public key crypto, EC and RSA) // TODO: Encrypt/decrypt with ECDH standardized procedure
 *  |    |-- generateKey
 *  |    |-- encrypt
 *  |    |-- decrypt
 *  |    |-- sign
 *  |    |-- verify
 *  |
 *  |-- x509 // TODO verify self-signed certificate in single line
 *  |    |-- toJwk
 *  |    |-- fromJwk
 *  |    |-- parse (verify)
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
import x509 from 'js-x509-utils/dist/index.js';

import {Key} from 'js-crypto-key-utils/dist/index.js';
import * as pkc from './pkc.js';

export {
  Key,
  pkc,
  x509,
  aes,
  random,
  hash,
  hmac,
  hkdf
};

export default {
  Key,
  pkc,
  x509,
  aes,
  random,
  hash,
  hmac,
  hkdf
};