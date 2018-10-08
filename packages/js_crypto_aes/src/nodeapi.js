/**
 * nodeapi.js
 */

import params from './params.js';

export function encrypt(msg, key, {name = 'AES-GCM', iv, additionalData, tagLength}, nodeCrypto){
  let alg = params.ciphers[name].nodePrefix;
  alg = `${alg}-${(key.byteLength*8).toString()}-`;
  alg = alg + params.ciphers[name].nodeSuffix;

  let cipher;
  if(name === 'AES-GCM'){
    cipher = nodeCrypto.createCipheriv(alg, key, iv, {authTagLength: tagLength});
    cipher.setAAD(additionalData);
  }

  const body = new Uint8Array(cipher.update(msg));
  const final = new Uint8Array(cipher.final());

  let tag = new Uint8Array([]);
  if(name === 'AES-GCM') tag = new Uint8Array(cipher.getAuthTag());

  const data = new Uint8Array(body.length + final.length + tag.length);
  data.set(body);
  data.set(final, body.length);
  data.set(tag, body.length + final.length);

  return data;
}


export function decrypt(data, key, {name='AES-GCM', iv, additionalData, tagLength}, nodeCrypto) {
  let alg = params.ciphers[name].nodePrefix;
  alg = `${alg}-${(key.byteLength*8).toString()}-`;
  alg = alg + params.ciphers[name].nodeSuffix;

  let decipher;
  let body;
  if(name === 'AES-GCM'){
    decipher = nodeCrypto.createDecipheriv(alg, key, iv, {authTagLength: tagLength});
    decipher.setAAD(additionalData);
    body = data.slice(0, data.length - tagLength);
    const tag = data.slice(data.length - tagLength);
    decipher.setAuthTag(tag);
  }

  const decryptedBody = decipher.update(body);
  let final;
  try{
    final = decipher.final();
  } catch (e) {
    throw new Error('DecryptionFailure');
  }
  const msg = new Uint8Array(final.length + decryptedBody.length);
  msg.set(decryptedBody);
  msg.set(final, decryptedBody.length);

  return msg;
}