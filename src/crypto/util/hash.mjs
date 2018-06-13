/**
 * hash.mjs
 */
import * as env from './crypto_env.mjs';

export async function getHash(hashAlgo, msg) {
  const crypto = await env.getEnvWebCrypto();

  let msgHash;
  if (typeof crypto !== 'undefined' && typeof crypto === 'object' && typeof crypto.subtle.digest === 'function') {
    msgHash = await crypto.subtle.digest(hashAlgo, msg); // for modern browsers
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
