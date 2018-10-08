/**
 * hmac.js
 */

import params from './params.js';
import * as util from './util.js';


/**
 * Compute keyed hash value
 * @param key
 * @param data
 * @param hash
 * @return {Promise<Uint8Array>}
 */
export async function compute(key, data, hash = 'SHA-256'){
  const webCrypto = util.getWebCryptoAll(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // node crypto
  // const msCrypto = util.getMsCrypto(); // ms crypto

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function') {
    if (typeof window.msCrypto === 'undefined'){
      // standard web api
      try { // modern browsers supporting HMAC
        const keyObj = await webCrypto.importKey('raw', key, {name: 'HMAC', hash: {name: hash}}, false, ['sign', 'verify']);
        const mac = await webCrypto.sign('HMAC', keyObj, data);
        return new Uint8Array(mac);
      }
      catch (e) { // For Edge
        const keyObj = await webCrypto.importKey('raw', key, {name: 'HMAC', hash: {name: hash}}, false, ['sign', 'verify']);
        const mac = await webCrypto.sign({name: 'HMAC', hash: {name: hash}}, keyObj, data);
        return new Uint8Array(mac);
      }
    }
    else {
      // ms crypto
      if (hash === 'SHA-512') throw new Error('HMAC-SHA512UnsupportedInIE');

      // function definitions
      const msImportKey = (type, key, alg, ext, use) => new Promise ( (resolve, reject) => {
        const op = webCrypto.importKey(type, key, alg, ext, use);
        op.oncomplete = (evt) => { resolve(evt.target.result); };
        op.onerror = () => { reject('KeyImportingFailed'); };
      });
      const msHmac = (hash, k, d) => new Promise ( (resolve, reject) => {
        const op = webCrypto.sign({name: 'HMAC', hash: {name: hash}}, k, d);
        op.oncomplete = (evt) => { resolve(new Uint8Array(evt.target.result)); };
        op.onerror = () => { reject('ComputingHMACFailed'); };
      });

      const keyObj = await msImportKey('raw', key, {name: 'HMAC', hash: {name: hash}}, false, ['sign', 'verify']);
      const rawPrk = await msHmac(hash, keyObj, data);
      return new Uint8Array(rawPrk);
    }
  }
  else if (typeof nodeCrypto !== 'undefined'){ // for node
    const f = nodeCrypto.createHmac(params.hashes[hash].nodeName, key);
    return new Uint8Array(f.update(data).digest());
  }
  else {
    throw new Error('UnsupportedEnvironment');
  }
}

/**
 * Verify HMAC
 * @param key
 * @param data
 * @param mac
 * @param hash
 * @return {Promise<boolean>}
 */
export async function verify(key, data, mac, hash = 'SHA-256'){
  if (!(mac instanceof Uint8Array)) throw new Error('InvalidInputMac');

  const newMac = await compute(key, data, hash);
  return (mac.toString() === newMac.toString());
}