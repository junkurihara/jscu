/**
 * hash.mjs
 */
import * as env from './crypto_env.mjs';
import params from './params.mjs';

export async function getHash(hashAlgo, msg) {
  const webCrypto = await env.getEnvWebCrypto();
  const nodeCrypto = await env.getEnvNodeCrypto();

  let msgHash;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto === 'object' && typeof webCrypto.subtle.digest === 'function') {
    msgHash = await webCrypto.subtle.digest(hashAlgo, msg); // for modern browsers
  }
  else if (typeof nodeCrypto !== 'undefined' ){ // for node
    const alg = params.hashes[hashAlgo];
    const hashFunc = nodeCrypto.createHash(alg);
    hashFunc.update(msg);
    msgHash = hashFunc.digest();
  }
  else if (typeof window !== 'undefined' && typeof window.msCrypto === 'object' && typeof window.msCrypto.subtle === 'object' && typeof window.msCrypto.subtle.digest === 'function') { // for legacy ie 11
    // WTF IE!!!
    const msdigest = (alg, m) => new Promise((resolve, reject) => {
      const op = window.msCrypto.subtle.digest(alg, m);
      op.oncomplete = (evt) => {
        resolve(evt.target.result);
      };
      op.onerror = (e) => {
        reject(e);
      };
    });

    msgHash = await msdigest(hashAlgo, msg);

  } else {
    throw new Error('web/ms crypto api is not supported and hash function is unavailable!');
  }
  return new Uint8Array(msgHash); // string or array can be fed to elliptic lib.
}
