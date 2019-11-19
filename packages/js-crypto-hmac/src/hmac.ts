/**
 * hmac.js
 */

import params, {HashTypes} from './params';
import * as util from 'js-crypto-env';
import jschash from 'js-crypto-hash';


/**
 * Compute keyed hash value
 * @param {Uint8Array} key - ByteArray of symmetric key.
 * @param {Uint8Array} data - Byte array of message to be hashed.
 * @param {HashTypes} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @return {Promise<Uint8Array>} - Keyed-hash value.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., even neither WebCrypto, NodeCrypto nor PureJS is available.
 */
export const compute = async (key: Uint8Array, data: Uint8Array, hash: HashTypes = 'SHA-256'): Promise<Uint8Array> => {
  const webCrypto = util.getWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // node crypto
  const msCrypto = util.getMsCrypto(); // damn ms crypto

  let msgKeyedHash;
  let errMsg;
  let native = true;

  try {
    if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function') {
      const keyObj = await webCrypto.importKey('raw', key, {
        name: 'HMAC',
        hash: {name: hash}
      }, false, ['sign', 'verify']);
      msgKeyedHash = await webCrypto.sign({name: 'HMAC', hash: {name: hash}}, keyObj, data);
    } else if (typeof msCrypto !== 'undefined') {
      const keyObj = await msImportKey('raw', key, {
        name: 'HMAC',
        hash: {name: hash}
      }, false, ['sign', 'verify'], msCrypto);
      msgKeyedHash = await msHmac(hash, keyObj, data, msCrypto);
    } else if (typeof nodeCrypto !== 'undefined') { // for node
      const f = nodeCrypto.createHmac(params.hashes[hash].nodeName, key);
      msgKeyedHash = f.update(data).digest();
    } else native = false;
  } catch (e) {
    errMsg = e.message;
    native = false;
  }

  if (!native){
    try {
      msgKeyedHash = await purejs(key, data, hash);
    } catch (e) {
      errMsg = `${errMsg} => ${e.message}`;
      throw new Error(`UnsupportedEnvironments: ${errMsg}`);
    }
  }

  return new Uint8Array(msgKeyedHash);
};


/**
 * PureJS implementation of HMAC algorithm specified in RFC 2104 {@link https://tools.ietf.org/html/rfc2104}.
 * @param {Uint8Array} key - ByteArray of symmetric key.
 * @param {Uint8Array} data - Byte array of message to be hashed.
 * @param {HashTypes} hash - Name of hash algorithm like 'SHA-256'.
 * @return {Promise<Uint8Array>} - Keyed-hash value.
 */
const purejs = async (key: Uint8Array, data: Uint8Array, hash: HashTypes): Promise<Uint8Array> => {
  const B = params.hashes[hash].blockSize;
  const L = params.hashes[hash].hashSize;

  if(key.length > B) key = await jschash.compute(key, hash);

  const K = new Uint8Array(B); // first the array is initialized with 0x00
  K.set(key);

  const KxorIpad = K.map( (k) => 0xFF & (0x36 ^ k));
  const KxorOpad = K.map( (k) => 0xFF & (0x5c ^ k));

  const inner = new Uint8Array(B + data.length);
  inner.set(KxorIpad);
  inner.set(data, B);
  const hashedInner = await jschash.compute(inner, hash);

  const outer = new Uint8Array(B + L);
  outer.set(KxorOpad);
  outer.set(hashedInner, B);

  return jschash.compute(outer, hash);
};

/**
 * Verify keyed-hash value using the key
 * @param {Uint8Array} key - ByteArray of symmetric key.
 * @param {Uint8Array} data - Byte array of message to be hashed.
 * @param {Uint8Array} mac - Given keyed-hash value.
 * @param {HashTypes} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'.
 * @return {Promise<boolean>} - Result of verification.
 * @throws {Error} - Throws if InvalidInputMac
 */
export const verify = async (key: Uint8Array, data: Uint8Array, mac: Uint8Array, hash: HashTypes = 'SHA-256') => {
  const newMac = await compute(key, data, hash);
  return (mac.toString() === newMac.toString());
};


// function definitions for damn ms ie
const msImportKey = (type: any, key: any, alg: any, ext: any, use: any, webCrypto: any) => new Promise ( (resolve, reject) => {
  const op = webCrypto.importKey(type, key, alg, ext, use);
  op.oncomplete = (evt: any) => { resolve(evt.target.result); };
  op.onerror = () => { reject('KeyImportingFailed'); };
});
const msHmac = (hash: HashTypes, k: any, d: Uint8Array, webCrypto: any) => new Promise ( (resolve, reject) => {
  const op = webCrypto.sign({name: 'HMAC', hash: {name: hash}}, k, d);
  op.oncomplete = (evt: any) => { resolve(new Uint8Array(evt.target.result)); };
  op.onerror = () => { reject('ComputingHMACFailed'); };
});
