/**
 * webapi.js
 */

import jseu from 'js-encoding-utils';
import * as asn1enc from './asn1enc';
import {JsonWebKeyPair, CurveTypes, HashTypes, SignatureFormat} from './typedef';

/**
 * Generate elliptic curve cryptography public/private key pair. Generated keys are in JWK.
 * @param {String} namedCurve - Name of curve like 'P-256'.
 * @param {Object} webCrypto - WebCryptoSubtle object.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey}>} - The generated keys.
 */
export const generateKey = async (namedCurve: CurveTypes, webCrypto: any): Promise<JsonWebKeyPair> => {
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
};

/**
 * Sign message with ECDSA.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key object in JWK format.
 * @param {String} hash - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} signatureFormat - Signature format, 'raw' or 'der'
 * @param {Object} webCrypto - WebCryptoSubtle object.
 * @return {Promise<Uint8Array>} - Output signature byte array in raw or der format.
 */
export const sign = async (
  msg: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes,
  signatureFormat: SignatureFormat,
  webCrypto: any
): Promise<Uint8Array> => {
  const algo = {name: 'ECDSA', namedCurve: privateJwk.crv, hash: {name: hash}};
  const key = await webCrypto.importKey('jwk', privateJwk, algo, false, ['sign']);
  const signature = await webCrypto.sign(algo, key, msg);
  return (signatureFormat === 'raw')
    ? new Uint8Array(signature)
    : asn1enc.encodeAsn1Signature(new Uint8Array(signature), <CurveTypes>privateJwk.crv);
};

/**
 * Verify signature with ECDSA.
 * @param {Uint8Array} msg - Byte array of message that have been signed.
 * @param {Uint8Array} signature - Byte array of signature for the given message.
 * @param {JsonWebKey} publicJwk - Public key object in JWK format.
 * @param {String} hash - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} signatureFormat - Signature format,'raw' or 'der'.
 * @param {Object} webCrypto - WebCryptoSubtle object.
 * @return {Promise<boolean>} - The result of verification.
 */
export const verify = async (
  msg: Uint8Array,
  signature: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes,
  signatureFormat: SignatureFormat,
  webCrypto: any) => {
  const algo = {name: 'ECDSA', namedCurve: publicJwk.crv, hash: {name: hash}};
  const key = await webCrypto.importKey('jwk', publicJwk, algo, false, ['verify']);
  const rawSignature = (signatureFormat === 'raw')
    ? signature
    : asn1enc.decodeAsn1Signature(signature, <CurveTypes>publicJwk.crv);
  return webCrypto.verify(algo, key, rawSignature, msg);
};

/**
 * Key Derivation for ECDH, Elliptic Curve Diffie-Hellman Key Exchange.
 * @param {JsonWebKey} publicJwk - Remote public key object in JWK format.
 * @param {JsonWebKey} privateJwk - Local (my) private key object in JWK format.
 * @param {Object} webCrypto - WebCryptoSubtle object.
 * @return {Promise<Uint8Array>} - The derived master secret via ECDH.
 */
export const deriveSecret = async (
  publicJwk: JsonWebKey,
  privateJwk: JsonWebKey,
  webCrypto: any
): Promise<Uint8Array> => {
  const algo = {name: 'ECDH', namedCurve: privateJwk.crv};
  const privateKey = await webCrypto.importKey('jwk', privateJwk, algo, false, ['deriveBits']);
  const publicKey = await webCrypto.importKey('jwk', publicJwk, algo, false, []);
  const bitLen = () => { const arr = jseu.encoder.decodeBase64Url(<string>privateJwk.x); return 8*arr.length; };
  return new Uint8Array(
    await webCrypto.deriveBits(Object.assign(algo, {public: publicKey}), privateKey, bitLen())
  );
};
