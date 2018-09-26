/**
 * hkdf.js
 */

import params from './params.js';
import * as util from './util.js';

import random from 'js-crypto-random';
import hmac  from 'js-crypto-hmac';

/**
 * Hash-based Key Derivation Function computing from given master secret and salt.
 * If salt is not given, salt would be automatically generated inside.
 * Specification: https://tools.ietf.org/html/rfc5869
 * @param master
 * @param hash
 * @param length
 * @param info
 * @param salt
 * @return {Promise<{key: *, salt: *}>}
 */
export async function compute(master, hash = 'SHA-256', length = 32, info = '', salt = null){
  if(!info) info = '';
  const webCrypto = util.getWebCrypto(); // web crypto api

  let key;
  if(!salt) salt = await random.getRandomBytes(length);

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.deriveBits === 'function') {
    try { // modern browsers supporting HKDF
      const masterObj = await webCrypto.subtle.importKey('raw', master, {name: 'HKDF'}, false, ['deriveKey', 'deriveBits']);
      key = await webCrypto.subtle.deriveBits({
        name: 'HKDF',
        salt,
        info: new Uint8Array(info),
        hash
      }, masterObj, length * 8);
      key = new Uint8Array(key);
    }
    catch (e) { // TODO for edge
      key = await rfc5869(master, salt, hash, info, length);
    }
  }
  else {
    key = await rfc5869(master, salt, hash, info, length);
  }

  return {key, salt};
}

/**
 * Naive implementation of RFC5869 in PureJavaScript
 * @param master
 * @param salt
 * @param hash
 * @param info
 * @param length
 * @return {Promise<Uint8Array>}
 */
async function rfc5869(master, salt, hash, info, length){
  const len = params.hashes[hash].hashSize;

  // RFC5869 Step 1 (Extract)
  const prk = await hmac.compute(salt, master, hash);

  // RFC5869 Step 2 (Expand)
  let t = new Uint8Array([]);
  const okm = new Uint8Array(Math.ceil(length / len) * len);
  const uintInfo = new Uint8Array(info);
  for(let i = 0; i < Math.ceil(length / len); i++){
    const concat = new Uint8Array(t.length + uintInfo.length + 1);
    concat.set(t);
    concat.set(uintInfo, t.length);
    concat.set(new Uint8Array([i+1]), t.length + uintInfo.length);
    t = await hmac.compute(prk, concat, hash);
    okm.set(t, len * i);
  }
  return okm.slice(0, length);
}