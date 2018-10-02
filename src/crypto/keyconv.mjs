/**
 * For key conversion between jwk and pem
 * keyconv.mjs
 */

import keyutil from 'js-crypto-key-utils/dist/index.js';

/**
 * convert key in jwk format to pem spki/pkcs8
 * @param jwkey
 * @param type
 * @return {Promise<*|*>}
 */
export async function jwkToPem(jwkey, type) {
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
export async function pemToJwk(pem, type, keyParams) {
  if (type !== 'public' && type !== 'private') throw new Error('type must be public or private');

  return keyutil.toJwkFrom('pem', pem, type);
}
