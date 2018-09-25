/**
 * elliptic_npm.mjs
 */

import EC from 'elliptic';
import * as util from './elliptic_util.mjs';
import * as keyconv from './elliptic_keyconv.mjs';
import cryptoUtil from '../util/index.mjs';
import jseu from 'js-encoding-utils';

const Ec = EC.ec;

export async function deriveSharedKey(algo, pubkey, privkey){
  if(algo.name !== 'ECDH') throw new Error('unsupported algorithm name in keyParams');
  const namedCurve = algo.namedCurve;
  const curve = util.getCurveName(namedCurve);
  const ec = new Ec(curve);

  const rawPriv = await keyconv.convertJwkToRawKey(privkey, 'private');
  const rawPub = await keyconv.convertJwkToRawKey(pubkey, 'public');
  const ecPriv = ec.keyFromPrivate(rawPriv);
  const ecPub = ec.keyFromPublic(rawPub);

  // derive shared key
  const len = util.getPayloadSize(algo.namedCurve);
  return new Uint8Array(ecPriv.derive(ecPub.getPublic()).toArray('be', len));
}


export async function sign(algo, key, msg){
  if(algo.name !== 'ECDSA') throw new Error('unsupported algorithm name in keyParams');
  const namedCurve = algo.namedCurve;
  const hashAlgo = algo.hash.name;
  const curve = util.getCurveName(namedCurve);
  const ec = new Ec(curve);

  const rawKey = await keyconv.convertJwkToRawKey(key, 'private');
  const eckey = ec.keyFromPrivate(rawKey);

  // get hash
  const msgHash = await cryptoUtil.hash.getHash(hashAlgo, msg);

  // generate signature
  const signature = await eckey.sign(msgHash);

  // formatting
  const len = util.getPayloadSize(algo.namedCurve);
  const arrayR = new Uint8Array(signature.r.toArray('be', len));
  const arrayS = new Uint8Array(signature.s.toArray('be', len));
  const concat = new Uint8Array(arrayR.length + arrayS.length);
  concat.set(arrayR);
  concat.set(arrayS, arrayR.length);
  return concat;
}

export async function verify(algo, key, sig, msg){
  if(algo.name !== 'ECDSA') throw new Error('unsupported algorithm name in keyParams');
  const namedCurve = algo.namedCurve;
  const hashAlgo = algo.hash.name;
  const curve = util.getCurveName(namedCurve);
  const ec = new Ec(curve);

  const rawKey = await keyconv.convertJwkToRawKey(key, 'public');
  const eckey = ec.keyFromPublic(rawKey);

  // parse signature
  const len = util.getPayloadSize(algo.namedCurve);
  if(!(sig instanceof Uint8Array)) sig = new Uint8Array(sig);
  const sigR = sig.slice(0, len);
  const sigS = sig.slice(len, len+sigR.length);

  // get hash
  const msgHash = await cryptoUtil.hash.getHash(hashAlgo, msg);

  return await eckey.verify(msgHash, {s: sigS, r: sigR});
}


export async function generateKeyPair(algo){
  if(algo.name !== 'ECDSA') throw new Error('unsupported algorithm name in algorithm');
  const namedCurve = algo.namedCurve;
  const curve = util.getCurveName(namedCurve);
  const ec = new Ec(curve);

  const rawKeyPair = await ec.genKeyPair({
    entropy: jseu.encoder.arrayBufferToString(await cryptoUtil.random.getRandomBytes(32))
  });

  const len = util.getPayloadSize(namedCurve);
  const point = rawKeyPair.getPublic();
  const rawPub = new Uint8Array(point.encode());
  const rawPriv = new Uint8Array(rawKeyPair.getPrivate().toArray('be', len));
  const kp = {publicKey: rawPub, privateKey: rawPriv};
  const jwkPub = await keyconv.convertRawKeyToJwk(kp, 'public', namedCurve);
  const jwkPriv = await keyconv.convertRawKeyToJwk(kp, 'private', namedCurve);

  return {
    publicKey: { format: 'jwk', key: jwkPub},
    privateKey: { format: 'jwk', key: jwkPriv}
  };
}

