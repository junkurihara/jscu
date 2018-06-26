/**
 * hmac.mjs
 */

import * as env from './crypto_env.mjs';
import params from './params.mjs';

export async function getMac(key, data, hashAlgo = 'SHA-256'){
  const webCrypto = await env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await env.getEnvNodeCrypto(); // node crypto

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
    && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.sign === 'function'
  ) {
    try { // modern browsers supporting HKDF
      const keyObj = await webCrypto.subtle.importKey('raw', key, {name: 'HMAC', hash: {name: hashAlgo}}, false, ['sign', 'verify']);
      const mac = await webCrypto.subtle.sign('HMAC', keyObj, data);
      return new Uint8Array(mac);
    }
    catch (e) { // For edge
      const keyObj = await webCrypto.subtle.importKey('raw', key, {name: 'HMAC', hash: {name: hashAlgo}}, false, ['sign', 'verify']);
      const mac = await webCrypto.subtle.sign({name: 'HMAC', hash: {name: hashAlgo}}, keyObj, data);
      return new Uint8Array(mac);
    }
  }
  else if (typeof nodeCrypto !== 'undefined'){ // for node
    const f = nodeCrypto.createHmac(params.hashes[hashAlgo].name, key);
    return new Uint8Array(f.update(data).digest());
  }
  else if (typeof window !== 'undefined' && typeof window.msCrypto === 'object' && typeof window.msCrypto.subtle === 'object' && typeof window.msCrypto.subtle.importKey === 'function' && typeof window.msCrypto.subtle.sign === 'function') { // for legacy ie 11
    // function definitions
    const msImportKey = (type, key, alg, ext, use) => new Promise ( (resolve) => {
      const op = window.msCrypto.subtle.importKey(type, key, alg, ext, use);
      op.oncomplete = (evt) => { resolve(evt.target.result);};
    });
    const msHmac = (hash, k, d) => new Promise ( (resolve) => {
      const op = window.msCrypto.subtle.sign({name: 'HMAC', hash: {name: hash}}, k, d);
      op.oncomplete = (evt) => { resolve(new Uint8Array(evt.target.result));};
    });

    const keyObj = await msImportKey('raw', key, {name: 'HMAC', hash: {name: hashAlgo}}, false, ['sign', 'verify']);
    const rawPrk = await msHmac(hashAlgo, keyObj, data);
    return new Uint8Array(rawPrk);

  }
  else {
    throw new Error('unsupported environment (neither webcrypto, nodecrypto nor mscrypto).');
  }
}
