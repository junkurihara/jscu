/**
 * hkdf.js
 */

import params, {HashTypes} from './params';
import * as util from 'js-crypto-env';

import random from 'js-crypto-random';
import hmac  from 'js-crypto-hmac';
import jseu from 'js-encoding-utils';

/**
 * Hash-based Key Derivation Function computing from given master secret and salt.
 * If salt is not given, salt would be automatically generated inside.
 * Specification is given in RFC5869 {@link https://tools.ietf.org/html/rfc5869}.
 * @param {Uint8Array} master - Master secret to derive the key.
 * @param {String} [hash='SHA-256] - Name of hash algorithm used to derive the key.
 * @param {Number} [length = 32] - Intended length of derived key.
 * @param {String} [info=''] - String for information field of HKDF.
 * @param {Uint8Array} [salt=null] - Byte array of salt.
 * @return {Promise<{key: Uint8Array, salt: Uint8Array}>} - Derived key and salt used to derive the key.
 */
export const compute = async (
  master: Uint8Array,
  hash: HashTypes = 'SHA-256',
  length: number = 32,
  info: string = '',
  salt: Uint8Array|null = null
): Promise<{key: Uint8Array, salt: Uint8Array}> => {
  const env = util.getCrypto();

  let key;
  if(!salt) salt = random.getRandomBytes(length);

  if (env.name === 'webCrypto' && typeof env.crypto.importKey === 'function' && typeof env.crypto.deriveBits === 'function') {
    try { // modern browsers supporting HKDF
      const masterObj = await env.crypto.importKey(
        'raw', master, {name: 'HKDF'}, false, ['deriveKey', 'deriveBits']
      );
      const hkdfCtrParams = { name: 'HKDF', salt, info: jseu.encoder.stringToArrayBuffer(info), hash};
      key = await env.crypto.deriveBits(hkdfCtrParams, masterObj, length * 8);
      key = new Uint8Array(key);
    }
    catch (e) { // fall back to pure js implementation
      key = await rfc5869(master, hash, length, info, salt);
    }
  }
  else { // node and IE
    key = await rfc5869(master, hash, length, info, salt);
  }

  return {key, salt};
};

/**
 * Naive implementation of RFC5869 in PureJavaScript
 * @param {Uint8Array} master - Master secret to derive the key.
 * @param {String} hash - Name of hash algorithm used to derive the key.
 * @param {Number} length - Intended length of derived key.
 * @param {String} info - String for information field of HKDF.
 * @param {Uint8Array} salt - Byte array of salt.
 * @return {Promise<Uint8Array>} - Derived key.
 */
const rfc5869 = async (
  master: Uint8Array,
  hash: HashTypes,
  length: number,
  info: string,
  salt: Uint8Array) => {
  const len = params.hashes[hash].hashSize;

  // RFC5869 Step 1 (Extract)
  const prk = await hmac.compute(salt, master, hash);

  // RFC5869 Step 2 (Expand)
  let t = new Uint8Array([]);
  const okm = new Uint8Array(Math.ceil(length / len) * len);
  const uintInfo = jseu.encoder.stringToArrayBuffer(info);
  for(let i = 0; i < Math.ceil(length / len); i++){
    const concat = new Uint8Array(t.length + uintInfo.length + 1);
    concat.set(t);
    concat.set(uintInfo, t.length);
    concat.set(new Uint8Array([i+1]), t.length + uintInfo.length);
    t = await hmac.compute(prk, concat, hash);
    okm.set(t, len * i);
  }
  return okm.slice(0, length);
};
