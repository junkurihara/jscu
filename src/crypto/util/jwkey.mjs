/**
 * params.mjs
 */

import buffer from 'buffer';
import {getHash} from './hash.mjs';
import helper from '../../helper/index.mjs';

const Buffer = buffer.Buffer;

/**
 * get jwk public key thumprint specified in https://tools.ietf.org/html/rfc7638
 * @param jwkey {Object}
 * @param hash {string}
 * @param output {string}
 * @return {Promise<*>}
 */
export async function getThumbprint(jwkey, hash='SHA-256', output='array'){
  // assertion
  if(jwkey.kty !== 'EC') throw new Error('unsupported key type');
  if(['hex', 'array'].indexOf(output) < 0) throw new Error('unsupported format');

  const jsonString = JSON.stringify({crv: jwkey.crv, kty: jwkey.kty, x: jwkey.x, y: jwkey.y});
  const uint8json = new Uint8Array(Buffer.from(jsonString, 'utf8'));
  const thumbPrintBuf = await getHash(hash, uint8json);

  if(output === 'hex') return helper.formatter.arrayBufferToHexString(thumbPrintBuf);
  else if (output === 'array') return thumbPrintBuf;
}