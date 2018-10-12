/**
 * webapi.js
 */

export async function encrypt(msg, key, {name = 'AES-GCM', iv, additionalData, tagLength}, webCrypto) {
  let alg;

  switch(name){
  case 'AES-GCM': {
    alg = Object.assign({name, iv, tagLength: tagLength * 8}, (additionalData.length > 0) ? {additionalData} : {});
    break;
  }
  case 'AES-CBC': alg = {name, iv};
    break;
  default: throw new Error('UnsupportedCipher');
  }

  if (typeof window.msCrypto === 'undefined') {
    // modern browsers
    const sessionKeyObj = await webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);
    const data = await webCrypto.encrypt(alg, sessionKeyObj, msg);
    return new Uint8Array(data);
  }
  else {
    const sessionKeyObj = await msImportKey('raw', key, alg, false, ['encrypt', 'decrypt'], webCrypto);
    const encryptedObj = await msEncrypt(alg, sessionKeyObj, msg, webCrypto);

    if (name === 'AES-GCM') {
      const data = new Uint8Array(encryptedObj.ciphertext.byteLength + encryptedObj.tag.byteLength);
      data.set(new Uint8Array(encryptedObj.ciphertext));
      data.set(new Uint8Array(encryptedObj.tag), encryptedObj.ciphertext.byteLength);
      return data;
    } else return new Uint8Array(encryptedObj);
  }
}

export async function decrypt(data, key, {name='AES-GCM', iv, additionalData, tagLength}, webCrypto) {
  let alg;
  switch(name){
  case 'AES-GCM': {
    alg = Object.assign({name, iv, tagLength: tagLength * 8}, (additionalData.length > 0) ? {additionalData} : {});
    break;
  }
  case 'AES-CBC': alg = {name, iv};
    break;
  default: throw new Error('UnsupportedCipher');
  }

  if (!window.msCrypto) {
    // modern browsers
    const sessionKeyObj = await webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);
    const msg = await webCrypto.decrypt(alg, sessionKeyObj, data).catch(() => {
      throw new Error('DecryptionFailure');
    });
    return new Uint8Array(msg);
  }
  else {
    const sessionKeyObj = await msImportKey('raw', key, alg, false, ['encrypt', 'decrypt'], webCrypto);
    if (name === 'AES-GCM') {
      const ciphertext = data.slice(0, data.length - tagLength);
      const tag = data.slice(data.length - tagLength, data.length);
      const msg = await msDecrypt(Object.assign(alg, {tag}), sessionKeyObj, ciphertext, webCrypto).catch(() => {
        throw new Error('DecryptionFailure');
      });
      return new Uint8Array(msg);
    } else{
      const msg = await msDecrypt(alg, sessionKeyObj, data, webCrypto).catch(() => {
        throw new Error('DecryptionFailure');
      });
      return new Uint8Array(msg);
    }
  }
}


// function definitions for IE
const msImportKey = (type, key, alg, ext, use, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.importKey(type, key, alg, ext, use);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('KeyImportingFailed'); };
});
const msEncrypt = (alg, key, msg, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.encrypt(alg, key, msg);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('EncryptionFailure'); };
});
const msDecrypt = (alg, key, data, webCrypto) => new Promise ( (resolve, reject) => {
  const op = webCrypto.decrypt(alg, key, data);
  op.oncomplete = (evt) => { resolve(evt.target.result); };
  op.onerror = () => { reject('DecryptionFailure'); };
});