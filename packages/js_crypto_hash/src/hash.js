/**
 * hash.js
 */

import * as util from './util.js';
import params from './params.js';

/**
 * Compute Hash
 * @param hash
 * @param msg
 * @return {Promise<Uint8Array>}
 */
export async function compute(msg, hash = 'SHA-256') {
  if(Object.keys(params.hashes).indexOf(hash) < 0) throw new Error('UnsupportedHashAlgorithm');
  if(!(msg instanceof Uint8Array)) throw new Error('UnsupportedMessageType');

  const webCrypto = util.getWebCrypto();
  const nodeCrypto = util.getNodeCrypto();
  const msCrypto = util.getMsCrypto();

  let msgHash;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.digest === 'function' && typeof msCrypto === 'undefined') {
    msgHash = await webCrypto.digest(hash, msg); // for modern browsers
  }
  else if (typeof nodeCrypto !== 'undefined' ){ // for node
    const alg = params.hashes[hash].nodeName;
    const hashFunc = nodeCrypto.createHash(alg);
    hashFunc.update(msg);
    msgHash = hashFunc.digest();
  }
  else if (typeof msCrypto !== 'undefined' && typeof msCrypto.digest === 'function') { // for legacy ie 11
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

    msgHash = await msdigest(hash, msg);
  } else {
    throw new Error('UnsupportedEnvironment');
  }
  return new Uint8Array(msgHash);
}
