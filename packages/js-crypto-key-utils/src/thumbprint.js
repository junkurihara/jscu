/**
 * thumbprint.js
 */

import jseu from 'js-encoding-utils';
import hash from 'js-crypto-hash';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;

/**
 * Compute JWK public key thumbprint specified in RFC7638
 * https://tools.ietf.org/html/rfc7638
 * @param {JsonWebKey} jwkey - A key object in JWK format
 * @param {String} [alg='SHA-256'] - Name of hash algorithm to compute the thumbprint.
 * @param {String} [output='binary'] - Output format, 'binary', 'hex' or 'base64'
 * @return {Promise<String|Uint8Array>} - The computed JWK thumbprint.
 */
export async function getJwkThumbprint(jwkey, alg='SHA-256', output='binary'){
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
  const thumbPrintBuf = await hash.compute(uint8json, alg);

  if(output === 'hex') return jseu.encoder.arrayBufferToHexString(thumbPrintBuf);
  else if(output === 'base64') return jseu.encoder.encodeBase64(thumbPrintBuf);
  else if (output === 'binary') return thumbPrintBuf;
}