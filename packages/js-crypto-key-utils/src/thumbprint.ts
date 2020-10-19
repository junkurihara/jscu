/**
 * thumbprint.js
 */

import jseu from 'js-encoding-utils';
import hash from 'js-crypto-hash';
import * as BufferMod from 'buffer';
import {HashTypes, JwkThumbprintFormat} from './typedef';
const Buffer = BufferMod.Buffer;

/**
 * Compute JWK public key thumbprint specified in RFC7638
 * https://tools.ietf.org/html/rfc7638
 * @param {JsonWebKey} jwkey - A key object in JWK format
 * @param {HashTypes} [alg='SHA-256'] - Name of hash algorithm to compute the thumbprint.
 * @param {JwkThumbprintFormat} [output='binary'] - Output format, 'binary', 'hex' or 'base64'
 * @return {Promise<String|Uint8Array>} - The computed JWK thumbprint.
 */
export const getJwkThumbprint = async (
  jwkey: JsonWebKey,
  alg: HashTypes = 'SHA-256',
  output: JwkThumbprintFormat = 'binary'
): Promise<Uint8Array|string> => {
  // assertion
  if(['hex', 'binary'].indexOf(output) < 0) throw new Error('UnsupportedOutputFormat');

  let jsonString;
  if(jwkey.kty === 'EC'){
    jsonString = JSON.stringify({crv: jwkey.crv, kty: jwkey.kty, x: jwkey.x, y: jwkey.y});
  }
  else if (jwkey.kty === 'RSA'){
    jsonString = JSON.stringify({e: jwkey.e, kty: jwkey.kty, n: jwkey.n});
  }
  else throw new Error('UnsupportedKeyType');

  const uint8json = new Uint8Array(Buffer.from(jsonString, 'utf8'));
  const thumbPrintBuf = await hash.compute(uint8json, alg); // work around

  if(output === 'hex') return jseu.encoder.arrayBufferToHexString(thumbPrintBuf);
  else if(output === 'base64') return jseu.encoder.encodeBase64(thumbPrintBuf);
  else return thumbPrintBuf; // output === 'binary'
};
