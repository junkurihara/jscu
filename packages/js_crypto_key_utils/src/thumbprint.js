/**
 * thumbprint.js
 */

import jseu from 'js-encoding-utils';
import hash from 'js-crypto-hash/dist/index.js';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;
/**
 * Compute jwk public key thumprint specified in RFC7638
 * https://tools.ietf.org/html/rfc7638
 * @param jwkey
 * @param alg
 * @param output
 * @return {Promise<*>}
 */
export async function getJwkThumbprint(jwkey, alg='SHA-256', output='array'){
  // assertion
  if(['hex', 'array'].indexOf(output) < 0) throw new Error('UnsupportedOutputFormat');

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
  else if (output === 'array') return thumbPrintBuf;
}