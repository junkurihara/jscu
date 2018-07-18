/**
 * elliptic_util.mjs
 */

import helper from '../../helper/index.mjs';
import cryptoUtil from '../util/index.mjs';
const curveList = cryptoUtil.defaultParams.curves;

export function getCurveName(algoCurve) {
  const curve = curveList[algoCurve].name;
  if (!curve) throw new Error('unsupported curve is specified');
  return curve;
}

export async function convertJwkToRawHexKey(jwkey, type) {
  if (type !== 'public' && type !== 'private') throw new Error('type must be public or private');

  let rawKey;
  if (type === 'public') {
    const hexX = helper.formatter.arrayBufferToHexString(await helper.encoder.decodeBase64Url(jwkey.x));
    const hexY = helper.formatter.arrayBufferToHexString(await helper.encoder.decodeBase64Url(jwkey.y));
    rawKey = `04${hexX}${hexY}`;
  }
  else {
    rawKey = helper.formatter.arrayBufferToHexString(await helper.encoder.decodeBase64Url(jwkey.d));
  }
  return rawKey;
}


export async function convertRawKeyPairToJwk(rawKeyPair, algo) {
  if (Object.keys(curveList).indexOf(algo) < 0) throw new Error('unsupported curve (alg)');
  const point = rawKeyPair.getPublic();
  const len = curveList[algo].payloadSize;
  const b64uX = await helper.encoder.encodeBase64Url(new Uint8Array(point.getX().toArray('be', len)));
  const b64uY = await helper.encoder.encodeBase64Url(new Uint8Array(point.getY().toArray('be', len)));
  const b64uD = await helper.encoder.encodeBase64Url(new Uint8Array(rawKeyPair.getPrivate().toArray('be', len)));

  const pubjwk = { // https://www.rfc-editor.org/rfc/rfc7518.txt
    kty: 'EC', // or "RSA", "oct"
    crv: algo, // P-256, P-384, or P-521
    x: b64uX, // hex to base64url
    y: b64uY,
    // ext: true,
    // key_ops: ['verify']
  };

  const privjwk = { // https://www.rfc-editor.org/rfc/rfc7518.txt
    kty: 'EC', // or "RSA", "oct"
    crv: algo, // P-256, P-384, or P-521
    x: b64uX, // hex to base64url
    y: b64uY,
    // ext: true,
    // key_ops: ['sign'],
    d: b64uD
  };

  return {publicKey: pubjwk, privateKey: privjwk};
}