/**
 * index.ts
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

import * as jscaes from 'js-crypto-aes';
import * as jscrandom from 'js-crypto-random';
import * as jschash from 'js-crypto-hash';
import * as jschmac from 'js-crypto-hmac';
import * as jschkdf from 'js-crypto-hkdf';
import * as jsx509 from 'js-x509-utils';
import * as jscpbkdf from 'js-crypto-pbkdf';

import * as key from 'js-crypto-key-utils';
import * as jscpkc from './pkc';

export const Key = key.Key;
export const pkc = jscpkc;
export const x509 = jsx509;
export const aes = jscaes;
export const random = jscrandom;
export const hash = jschash;
export const hmac = jschmac;
export const hkdf = jschkdf;
export const pbkdf = jscpbkdf;

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
