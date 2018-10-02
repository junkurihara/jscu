/**
 * For key conversion between jwk and pem
 * keyutil.mjs
 */

import keyutil from 'js-crypto-key-utils/dist/index.js';

/**
 * convert key in jwk format to pem spki/pkcs8
 * @param jwkey
 * @param type
 * @return {Promise<*|*>}
 */
export function jwkToPem(jwkey, type) {
  if (type !== 'public' && type !== 'private') throw new Error('type must be public or private');

  return keyutil.fromJwkTo('pem', jwkey, type, {compact: false}); // {compact: false} is just for EC keys (in RSA, will be omitted.)
}


/**
 * convert pem spki/pkcs8 to jwk
 * @param pem
 * @param type
 * @param keyParams
 * @return {Promise<*>}
 */
export function pemToJwk(pem, type) {
  if (type !== 'public' && type !== 'private') throw new Error('type must be public or private');

  return keyutil.toJwkFrom('pem', pem, type);
}

/**
 * get jwk public key thumprint specified in https://tools.ietf.org/html/rfc7638
 * @param jwkey {Object}
 * @param hashAlgo {string}
 * @param output {string}
 * @return {Promise<*>}
 */

export async function getJwkThumbprint(jwkey, hashAlgo='SHA-256', output='binary'){
  return await keyutil.getJwkThumbprint(jwkey, hashAlgo, output);
}