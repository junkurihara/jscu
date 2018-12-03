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
 *  |-- pbkdf
 */

import aes from 'js-crypto-aes';
import random from 'js-crypto-random';
import hash from 'js-crypto-hash';
import hmac from 'js-crypto-hmac';
import hkdf from 'js-crypto-hkdf';
import x509 from 'js-x509-utils';
import pbkdf from 'js-crypto-pbkdf';

import {Key} from 'js-crypto-key-utils';
import * as pkc from './pkc.js';

export {
  Key,
  pkc,
  x509,
  aes,
  random,
  hash,
  hmac,
  hkdf,
  pbkdf
};

export default {
  Key,
  pkc,
  x509,
  aes,
  random,
  hash,
  hmac,
  hkdf,
  pbkdf
};