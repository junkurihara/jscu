/**
 * algo.mjs
 */

export const getWebCryptoParamsFromJwk = (jwkey, ops) => {
  const arr = ['sign', 'verify', 'encrypt', 'decrypt', 'deriveBits', 'deriveKeys', 'wrapKey', 'unwrapKey'];
  if(arr.indexOf(ops) < 0) throw new Error('Invalid ops specification');
  let algo;
  if (jwkey.kty === 'EC'){
    if (!jwkey.crv) throw new Error('Invalid jwk format');
    if (['sign', 'verify'].indexOf(ops) >= 0){
      algo = {name: 'ECDSA', namedCurve: jwkey.crv}; // just for using in WebCrypto. Note that key structure is same as ECDH.
    }
    else if (['deriveBits', 'deriveKeys'].indexOf(ops) >= 0){
      algo = {name: 'ECDH', namedCurve: jwkey.crv};
    }
    else throw new Error('Unsupported algString');
  }
  else throw new Error('RSA is unsupported at this point');

  return algo;
};