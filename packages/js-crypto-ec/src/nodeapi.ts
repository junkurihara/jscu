/**
 * nodeapi.js
 */

import {namedCurves, hashes} from './params';
import * as asn1enc from './asn1enc';
import {Key} from 'js-crypto-key-utils';
import {CurveTypes, HashTypes, JsonWebKeyPair, SignatureFormat} from './typedef';
import jseu from 'js-encoding-utils';

/**
 * Generate elliptic curve cryptography public/private key pair. Generated keys are in JWK.
 * @param {String} namedCurve - Name of curve like 'P-256'.
 * @param {Object} nodeCrypto - NodeCrypto object.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>} - The generated keys.
 * @throws {Error} - Throws if NotPublic/PrivateKeyForECCKeyGenNode
 */
export const generateKey = async (namedCurve: NamedCurve, nodeCrypto: any): Promise<JsonWebKeyPair> => {
  const ecdh = nodeCrypto.ECDH(namedCurves[namedCurve].nodeName);
  ecdh.generateKeys();
  const publicOct = new Uint8Array(ecdh.getPublicKey());
  const privateOct = new Uint8Array(ecdh.getPrivateKey());

  const publicKey = new Key('oct', publicOct, {namedCurve: <any>namedCurve});
  if (publicKey.isPrivate) throw new Error('NotPublicKeyForECCKeyGenNode');
  const publicJwk = <JsonWebKey>await publicKey.export('jwk', {outputPublic: true});
  const privateKey = new Key('oct', privateOct, {namedCurve: <any>namedCurve});
  if (!privateKey.isPrivate) throw new Error('NotPrivateKeyForECCKeyGenNode');
  const privateJwk = <JsonWebKey>await privateKey.export('jwk');

  return {publicKey: publicJwk, privateKey: privateJwk};
};


/**
 * Sign message with ECDSA.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key object in JWK format.
 * @param {String} hash - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} signatureFormat - Signature format, 'raw' or 'der'
 * @param {Object} nodeCrypto - NodeCrypto object.
 * @return {Promise<Uint8Array>} - Output signature byte array in raw or der format.
 * @throws {Error} - Throws if NotPrivateKeyForECCSignNode.
 */
export const sign = async (
  msg: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes,
  signatureFormat: SignatureFormat,
  nodeCrypto: any
): Promise<Uint8Array> => {
  const privateKey = new Key('jwk', privateJwk);
  if (!privateKey.isPrivate) throw new Error('NotPrivateKeyForECCSignNode');
  const privatePem = await privateKey.export('pem');

  const sign = nodeCrypto.createSign(hashes[hash].nodeName);
  sign.update(msg);
  const asn1sig = sign.sign(privatePem);
  return (signatureFormat === 'raw') ? asn1enc.decodeAsn1Signature(asn1sig, <CurveTypes>privateJwk.crv) : asn1sig;
};

/**
 * Verify signature with ECDSA.
 * @param {Uint8Array} msg - Byte array of message that have been signed.
 * @param {Uint8Array} signature - Byte array of signature for the given message.
 * @param {JsonWebKey} publicJwk - Public key object in JWK format.
 * @param {String} hash - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} signatureFormat - Signature format,'raw' or 'der'.
 * @param {Object} nodeCrypto - NodeCrypto object.
 * @return {Promise<boolean>} - The result of verification.
 * @throws {Error} - Throws if NotPublicKeyForEccVerifyNode.
 */
export const verify = async (
  msg: Uint8Array,
  signature: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes,
  signatureFormat: SignatureFormat,
  nodeCrypto: any) => {
  const publicKey = new Key('jwk', publicJwk);
  if (!publicKey.isPrivate) throw new Error('NotPrivateKeyForECCVerifyNode');
  const publicPem = await publicKey.export('pem', {outputPublic: true, compact: false});

  const verify = nodeCrypto.createVerify(hashes[hash].nodeName);
  verify.update(msg);
  const asn1sig = (signatureFormat === 'raw') ? asn1enc.encodeAsn1Signature(signature, <CurveTypes>publicJwk.crv) : signature;
  return verify.verify(publicPem, asn1sig);
};

/**
 * Key Derivation for ECDH, Elliptic Curve Diffie-Hellman Key Exchange.
 * @param {JsonWebKey} publicJwk - Remote public key object in JWK format.
 * @param {JsonWebKey} privateJwk - Local (my) private key object in JWK format.
 * @param {Object} nodeCrypto - NodeCrypto object.
 * @return {Uint8Array} - The derived master secret via ECDH.
 */
export const deriveSecret = (
  publicJwk: JsonWebKey,
  privateJwk: JsonWebKey,
  nodeCrypto: any
): Uint8Array => {
  const curve = namedCurves[<CurveTypes>privateJwk.crv].nodeName;
  const payloadSize = namedCurves[<CurveTypes>privateJwk.crv].payloadSize;

  const ecdh = nodeCrypto.createECDH(curve);

  const privKeyBuf = jseu.encoder.decodeBase64Url(<string>privateJwk.d);
  const pubKeyBuf = new Uint8Array( payloadSize * 2 + 1 );
  pubKeyBuf[0] = 0xFF & 0x04;
  pubKeyBuf.set(<Uint8Array>jseu.encoder.decodeBase64Url(<string>publicJwk.x), 1);
  pubKeyBuf.set(<Uint8Array>jseu.encoder.decodeBase64Url(<string>publicJwk.y), payloadSize + 1);
  ecdh.setPrivateKey(privKeyBuf);
  return new Uint8Array(ecdh.computeSecret(pubKeyBuf));
};
