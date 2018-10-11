/**
 * hmac.js
 */

import params from './params.js';
import * as util from './util.js';
import jschash from 'js-crypto-hash/dist/index.js';


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

  let native = true;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function') {
    if (typeof window.msCrypto === 'undefined'){
      try {
        // standard web api / modern browsers supporting HMAC
        const keyObj = await webCrypto.importKey('raw', key, { name: 'HMAC', hash: {name: hash} }, false, ['sign', 'verify']);
        const mac = await webCrypto.sign({name: 'HMAC', hash: {name: hash}}, keyObj, data);
        return new Uint8Array(mac);
      } catch (e) { native = false; }
    }
    else {
      try{
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
      } catch (e) { native = false; }
    }
  }
  else if (typeof nodeCrypto !== 'undefined'){ // for node
    try {
      const f = nodeCrypto.createHmac(params.hashes[hash].nodeName, key);
      return new Uint8Array(f.update(data).digest());
    } catch (e) { native = false; }
  }
  else native = false;

  if (!native){
    try {
      return await purejs(key, data, hash);
    } catch (e) {
      throw new Error('UnsupportedEnvironments');
    }
  }
}


// RFC 2104 https://tools.ietf.org/html/rfc2104
async function purejs(key, data, hash = 'SHA-256'){
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

  return await jschash.compute(outer, hash);
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