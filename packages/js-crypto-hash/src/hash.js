/**
 * hash.js
 */

import * as util from './util.js';
import params from './params.js';
import md5 from 'md5';
import jsHash from 'hash.js';

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
  let errMsg;
  let native = true;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.digest === 'function' && typeof msCrypto === 'undefined') {
    msgHash = await webCrypto.digest(hash, msg).catch( (e) => {
      errMsg = e.message;
      native = false;
    }); // for modern browsers
  }
  else if (typeof nodeCrypto !== 'undefined' ){ // for node
    try {
      const alg = params.hashes[hash].nodeName;
      const hashFunc = nodeCrypto.createHash(alg);
      hashFunc.update(msg);
      msgHash = hashFunc.digest();
    } catch (e) {
      errMsg = e.message;
      native = false;
    }
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

    msgHash = await msdigest(hash, msg).catch( (e) => {
      errMsg = e.message;
      native = false;
    });
  } else native = false;

  if (!native){
    try {
      msgHash = purejs(hash, msg);
    }
    catch(e){
      errMsg = `${errMsg} => ${e.message}`;
      throw new Error(`UnsupportedEnvironment: ${errMsg}`);
    }
  }

  return new Uint8Array(msgHash);
}

function purejs(hash, msg){
  let h;
  if(hash === 'MD5'){
    h = md5(Array.from(msg), {asBytes: true});
  }
  else if (Object.keys(params.hashes).indexOf(hash) >= 0){
    h = jsHash[params.hashes[hash].nodeName]().update(msg).digest();
  }
  else throw new Error('UnsupportedHashInPureJs');

  return new Uint8Array(h);
}