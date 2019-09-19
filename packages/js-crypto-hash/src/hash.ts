/**
 * hash.js
 */

import * as util from 'js-crypto-env';
import params, {HashTypes, Sha3LenType} from './params';
import md5 from 'md5';
import {SHA3} from 'sha3';
import jsHash from 'hash.js';


/**
 * Compute Hash value.
 * @param {Uint8Array} msg - Byte array of message to be hashed.
 * @param {HashTypes} [hash = 'SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @return {Promise<Uint8Array>} - Hash value
 * @throws {Error} - Throws if UnsupportedHashAlgorithm, UnsupportedMessageType,
 *  or UnsupportedEnvironment, i.e., a case where even pure js implementation won't work.
 */
export const compute = async (msg: Uint8Array, hash: HashTypes = 'SHA-256') : Promise<Uint8Array> => {
  const webCrypto = util.getWebCrypto();
  const nodeCrypto = util.getNodeCrypto();
  const msCrypto = util.getMsCrypto();

  let msgHash;
  let errMsg;
  let native = true;

  try{
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.digest === 'function' && typeof msCrypto === 'undefined') { // for modern browsers
      msgHash = await webCrypto.digest(hash, msg);
    }
    else if (typeof nodeCrypto !== 'undefined' ) { // for node
      msgHash = nodedigest(hash, msg, nodeCrypto);
    }
    else if (typeof msCrypto !== 'undefined' && typeof msCrypto.digest === 'function') { // for legacy ie 11
      msgHash = await msdigest(hash, msg, msCrypto);
    }
    else native = false;
  } catch(e) {
    errMsg = e.message;
    native = false;
  }

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
};

/**
 * Compute hash using MsCrypto implementation
 * @param {HashTypes} hash - Name of hash algorithm like SHA-256
 * @param {Uint8Array} msg - Byte array of message to be hashed.
 * @param {Object} msCrypto - msCrypto object.
 * @return {Promise<Uint8Array>} - Hash value.
 * @throws {Error} - Throws if hashing failed.
 */
const msdigest = (hash: HashTypes, msg: Uint8Array, msCrypto: any) : Promise<Uint8Array> => new Promise((resolve, reject) => {
  const op = msCrypto.digest(hash, msg);
  op.oncomplete = (evt: any) => {
    resolve(evt.target.result);
  };
  op.onerror = (e: Error) => {
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
const nodedigest = (hash: HashTypes, msg: Uint8Array, nodeCrypto: any) : Uint8Array => {
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
const purejs = (hash: HashTypes, msg: Uint8Array) : Uint8Array => {
  let h;
  if(hash === 'MD5'){
    h = md5(Array.from(msg), {asBytes: true});
  }
  else if (['SHA3-512', 'SHA3-384', 'SHA3-256', 'SHA3-224'].indexOf(hash) >= 0){
    // sha3
    const sha3Len: number = params.hashes[hash].hashSize * 8;
    const sha3obj = new SHA3(<Sha3LenType>sha3Len);
    const Buffer = require('buffer/').Buffer;
    sha3obj.update(Buffer.from(msg));
    h = sha3obj.digest('binary');
  }
  else {
    // @ts-ignore
    h = jsHash[params.hashes[hash].nodeName]().update(msg).digest();
  }

  return new Uint8Array(h);
};
