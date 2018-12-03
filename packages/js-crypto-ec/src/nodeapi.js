/**
 * nodeapi.js
 */

import params from './params.js';
import * as asn1enc from './asn1enc.js';
import {Key} from 'js-crypto-key-utils/dist/index.js';
import jseu from 'js-encoding-utils';

export async function generateKey(namedCurve, nodeCrypto){
  const ecdh = nodeCrypto.ECDH(params.namedCurves[namedCurve].nodeName);
  ecdh.generateKeys();
  const publicOct = new Uint8Array(ecdh.getPublicKey());
  const privateOct = new Uint8Array(ecdh.getPrivateKey());

  const publicKey = new Key('oct', publicOct, {namedCurve});
  if (publicKey.isPrivate) throw new Error('NotPublicKeyForECCKeyGenNode');
  const publicJwk = await publicKey.export('jwk', {outputPublic: true});
  const privateKey = new Key('oct', privateOct, {namedCurve});
  if (!privateKey.isPrivate) throw new Error('NotPrivateKeyForECCKeyGenNode');
  const privateJwk = await privateKey.export('jwk');

  return {publicKey: publicJwk, privateKey: privateJwk};
}

export async function sign(msg, privateJwk, hash, signatureFormat, nodeCrypto){
  const privateKey = new Key('jwk', privateJwk);
  if (!privateKey.isPrivate) throw new Error('NotPrivateKeyForECCSignNode');
  const privatePem = await privateKey.export('pem');

  const sign = nodeCrypto.createSign(params.hashes[hash].nodeName);
  sign.update(msg);
  const asn1sig = sign.sign(privatePem);
  return (signatureFormat === 'raw') ? asn1enc.decodeAsn1Signature(asn1sig, privateJwk.crv) : asn1sig;
}

export async function verify(msg, signature, publicJwk, hash, signatureFormat, nodeCrypto){
  const publicKey = new Key('jwk', publicJwk);
  if (!publicKey.isPrivate) throw new Error('NotPrivateKeyForECCVerifyNode');
  const publicPem = await publicKey.export('pem', {outputPublic: true, compact: false});

  const verify = nodeCrypto.createVerify(params.hashes[hash].nodeName);
  verify.update(msg);
  const asn1sig = (signatureFormat === 'raw') ? asn1enc.encodeAsn1Signature(signature, publicJwk.crv) : signature;
  return verify.verify(publicPem, asn1sig);
}

export function deriveSecret(publicJwk, privateJwk, nodeCrypto){
  const curve = params.namedCurves[privateJwk.crv].nodeName;
  const payloadSize = params.namedCurves[privateJwk.crv].payloadSize;

  const ecdh = nodeCrypto.createECDH(curve);

  const privKeyBuf = jseu.encoder.decodeBase64Url(privateJwk.d);
  const pubKeyBuf = new Uint8Array( payloadSize * 2 + 1 );
  pubKeyBuf[0] = 0xFF & 0x04;
  pubKeyBuf.set(jseu.encoder.decodeBase64Url(publicJwk.x), 1);
  pubKeyBuf.set(jseu.encoder.decodeBase64Url(publicJwk.y), payloadSize + 1);
  ecdh.setPrivateKey(privKeyBuf);
  return new Uint8Array(ecdh.computeSecret(pubKeyBuf));
}