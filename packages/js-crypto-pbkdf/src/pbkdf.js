/**
 * pbkdf.js
 */

import jseu from 'js-encoding-utils';
import jschash from 'js-crypto-hash';
import jschmac from 'js-crypto-hmac';
import params from './params.js';

/**
 * Password-based key derivation function 2.
 * Detailed specification is given in RFC8018 Section 5.2 {@link https://tools.ietf.org/html/rfc8018#section-5.2}.
 * @param {Uint8Array|String} p - Byte array or string of password. if string is given, it will be converted to Uint8Array.
 * @param {Uint8Array} s - Byte array of salt.
 * @param {Number} c - Iteration count.
 * @param {Number} dkLen - Intended output key length in octet.
 * @param {String} hash - Name of underlying hash function for HMAC like 'SHA-256', used as a pseudorandom function.
 * @return {Promise<Uint8Array>}: Derived key.
 * @throws {Error} - Throws if the intended key length is too long.
 */
export async function pbkdf2(p, s, c, dkLen, hash) {
  assertPbkdf(p, s, c, dkLen, hash);
  if(typeof p === 'string') p = jseu.encoder.stringToArrayBuffer(p);

  const hLen = params.hashes[hash].hashSize;
  if(dkLen > (Math.pow(2, 32) - 1) * hLen) throw new Error('DerivedKeyTooLong');

  const l = Math.ceil(dkLen/hLen);
  const r = dkLen - (l-1)*hLen;

  const funcF = async (i) => {
    const seed = new Uint8Array(s.length + 4);
    seed.set(s);
    seed.set(nwbo(i+1, 4), s.length);
    let u = await jschmac.compute(p, seed, hash);
    let outputF = new Uint8Array(u);
    for(let j = 1; j < c; j++){
      u = await jschmac.compute(p, u, hash);
      outputF = u.map( (elem, idx) => elem ^ outputF[idx]);
    }
    return {index: i, value: outputF};
  };
  const Tis = [];
  const DK = new Uint8Array(dkLen);
  for(let i = 0; i < l; i++) Tis.push(funcF(i));
  const TisResolved = await Promise.all(Tis);
  TisResolved.forEach( (elem) => {
    if (elem.index !== l - 1) DK.set(elem.value, elem.index*hLen);
    else DK.set(elem.value.slice(0, r), elem.index*hLen);
  });

  return DK;
}

// network byte order
const nwbo = (num, len) => {
  const arr = new Uint8Array(len);
  for(let i=0; i<len; i++) arr[i] = 0xFF && (num >> ((len - i - 1)*8));
  return arr;
};


/**
 * Password-based key derivation function 1.
 * Detailed specification is given in RFC8018 Section 5.1 {@link https://tools.ietf.org/html/rfc8018#section-5.1}.
 * @param {Uint8Array|String} p - Byte array or string of password. if string is given, it will be converted to Uint8Array.
 * @param {Uint8Array} s - Byte array of salt.
 * @param {Number} c - Iteration count.
 * @param {Number} dkLen - Intended output key length in octet.
 * @param {String} hash - Name of underlying hash function for HMAC like 'SHA-256'
 * @return {Promise<Uint8Array>}: Derived key.
 * @throws {Error} - Throws if the intended key length is too long.
 */
export async function pbkdf1(p, s, c, dkLen, hash){
  assertPbkdf(p, s, c, dkLen, hash);
  if(typeof p === 'string') p = jseu.encoder.stringToArrayBuffer(p);

  if(dkLen > params.hashes[hash].hashSize) throw new Error('DerivedKeyTooLong');

  let seed = new Uint8Array(p.length + s.length);
  seed.set(p);
  seed.set(s, p.length);
  for(let i = 0; i < c; i++){
    seed = await jschash.compute(seed, hash);
  }
  return seed.slice(0, dkLen);
}

/** Assertion for PBKDF 1 and 2
 * @param {Uint8Array|String} p - Byte array or string of password. if string is given, it will be converted to Uint8Array.
 * @param {Uint8Array} s - Byte array of salt.
 * @param {Number} c - Iteration count.
 * @param {Number} dkLen - Intended output key length in octet.
 * @param {String} hash - Name of underlying hash function for HMAC like 'SHA-256'
 * @return {boolean} - True if given params pass the assertion check. Otherwise, throw (not false).
 * @throws {Error} - Throws if the params doesn't pass the assertion checks for given conditions.
 */
function assertPbkdf(p, s, c, dkLen, hash){
  if (typeof p !== 'string' && !(p instanceof Uint8Array)) throw new Error('PasswordIsNotUint8ArrayNorString');
  if (!(s instanceof Uint8Array)) throw new Error('SaltMustBeUint8Array');
  if (typeof c !== 'number' || c <= 0)throw new Error('InvalidIterationCount');
  if (typeof dkLen !== 'number' || dkLen <= 0) throw new Error('InvalidDerivedKeyLength');
  if (Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHashAlgorithm');
  return true;
}