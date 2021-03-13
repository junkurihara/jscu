/**
 * purejs.js
 */

import {namedCurves} from './params';
import * as asn1enc from './asn1enc';
import random from 'js-crypto-random';
import jschash from 'js-crypto-hash';
import {Key} from 'js-crypto-key-utils';
import jseu from 'js-encoding-utils';
import * as elliptic from 'elliptic';
import {JsonWebKeyPair, CurveTypes, HashTypes, SignatureFormat} from './typedef';
const Ec = elliptic.ec;

/**
 * Generate elliptic curve cryptography public/private key pair. Generated keys are in JWK.
 * @param {String} namedCurve - Name of curve like 'P-256'.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>} - The generated keys.
 * @throws {Error} - Throws if NotPublic/PrivateKeyForECCKeyGenPureJS
 */
export const generateKey = async (namedCurve: CurveTypes): Promise<JsonWebKeyPair> => {

  const curve = namedCurves[namedCurve].indutnyName;
  const ec = new Ec(curve);
  const ecKey = ec.genKeyPair({
    entropy: jseu.encoder.arrayBufferToString(await random.getRandomBytes(32))
  });

  const len = namedCurves[namedCurve].payloadSize;
  const publicOct = new Uint8Array(ecKey.getPublic('array'));
  const privateOct = new Uint8Array(ecKey.getPrivate().toArray('be', len));

  const publicKey = new Key('oct', publicOct, {namedCurve});
  if (publicKey.isPrivate) throw new Error('NotPublicKeyForECCKeyGenPureJS');
  const publicJwk = <JsonWebKey>await publicKey.export('jwk', {outputPublic: true});

  const privateKey = new Key('oct', privateOct, {namedCurve});
  if (!privateKey.isPrivate) throw new Error('NotPrivateKeyForECCKeyGenPureJS');
  const privateJwk = <JsonWebKey>await privateKey.export('jwk');

  return {publicKey: publicJwk, privateKey: privateJwk};
};

/**
 * Sign message with ECDSA.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key object in JWK format.
 * @param {String} hash - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} signatureFormat - Signature format, 'raw' or 'der'
 * @return {Promise<Uint8Array>} - Output signature byte array in raw or der format.
 * @throws {Error} - Throws if NotPrivateKeyForECCSIgnPureJS
 */
export const sign = async (
  msg: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes,
  signatureFormat: SignatureFormat
): Promise<Uint8Array> => {
  const namedCurve = privateJwk.crv;
  const curve = namedCurves[<string>namedCurve].indutnyName;
  const ec = new Ec(curve);

  const privateKey = new Key('jwk', privateJwk);
  if (!privateKey.isPrivate) throw new Error('NotPrivateKeyForECCSignPureJS');
  const privateOct = <Uint8Array>await privateKey.export('oct');

  const ecKey = ec.keyFromPrivate(privateOct);

  // get hash
  const md = await jschash.compute(msg, hash);

  // generate signature
  const signature = ecKey.sign(md);

  // formatting
  const len = namedCurves[<string>namedCurve].payloadSize;
  const arrayR = new Uint8Array(signature.r.toArray('be', len));
  const arrayS = new Uint8Array(signature.s.toArray('be', len));
  const concat = new Uint8Array(arrayR.length + arrayS.length);
  concat.set(arrayR);
  concat.set(arrayS, arrayR.length);
  return (signatureFormat === 'raw') ? concat : asn1enc.encodeAsn1Signature(concat, <CurveTypes>namedCurve);
};

/**
 * Verify signature with ECDSA.
 * @param {Uint8Array} msg - Byte array of message that have been signed.
 * @param {Uint8Array} signature - Byte array of signature for the given message.
 * @param {JsonWebKey} publicJwk - Public key object in JWK format.
 * @param {String} hash - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} signatureFormat - Signature format,'raw' or 'der'.
 * @return {Promise<boolean>} - The result of verification.
 * @throws {Error} - Throws if NotPublicKeyForEccVerifyPureJS.
 */
export const verify = async (
  msg: Uint8Array,
  signature: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes,
  signatureFormat: SignatureFormat
): Promise<boolean> => {
  const namedCurve = publicJwk.crv;
  const curve = namedCurves[<CurveTypes>namedCurve].indutnyName;
  const ec = new Ec(curve);

  const publicKey = new Key('jwk', publicJwk);
  if (publicKey.isPrivate) throw new Error('NotPublicKeyForECCVerifyPureJS');
  const publicOct = <Uint8Array>await publicKey.export('oct', {compact: false, outputPublic: true});

  const ecKey = ec.keyFromPublic(publicOct);

  // parse signature
  const len = namedCurves[<CurveTypes>namedCurve].payloadSize;
  if(!(signature instanceof Uint8Array)) signature = new Uint8Array(signature);
  signature = (signatureFormat === 'raw') ? signature : asn1enc.decodeAsn1Signature(signature, <CurveTypes>namedCurve);
  const sigR = signature.slice(0, len);
  const sigS = signature.slice(len, len+sigR.length);

  // get hash
  const md = await jschash.compute(msg, hash);

  return ecKey.verify(md, {s: sigS, r: sigR});
};

/**
 * Key Derivation for ECDH, Elliptic Curve Diffie-Hellman Key Exchange.
 * @param {JsonWebKey} publicJwk - Remote public key object in JWK format.
 * @param {JsonWebKey} privateJwk - Local (my) private key object in JWK format.
 * @return {Promise<Uint8Array>} - The derived master secret via ECDH.
 * @throws {Error} - Throws if NotPublic/PrivateKeyForECCSDeriveKeyPureJS.
 */
export const deriveSecret = async (
  publicJwk: JsonWebKey,
  privateJwk: JsonWebKey
): Promise<Uint8Array> => {
  const namedCurve = privateJwk.crv;
  const curve = namedCurves[<CurveTypes>namedCurve].indutnyName;
  const ec = new Ec(curve);

  const priKeyObj = new Key('jwk', privateJwk);
  if (!priKeyObj.isPrivate) throw new Error('NotPrivateKeyForECCSDeriveKeyPureJS');
  const privateOct = <Uint8Array>await priKeyObj.export('oct');

  const pubKeyObj = new Key('jwk', publicJwk);
  if (pubKeyObj.isPrivate) throw new Error('NotPublicKeyForECCDeriveKeyPureJS');
  const publicOct = <Uint8Array>await pubKeyObj.export('oct', {compact: false, outputPublic: true});

  const privateKey = ec.keyFromPrivate(privateOct);
  const publicKey = ec.keyFromPublic(publicOct);

  // derive shared key
  const len = namedCurves[<CurveTypes>namedCurve].payloadSize;
  return new Uint8Array(privateKey.derive(publicKey.getPublic()).toArray('be', len));
};
