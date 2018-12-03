/**
 * purejs.js
 */

import params from './params.js';
import * as asn1enc from './asn1enc.js';
import random from 'js-crypto-random/dist/index.js';
import jschash from 'js-crypto-hash/dist/index.js';
import {Key} from 'js-crypto-key-utils/dist/index.js';
import jseu from 'js-encoding-utils';
import elliptic from 'elliptic';
const Ec = elliptic.ec;

export async function generateKey(namedCurve){

  const curve = params.namedCurves[namedCurve].indutnyName;
  const ec = new Ec(curve);
  const ecKey = ec.genKeyPair({
    entropy: jseu.encoder.arrayBufferToString(await random.getRandomBytes(32))
  });

  const len = params.namedCurves[namedCurve].payloadSize;
  const publicOct = new Uint8Array(ecKey.getPublic('array'));
  const privateOct = new Uint8Array(ecKey.getPrivate().toArray('be', len));

  const publicKey = new Key('oct', publicOct, {namedCurve});
  if (publicKey.isPrivate) throw new Error('NotPublicKeyForECCKeyGenPureJS');
  const publicJwk = await publicKey.export('jwk', {outputPublic: true});

  const privateKey = new Key('oct', privateOct, {namedCurve});
  if (!privateKey.isPrivate) throw new Error('NotPrivateKeyForECCKeyGenPureJS');
  const privateJwk = await privateKey.export('jwk');

  return {publicKey: publicJwk, privateKey: privateJwk};
}

export async function sign(msg, privateJwk, hash, signatureFormat) {
  const namedCurve = privateJwk.crv;
  const curve = params.namedCurves[namedCurve].indutnyName;
  const ec = new Ec(curve);

  const privateKey = new Key('jwk', privateJwk);
  if (!privateKey.isPrivate) throw new Error('NotPrivateKeyForECCSignPureJS');
  const privateOct = await privateKey.export('oct');

  const ecKey = ec.keyFromPrivate(privateOct);

  // get hash
  const md = await jschash.compute(msg, hash);

  // generate signature
  const signature = ecKey.sign(md);

  // formatting
  const len = params.namedCurves[namedCurve].payloadSize;
  const arrayR = new Uint8Array(signature.r.toArray('be', len));
  const arrayS = new Uint8Array(signature.s.toArray('be', len));
  const concat = new Uint8Array(arrayR.length + arrayS.length);
  concat.set(arrayR);
  concat.set(arrayS, arrayR.length);
  return (signatureFormat === 'raw') ? concat : asn1enc.encodeAsn1Signature(concat, namedCurve);
}

export async function verify(msg, signature, publicJwk, hash, signatureFormat){
  const namedCurve = publicJwk.crv;
  const curve = params.namedCurves[namedCurve].indutnyName;
  const ec = new Ec(curve);

  const publicKey = new Key('jwk', publicJwk);
  if (publicKey.isPrivate) throw new Error('NotPublicKeyForECCVerifyPureJS');
  const publicOct = await publicKey.export('oct', {compact: false, outputPublic: true});

  const ecKey = ec.keyFromPublic(publicOct);

  // parse signature
  const len = params.namedCurves[namedCurve].payloadSize;
  if(!(signature instanceof Uint8Array)) signature = new Uint8Array(signature);
  signature = (signatureFormat === 'raw') ? signature : asn1enc.decodeAsn1Signature(signature, namedCurve);
  const sigR = signature.slice(0, len);
  const sigS = signature.slice(len, len+sigR.length);

  // get hash
  const md = await jschash.compute(msg, hash);

  return await ecKey.verify(md, {s: sigS, r: sigR});
}

export async function deriveSecret(publicJwk, privateJwk){
  const namedCurve = privateJwk.crv;
  const curve = params.namedCurves[namedCurve].indutnyName;
  const ec = new Ec(curve);

  const priKeyObj = new Key('jwk', privateJwk);
  if (!priKeyObj.isPrivate) throw new Error('NotPrivateKeyForECCSDeriveKeyPureJS');
  const privateOct = await priKeyObj.export('oct');

  const pubKeyObj = new Key('jwk', publicJwk);
  if (pubKeyObj.isPrivate) throw new Error('NotPublicKeyForECCDeriveKeyPureJS');
  const publicOct = await pubKeyObj.export('oct', {compact: false, outputPublic: true});

  const privateKey = ec.keyFromPrivate(privateOct);
  const publicKey = ec.keyFromPublic(publicOct);

  // derive shared key
  const len = params.namedCurves[namedCurve].payloadSize;
  return new Uint8Array(privateKey.derive(publicKey.getPublic()).toArray('be', len));
}