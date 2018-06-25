/**
 * aes.mjs
 */

import * as env from './crypto_env.mjs';
import defaultParams from './params.mjs';

export async function encrypt(encAlgo, msg, key, iv){
  const webCrypto = await env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await env.getEnvNodeCrypto(); // node crypto

  let data;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
    && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.encrypt === 'function') {

    let alg;
    if(encAlgo === 'AES-GCM') alg = { name: encAlgo, iv, tagLength: defaultParams.ciphers[encAlgo].tagLength * 8};
    else throw new Error('only AES-GCM is supported at this point');

    const sessionKeyObj = await webCrypto.subtle.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);
    data = await webCrypto.subtle.encrypt(alg, sessionKeyObj, msg);
    data = new Uint8Array(data);

  }
  else if (typeof nodeCrypto !== 'undefined'){
    let alg = defaultParams.ciphers[encAlgo].prefix;
    alg = `${alg}-${(key.byteLength*8).toString()}-`;
    alg = alg + defaultParams.ciphers[encAlgo].suffix;

    let cipher;
    if(encAlgo === 'AES-GCM') cipher = nodeCrypto.createCipheriv(alg, key, iv, {authTagLength: defaultParams.ciphers[encAlgo].tagLength});
    else throw new Error('only AES-GCM is supported at this point');

    const body = new Uint8Array(cipher.update(msg));
    const final = new Uint8Array(cipher.final());

    let tag = new Uint8Array([]);
    if(encAlgo === 'AES-GCM') tag = new Uint8Array(cipher.getAuthTag());

    data = new Uint8Array(body.length + final.length + tag.length);
    data.set(body);
    data.set(final, body.length);
    data.set(tag, body.length + final.length);
  }
  else throw new Error('Unsupported environemnt...');

  return data;
}

export async function decrypt(encAlgo, data, key, iv){
  const webCrypto = await env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await env.getEnvNodeCrypto(); // node crypto

  let msg;
  if (typeof webCrypto !== 'undefined' && typeof webCrypto.subtle === 'object'
    && typeof webCrypto.subtle.importKey === 'function' && typeof webCrypto.subtle.encrypt === 'function') {

    let alg;
    if(encAlgo === 'AES-GCM') alg = { name: encAlgo, iv, tagLength: defaultParams.ciphers[encAlgo].tagLength * 8};
    else throw new Error('only AES-GCM is supported at this point');

    const sessionKeyObj = await webCrypto.subtle.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);
    msg = await webCrypto.subtle.decrypt(alg, sessionKeyObj, data).catch((e) => {throw new Error(`Failed to decrypt. The encrypted data may be tampered.${JSON.stringify(e)}`);});
    msg = new Uint8Array(msg);
  }
  else if (typeof nodeCrypto !== 'undefined'){
    let alg = defaultParams.ciphers[encAlgo].prefix;
    alg = `${alg}-${(key.byteLength*8).toString()}-`;
    alg = alg + defaultParams.ciphers[encAlgo].suffix;

    let decipher;
    let body;
    if(encAlgo === 'AES-GCM'){
      decipher = nodeCrypto.createDecipheriv(alg, key, iv, {authTagLength: defaultParams.ciphers[encAlgo].tagLength});
      body = data.slice(0, data.length - defaultParams.ciphers[encAlgo].tagLength);
      const tag = data.slice(data.length - defaultParams.ciphers[encAlgo].tagLength);
      decipher.setAuthTag(tag);
    }
    else throw new Error('only AES-GCM is supported at this point');


    const decryptedBody = decipher.update(body);
    let final;
    try{ final = decipher.final(); }
    catch (e) {throw new Error(`Failed to decrypt. The encrypted data may be tampered.${JSON.stringify(e)}`);}
    msg = new Uint8Array(final.length + decryptedBody.length);
    msg.set(decryptedBody);
    msg.set(final, decryptedBody.length);

  }


  return msg;
}