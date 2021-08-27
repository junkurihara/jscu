/**
 * ec.ts
 */

import * as util from 'js-crypto-env';
import * as webapi from './webapi';
import * as nodeapi from './nodeapi';
import * as purejs from './purejs';
import {JsonWebKeyPair, CurveTypes, HashTypes, SignatureFormat} from './typedef';

/**
 * Generate elliptic curve cryptography public/private key pair. Generated keys are in JWK.
 * @param {String} [namedCurve='P-256'] - Name of curve like 'P-256'.
 * @return {Promise<{publicKey: JsonWebKey, privateKey: JsonWebKey }>} - The generated keys.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., neither WebCrypto, NodeCrypto, nor PureJS codes works.
 */
export const generateKey = async (namedCurve: CurveTypes ='P-256'): Promise<JsonWebKeyPair> => {
  const env = util.getCrypto();

  let pure: boolean = false;
  let keyPair: JsonWebKeyPair;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.generateKey === 'function' && typeof env.crypto.exportKey === 'function') { // for web API
      keyPair = await webapi.generateKey(namedCurve, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      keyPair = await nodeapi.generateKey(namedCurve, env.crypto);
    } else {
      pure = true;
      keyPair = await purejs.generateKey(namedCurve);
    }
    return keyPair;
  }
  catch (e: unknown) {
    if (pure) {
      if (e instanceof Error) {
        throw new Error(`UnsupportedEnvironment: ${e.message}`);
      } else {
        throw new Error('UnsupportedEnvironment');
      }
    }
    else {
      keyPair = await purejs.generateKey(namedCurve)
        .catch( (finalError: Error) => {
          throw new Error(`FailedBothNativeAndPureJSEnvs: ${finalError.message}`);
        });
      return keyPair;
    }
  }
};


/**
 * Sign message with ECDSA.
 * @param {Uint8Array} msg - Byte array of message to be signed.
 * @param {JsonWebKey} privateJwk - Private key object in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} [signatureFormat='raw'] - Signature format. 'raw' indicates the purely raw byte array of signature. It can also take 'der', and then the output is ASN.1 DER formatted.
 * @return {Promise<Uint8Array>} - Output signature byte array in raw or der format.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., neither WebCrypto, NodeCrypto, nor PureJS codes works.
 */
export const sign = async (
  msg: Uint8Array,
  privateJwk: JsonWebKey,
  hash: HashTypes = 'SHA-256',
  signatureFormat: SignatureFormat ='raw'
): Promise<Uint8Array> => {
  const env = util.getCrypto();

  let pure: boolean = false;
  let signature: Uint8Array;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.importKey === 'function' && typeof env.crypto.sign === 'function') { // for web API
      signature = await webapi.sign(msg, privateJwk, hash, signatureFormat, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      signature = await nodeapi.sign(msg, privateJwk, hash, signatureFormat, env.crypto);
    } else {
      pure = true;
      signature = await purejs.sign(msg, privateJwk, hash, signatureFormat);
    }
    return signature;
  }
  catch (e) {
    if (pure) {
      if (e instanceof Error) {
        throw new Error(`UnsupportedEnvironment: ${e.message}`);
      } else {
        throw new Error('UnsupportedEnvironment');
      }
    }
    else {
      signature = await purejs.sign(msg, privateJwk, hash, signatureFormat)
        .catch( (finalError: Error) => {
          throw new Error(`FailedBothNativeAndPureJSEnvs: ${finalError.message}`);
        });
      return signature;
    }
  }
};


/**
 * Verify signature with ECDSA.
 * @param {Uint8Array} msg - Byte array of message that have been signed.
 * @param {Uint8Array} signature - Byte array of signature for the given message.
 * @param {JsonWebKey} publicJwk - Public key object in JWK format.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm used in singing, like 'SHA-256'.
 * @param {String} [signatureFormat='raw'] - Signature format. 'raw' indicates the purely raw byte array of signature. It can also take 'der', and then the input must be in ASN.1 DER format.
 * @return {Promise<boolean>} - The result of verification.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., neither WebCrypto, NodeCrypto, nor PureJS codes works.
 */
export const verify = async (
  msg: Uint8Array,
  signature: Uint8Array,
  publicJwk: JsonWebKey,
  hash: HashTypes = 'SHA-256',
  signatureFormat: SignatureFormat='raw'
): Promise<boolean> => {
  const env = util.getCrypto();

  let pure: boolean = false;
  let valid: boolean;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.importKey === 'function' && typeof env.crypto.sign === 'function') { // for web API
      valid = await webapi.verify(msg, signature, publicJwk, hash, signatureFormat, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      valid = await nodeapi.verify(msg, signature, publicJwk, hash, signatureFormat, env.crypto);
    } else {
      pure = true;
      valid = await purejs.verify(msg, signature, publicJwk, hash, signatureFormat);
    }
    return valid;
  }
  catch (e) {
    if (pure) {
      if (e instanceof Error) {
        throw new Error(`UnsupportedEnvironment: ${e.message}`);
      } else {
        throw new Error('UnsupportedEnvironment');
      }
    }
    else {
      valid = await purejs.verify(msg, signature, publicJwk, hash, signatureFormat)
        .catch( (finalError: Error) => {
          throw new Error(`FailedBothNativeAndPureJSEnvs: ${finalError.message}`);
        });
      return valid;
    }
  }
};

/**
 * ECDH: Elliptic Curve Diffie-Hellman Key Exchange, which derives shared secret from my private key and destination's public key.
 * **NOTE** We SHOULD NOT use the derived secret as an encryption key directly.
 * We should employ an appropriate key derivation procedure like HKDF to use the secret for symmetric key encryption.
 * @param {JsonWebKey} publicJwk - Remote public key object in JWK format.
 * @param {JsonWebKey} privateJwk - Local (my) private key object in JWK format.
 * @return {Promise<Uint8Array>} - The derived master secret via ECDH.
 * @throws {Error} - Throws if UnsupportedEnvironment, i.e., neither WebCrypto, NodeCrypto, nor PureJS codes works.
 */
export const deriveSecret = async (publicJwk: JsonWebKey, privateJwk: JsonWebKey): Promise<Uint8Array> => {
  // assertion
  if(publicJwk.crv !== privateJwk.crv) throw new Error('UnmatchedCurveName');
  const env = util.getCrypto();

  let pure: boolean = false;
  let secret: Uint8Array;
  try {
    if (env.name === 'webCrypto' && typeof env.crypto.importKey === 'function' && typeof env.crypto.deriveBits === 'function') { // for web API
      secret = await webapi.deriveSecret(publicJwk, privateJwk, env.crypto);
    } else if (env.name === 'nodeCrypto') { // for node
      secret = nodeapi.deriveSecret(publicJwk, privateJwk, env.crypto);
    } else {
      pure = true;
      secret = await purejs.deriveSecret(publicJwk, privateJwk);
    }
    return secret;
  }
  catch (e) {
    if (pure) {
      if (e instanceof Error) {
        throw new Error(`UnsupportedEnvironment: ${e.message}`);
      } else {
        throw new Error('UnsupportedEnvironment');
      }
    }
    else {
      secret = await purejs.deriveSecret(publicJwk, privateJwk)
        .catch( (finalError: Error) => {
          throw new Error(`FailedBothNativeAndPureJSEnvs: ${finalError.message}`);
        });
      return secret;
    }
  }
};
