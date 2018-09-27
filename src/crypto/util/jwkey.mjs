/**
 * params.mjs
 */

import buffer from 'buffer';
import jseu from 'js-encoding-utils';
import hash from 'js-crypto-hash';

const Buffer = buffer.Buffer;

/**
 * get jwk public key thumprint specified in https://tools.ietf.org/html/rfc7638
 * @param jwkey {Object}
 * @param hashAlgo {string}
 * @param output {string}
 * @return {Promise<*>}
 */
export async function getThumbprint(jwkey, hashAlgo='SHA-256', output='array'){
  // assertion
  if(jwkey.kty !== 'EC') throw new Error('unsupported key type');
  if(['hex', 'array'].indexOf(output) < 0) throw new Error('unsupported format');

  const jsonString = JSON.stringify({crv: jwkey.crv, kty: jwkey.kty, x: jwkey.x, y: jwkey.y});
  const uint8json = new Uint8Array(Buffer.from(jsonString, 'utf8'));
  const thumbPrintBuf = await hash.compute(uint8json, hashAlgo);

  if(output === 'hex') return jseu.encoder.arrayBufferToHexString(thumbPrintBuf);
  else if (output === 'array') return thumbPrintBuf;
}