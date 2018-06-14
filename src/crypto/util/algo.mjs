/**
 * algo.mjs
 */

export const getParamsFromJwk = (jwkey) => {
  let algo;
  if (jwkey.kty === 'EC'){
    if (!jwkey.crv) throw new Error('Invalid jwk format');
    algo = {name: 'ECDSA', namedCurve: jwkey.crv };
  }
  else throw new Error('RSA is unsupported at this point');

  return algo;
};