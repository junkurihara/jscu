/**
 * elliptic_npm.mjs
 */

import EC from 'elliptic';
import * as util from './elliptic_util.mjs';
import cryptoUtil from '../util/index.mjs';
import helper from '../../helper/index.mjs';
const curveList = cryptoUtil.defaultParams.curves;
const Ec = EC.ec;

export async function deriveSharedKey(algo, pubkey, privkey){
  if(algo.name !== 'ECDH') throw new Error('unsupported algorithm name in keyParams');
  const namedCurve = algo.namedCurve;
  const curve = util.getCurveName(namedCurve);
  const ec = new Ec(curve);

  const rawHexPriv = await util.convertJwkToRawHexKey(privkey, 'private');
  const rawHexPub = await util.convertJwkToRawHexKey(pubkey, 'public');
  const ecPriv = ec.keyFromPrivate(rawHexPriv, 'hex');
  const ecPub = ec.keyFromPublic(rawHexPub, 'hex');

  // derive shared key
  const len = curveList[algo.namedCurve].payloadSize;
  return new Uint8Array(ecPriv.derive(ecPub.getPublic()).toArray('be', len));
}


export async function sign(algo, key, msg){
  if(algo.name !== 'ECDSA') throw new Error('unsupported algorithm name in keyParams');
  const namedCurve = algo.namedCurve;
  const hashAlgo = algo.hash.name;
  const curve = util.getCurveName(namedCurve);
  const ec = new Ec(curve);

  const rawHexKey = await util.convertJwkToRawHexKey(key, 'private');
  const eckey = ec.keyFromPrivate(rawHexKey, 'hex');

  // get hash
  const msgHash = await cryptoUtil.hash.getHash(hashAlgo, msg);

  // generate signature
  const signature = await eckey.sign(msgHash);

  // formatting
  const len = curveList[algo.namedCurve].payloadSize;
  const arrayR = new Uint8Array(signature.r.toArray('be', len));
  const arrayS = new Uint8Array(signature.s.toArray('be', len));
  const hexConcat = helper.formatter.arrayBufferToHexString(arrayR) + helper.formatter.arrayBufferToHexString(arrayS);
  return await helper.formatter.hexStringToArrayBuffer(hexConcat);
}

export async function verify(algo, key, sig, msg){
  if(algo.name !== 'ECDSA') throw new Error('unsupported algorithm name in keyParams');
  const namedCurve = algo.namedCurve;
  const hashAlgo = algo.hash.name;
  const curve = util.getCurveName(namedCurve);
  const ec = new Ec(curve);

  const rawHexKey = await util.convertJwkToRawHexKey(key, 'public');
  const eckey = ec.keyFromPublic(rawHexKey, 'hex');

  // parse signature
  const len = curveList[algo.namedCurve].payloadSize;
  const strSig = helper.formatter.arrayBufferToHexString(sig);
  const sigR = strSig.slice(0, len*2);
  const sigS = strSig.slice(len*2, len*4);

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
    entropy: helper.formatter.arrayBufferToString(await cryptoUtil.random.getRandomBytes(32))
  });

  const jwkPair = await util.convertRawKeyPairToJwk(rawKeyPair, namedCurve);

  return {
    publicKey: { format: 'jwk', key: jwkPair.publicKey},
    privateKey: { format: 'jwk', key: jwkPair.privateKey}
  };
}

