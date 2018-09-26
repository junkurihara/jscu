/**
 * hkdf.mjs
 * https://tools.ietf.org/html/rfc5869
 */

import * as env from './crypto_env.mjs';
import params from './params.mjs';

import {random, hmac} from './index.mjs';
// import random from 'js-crypto-random';
// import hmac  from 'js-crypto-hmac';

export async function getKeySalt(master, hashAlgo = 'SHA-256', length = 32, info = '', salt = null){
  if(!info) info = '';
  const webCrypto = await env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await env.getEnvNodeCrypto(); // node crypto

  let key;
  if(!salt) salt = await random.getRandomBytes(length);

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
    && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.deriveBits === 'function'
  ) {
    try { // modern browsers supporting HKDF
      const masterObj = await webCrypto.subtle.importKey('raw', master, {name: 'HKDF'}, false, ['deriveKey', 'deriveBits']);
      key = await webCrypto.subtle.deriveBits({
        name: 'HKDF',
        salt,
        info: new Uint8Array(info),
        hash: hashAlgo
      }, masterObj, length * 8);
      key = new Uint8Array(key);
    }
    catch (e) { // TODO for edge
      key = await rfc5869(master, salt, hashAlgo, info, length);
    }
  }
  else if (typeof nodeCrypto !== 'undefined'){ // for node.js
    key = await rfc5869(master, salt, hashAlgo, info, length);
  }
  else if (typeof window !== 'undefined' && typeof window.msCrypto === 'object' && typeof window.msCrypto.subtle === 'object' && typeof window.msCrypto.subtle.importKey === 'function') { // for legacy ie 11
    key = await rfc5869(master, salt, hashAlgo, info, length);
  }
  else {
    throw new Error('unsupported environment (neither webcrypto, nodecrypto nor mscrypto).');
  }

  return {key, salt};
}

async function rfc5869(master, salt, hashAlgo, info, length){
  const len = params.hashes[hashAlgo].hashSize;

  // RFC5869 Step 1 (Extract)
  const prk = await hmac.compute(salt, master, hashAlgo);

  // RFC5869 Step 2 (Expand)
  let t = new Uint8Array([]);
  const okm = new Uint8Array(Math.ceil(length / len) * len);
  const uintInfo = new Uint8Array(info);
  for(let i = 0; i < Math.ceil(length / len); i++){
    const concat = new Uint8Array(t.length + uintInfo.length + 1);
    concat.set(t);
    concat.set(uintInfo, t.length);
    concat.set(new Uint8Array([i+1]), t.length + uintInfo.length);
    t = await hmac.compute(prk, concat, hashAlgo);
    okm.set(t, len * i);
  }
  return okm.slice(0, length);
}