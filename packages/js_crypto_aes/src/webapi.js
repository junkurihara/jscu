/**
 * webapi.js
 */

export async function encrypt(msg, key, {name = 'AES-GCM', iv, tagLength}, webCrypto) {
  let alg;
  if(name === 'AES-GCM') alg = { name, iv, tagLength: tagLength * 8};

  const sessionKeyObj = await webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);
  const data = await webCrypto.encrypt(alg, sessionKeyObj, msg);
  return new Uint8Array(data);
}

export async function decrypt(data, key, {name='AES-GCM', iv, tagLength}, webCrypto) {
  let alg;
  if(name === 'AES-GCM') alg = { name, iv, tagLength: tagLength * 8};

  const sessionKeyObj = await webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);
  const msg = await webCrypto.decrypt(alg, sessionKeyObj, data).catch(() => {throw new Error('DecryptionFailure');});
  return new Uint8Array(msg);
}