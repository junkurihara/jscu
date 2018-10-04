/**
 * webapi.js
 */

export async function generateKey(modulusLength = 2048, publicExponent = new Uint8Array([0x01, 0x00, 0x01]), webCrypto){
  // generate ecdsa key
  // hash is used for signing and verification. never be used for key generation

  const keys = await webCrypto.generateKey(
    { name: 'RSA-OAEP', modulusLength, publicExponent, hash: { name: 'SHA-256' } },
    true,
    ['encrypt', 'decrypt']
  );

  // export keys in jwk format
  const publicKey = await webCrypto.exportKey('jwk', keys.publicKey);
  const privateKey = await webCrypto.exportKey('jwk', keys.privateKey);

  // delete optional entries to export as general ecdsa/ecdh key
  ['key_ops', 'alg', 'ext'].forEach((elem) => {
    delete publicKey[elem];
    delete privateKey[elem];
  });

  return {publicKey, privateKey};
}

export async function sign(msg, privateJwk, hash = 'SHA-256', algorithm = {name: 'RSA-PSS', saltLength: 192}, webCrypto) {
  const algo = {name: algorithm.name, hash: {name: hash}, saltLength: algorithm.saltLength};
  const key = await webCrypto.importKey('jwk', privateJwk, algo, false, ['sign']);

  const signature = await webCrypto.sign(algo, key, msg);
  return new Uint8Array(signature);
}

export async function verify(msg, signature, publicJwk, hash = 'SHA-256', algorithm = {name: 'RSA-PSS', saltLength: 192}, webCrypto){
  const algo = {name: algorithm.name, hash: {name: hash}, saltLength: algorithm.saltLength};
  const key = await webCrypto.importKey('jwk', publicJwk, algo, false, ['verify']);
  return await webCrypto.verify(algo, key, signature, msg);
}

export async function encrypt(msg, publicJwk, hash = 'SHA-256', label = new Uint8Array([]), webCrypto){
  const algo = {name: 'RSA-OAEP', hash: {name: hash}, label};
  const key = await webCrypto.importKey('jwk', publicJwk, algo, false, ['encrypt']);
  const encrypted = await webCrypto.encrypt(algo, key, msg);
  return new Uint8Array(encrypted);
}

export async function decrypt(msg, privateJwk, hash = 'SHA-256', label = new Uint8Array([]), webCrypto){
  const algo = {name: 'RSA-OAEP', hash: {name: hash}, label};
  const key = await webCrypto.importKey('jwk', privateJwk, algo, false, ['decrypt']);
  const decrypted = await webCrypto.decrypt(algo, key, msg);
  return new Uint8Array(decrypted);
}