/**
 * hash.js
 */

import * as util from 'js-crypto-env';
import params, {HashTypes, Sha3LenType} from './params';
import md5 from 'md5';
import {SHA3} from 'sha3';
import * as jsHash from 'hash.js';


/**
 * Compute Hash value.
 * @param {Uint8Array} msg - Byte array of message to be hashed.
 * @param {HashTypes} [hash = 'SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @return {Promise<Uint8Array>} - Hash value
 * @throws {Error} - Throws if UnsupportedHashAlgorithm, UnsupportedMessageType,
 *  or UnsupportedEnvironment, i.e., a case where even pure js implementation won't work.
 */
export const compute = async (msg: Uint8Array, hash: HashTypes = 'SHA-256') : Promise<Uint8Array> => {
  const env = util.getCrypto();

  let msgHash;
  let errMsg;
  let native = true;

  try{
    if (env.name === 'webCrypto' && typeof env.crypto.digest === 'function') { // for modern browsers
      msgHash = await env.crypto.digest(hash, msg);
    }
    else if (env.name === 'nodeCrypto') { // for node
      msgHash = nodedigest(hash, msg, env.crypto);
    }
    else native = false;
  } catch(e: unknown) {
    if (e instanceof Error) {
      errMsg = e.message;
    }
    native = false;
  }

  if (!native){
    try { msgHash = await purejs(hash, msg); }
    catch(e: unknown){
      if (e instanceof Error) {
        errMsg = `${(typeof errMsg === 'undefined') ? '' : errMsg} => ${e.message}`;
        throw new Error(`UnsupportedEnvironment: ${errMsg}`);
      }
      else {
        throw new Error('UnsupportedEnvironment');
      }

    }
  }

  return new Uint8Array(msgHash);
};


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
const purejs = async (hash: HashTypes, msg: Uint8Array) : Promise<Uint8Array> => {
  let h;
  if(hash === 'MD5'){
    h = md5(Array.from(msg), {asBytes: true});
  }
  else if (['SHA3-512', 'SHA3-384', 'SHA3-256', 'SHA3-224'].indexOf(hash) >= 0){
    // sha3
    const sha3Len: number = params.hashes[hash].hashSize * 8;
    const sha3obj = new SHA3(<Sha3LenType>sha3Len);
    const {Buffer} = await import('buffer');
    sha3obj.update(Buffer.from(msg));
    h = sha3obj.digest('binary');
  }
  else {
    // @ts-ignore
    h = jsHash[params.hashes[hash].nodeName]().update(msg).digest();
  }

  return new Uint8Array(h);
};
