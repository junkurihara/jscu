/**
 * hkdf.mjs
 * https://tools.ietf.org/html/rfc5869
 */

import * as env from './crypto_env.mjs';
import * as random from './random.mjs';
import params from './params.mjs';

export async function getKeySalt(master, hashAlgo = 'SHA-256', length = 32, info = '', salt = null){
  if(!info) info = '';
  const webCrypto = await env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await env.getEnvNodeCrypto(); // node crypto

  let key;
  if(!salt) salt = await random.getRandomBytes(length);

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
    && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.deriveBits === 'function'
  ) {
    const masterObj = await webCrypto.subtle.importKey('raw', master, { name: 'HKDF' }, false, ['deriveKey', 'deriveBits']);
    key = await webCrypto.subtle.deriveBits({
      name: 'HKDF',
      salt,
      info: new Uint8Array(info),
      hash: hashAlgo
    }, masterObj, length*8);
    key = new Uint8Array(key);
  }
  else if (typeof nodeCrypto !== 'undefined'){
    const hmac = (algo, key, data) => { const f = nodeCrypto.createHmac(algo, key); return new Uint8Array(f.update(data).digest()); };
    const len = params.hashes[hashAlgo].hashSize;

    // RFC5869 Step 1 (Extract)
    const prk = hmac(params.hashes[hashAlgo].name, salt, master);

    // RFC5869 Step 2 (Expand)
    let t = new Uint8Array([]);
    const okm = new Uint8Array(Math.ceil(length / len) * len);
    const uintInfo = new Uint8Array(info);
    for(let i = 0; i < Math.ceil(length / len); i++){
      const concat = new Uint8Array(t.length + uintInfo.length + 1);
      concat.set(t);
      concat.set(uintInfo, t.length);
      concat.set(new Uint8Array([i+1]), t.length + uintInfo.length);
      t = hmac(params.hashes[hashAlgo].name, prk, concat);
      okm.set(t, len * i);
    }
    key = okm.slice(0, length);
  }
  else throw new Error('unsupported environment. IE/Edge is currently unsupported due to lack of crypto features...'); // TODO

  return {key, salt};
}
