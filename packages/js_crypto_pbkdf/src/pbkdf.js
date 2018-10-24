/**
 * pbkdf.js
 */

import jseu from 'js-encoding-utils';
import jschash from 'js-crypto-hash/dist/index.js';
import jschmac from 'js-crypto-hmac/dist/index.js';
import params from './params.js';

/**
 * Password-based key derivation function 2
 * @param p {Uint8Array|String}: password buffer. if string, it will be converted to Uint8Array
 * @param s {Uint8Array}: salt
 * @param c {Number}: iteration count
 * @param dkLen {Number}: intended output key length in octet
 * @param hash {String}: name of underlying hash function for HMAC like 'SHA-256', used as a pseudorandom function
 * @return {Promise<Uint8Array>}: the derived key
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
 * Password-based key derivation function 1
 * @param p {Uint8Array|String}: password buffer. if string, it will be converted to Uint8Array
 * @param s {Uint8Array}: salt
 * @param c {Number}: iteration count
 * @param dkLen {Number}: intended output key length
 * @param hash {String}: name of underlying hash function like 'SHA-256'
 * @return {Promise<Uint8Array>}: the derived key
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

// assertion
function assertPbkdf(p, s, c, dkLen, hash){
  if (typeof p !== 'string' && !(p instanceof Uint8Array)) throw new Error('PasswordIsNotUint8ArrayNorString');
  if (!(s instanceof Uint8Array)) throw new Error('SaltMustBeUint8Array');
  if (typeof c !== 'number' || c <= 0)throw new Error('InvalidIterationCount');
  if (typeof dkLen !== 'number' || dkLen <= 0) throw new Error('InvalidDerivedKeyLength');
  if (Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHashAlgorithm');
  return true;
}