/**
 * hash.js
 */

import * as util from './util.js';
import params from './params.js';
import md5 from 'md5';
import jsHash from 'hash.js';

/**
 * Compute Hash value.
 * @param {Uint8Array} msg - Byte array of message to be hashed.
 * @param {String} [hash = 'SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @return {Promise<Uint8Array>} - Hash value
 * @throws {Error} - Throws if UnsupportedHashAlgorithm, UnsupportedMessageType,
 *  or UnsupportedEnvironment, i.e., a case where even pure js implementation won't work.
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
      msgHash = nodedigest(hash, msg, nodeCrypto);
    } catch (e) {
      errMsg = e.message;
      native = false;
    }
  }
  else if (typeof msCrypto !== 'undefined' && typeof msCrypto.digest === 'function') { // for legacy ie 11
    msgHash = await msdigest(hash, msg, msCrypto).catch( (e) => {
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

/**
 * Compute hash using MsCrypto implementation
 * @param {String} hash - Name of hash algorithm like SHA-256
 * @param {Uint8Array} msg - Byte array of message to be hashed.
 * @param {Object} msCrypto - msCrypto object.
 * @return {Promise<Uint8Array>} - Hash value.
 * @throws {Error} - Throws if hashing failed.
 */
const msdigest = (hash, msg, msCrypto) => new Promise((resolve, reject) => {
  const op = msCrypto.digest(hash, msg);
  op.oncomplete = (evt) => {
    resolve(evt.target.result);
  };
  op.onerror = (e) => {
    reject(e);
  };
});

/**
 * Compute hash using Node.js implementation
 * @param {String} hash - Name of hash algorithm like SHA-256
 * @param {Uint8Array} msg - Byte array of message to be hashed.
 * @param {Object} nodeCrypto - Node.js crypto object.
 * @return {Uint8Array} - Hash value.
 */
const nodedigest = (hash, msg, nodeCrypto) => {
  const alg = params.hashes[hash].nodeName;
  const hashFunc = nodeCrypto.createHash(alg);
  hashFunc.update(msg);
  return hashFunc.digest();
};

/**
 * Compute hash using pure js implementations
 * @param {String} hash - Name of hash algorithm like SHA-256
 * @param {Uint8Array} msg - Byte array of message to be hashed.
 * @return {Uint8Array} - Hash value.
 */
const purejs = (hash, msg) => {
  let h;
  if(hash === 'MD5'){
    h = md5(Array.from(msg), {asBytes: true});
  }
  else {
    h = jsHash[params.hashes[hash].nodeName]().update(msg).digest();
  }

  return new Uint8Array(h);
};