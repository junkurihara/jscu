/**
 * webapi.js
 */

import jseu from 'js-encoding-utils';
import * as asn1enc from './asn1enc.js';

export async function generateKey(namedCurve, webCrypto){
  // generate ecdsa key
  // hash is used for signing and verification. never be used for key generation
  const keys = await webCrypto.generateKey({ name: 'ECDSA', namedCurve, hash: {name: 'SHA-256'} }, true, ['sign', 'verify']);

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

export async function sign(msg, privateJwk, hash, signatureFormat, webCrypto){
  const algo = {name: 'ECDSA', namedCurve: privateJwk.crv, hash: {name: hash}};
  const key = await webCrypto.importKey('jwk', privateJwk, algo, false, ['sign']);
  const signature = await webCrypto.sign(algo, key, msg);
  return (signatureFormat === 'raw')
    ? new Uint8Array(signature)
    : asn1enc.encodeAsn1Signature(new Uint8Array(signature), privateJwk.crv);
}

export async function verify(msg, signature, publicJwk, hash, signatureFormat, webCrypto){
  const algo = {name: 'ECDSA', namedCurve: publicJwk.crv, hash: {name: hash}};
  const key = await webCrypto.importKey('jwk', publicJwk, algo, false, ['verify']);
  const rawSignature = (signatureFormat === 'raw')
    ? signature
    : asn1enc.decodeAsn1Signature(signature, publicJwk.crv);
  return await webCrypto.verify(algo, key, rawSignature, msg);
}

export async function deriveSecret(publicJwk, privateJwk, webCrypto){
  const algo = {name: 'ECDH', namedCurve: privateJwk.crv};
  const privateKey = await webCrypto.importKey('jwk', privateJwk, algo, false, ['deriveBits']);
  const publicKey = await webCrypto.importKey('jwk', publicJwk, algo, false, []);
  const bitLen = () => { const arr = jseu.encoder.decodeBase64Url(privateJwk.x); return 8*arr.length; };
  return new Uint8Array(
    await webCrypto.deriveBits(Object.assign(algo, {public: publicKey}), privateKey, bitLen())
  );
}