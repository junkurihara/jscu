/**
 * octenc.js
 */

import params from './params.js';
import jseu from 'js-encoding-utils';
import elliptic from 'elliptic';
const Ec = elliptic.ec;


/**
 * Convert JWK EC public/private keys to octet form
 * compressed form of ec public key: https://tools.ietf.org/html/rfc5480
 * @param jwkey
 * @param type
 * @param outputFormat
 * @param compact
 * @return {*}
 */
export function fromJwk(jwkey, type, outputFormat='binary', compact=false){
  if (type !== 'public' && type !== 'private') throw new Error('InvalidType');
  if(type === 'public'){
    const bufX = jseu.encoder.decodeBase64Url(jwkey.x);
    const bufY = jseu.encoder.decodeBase64Url(jwkey.y);

    let publicKey;
    if(compact){
      // compressed form
      // http://www.secg.org/SEC1-Ver-1.0.pdf
      publicKey = new Uint8Array(bufX.length + 1);
      publicKey[0] = 0xFF & ( (0x01 & bufY.slice(-1)[0]) + 0x02 );
      publicKey.set(bufX, 1);
    }
    else {
      // uncompressed form
      publicKey = new Uint8Array(bufX.length + bufY.length + 1);
      publicKey[0]=0xFF & 0x04;
      publicKey.set(bufX, 1);
      publicKey.set(bufY, bufX.length+1);
    }
    return (outputFormat === 'string') ? jseu.encoder.arrayBufferToHexString(publicKey): publicKey;
  }
  else if (type === 'private'){
    if (!jwkey.d) throw new Error('InvalidKey');
    const bufD = jseu.encoder.decodeBase64Url(jwkey.d);
    return (outputFormat === 'string') ? jseu.encoder.arrayBufferToHexString(bufD) : bufD;
  }
}

/**
 * Convert Octet form of EC public/private keys to JWK
 * @param octkey
 * @param type
 * @param namedCurve
 * @param inputFormat
 * @return {{kty: string, crv: *, x, y}}
 */
export function toJwk(octkey, type, namedCurve, inputFormat='binary'){
  if (type !== 'public' && type !== 'private') throw new Error('InvalidType');
  if (Object.keys(params.namedCurves).indexOf(namedCurve) < 0) throw new Error('UnsupportedCurve');

  const binKey = (inputFormat === 'string') ? jseu.encoder.hexStringToArrayBuffer(octkey): octkey;

  const curve = params.namedCurves[namedCurve].indutnyName;
  const ec = new Ec(curve);
  const ecKey = (type === 'public') ? ec.keyFromPublic(binKey): ec.keyFromPrivate(binKey);

  const len = params.namedCurves[namedCurve].payloadSize;
  const publicKey = new Uint8Array(ecKey.getPublic('array'));

  const bufX = publicKey.slice(1, len+1);
  const bufY = publicKey.slice(len+1, len*2+1);

  const jwKey = { // https://www.rfc-editor.org/rfc/rfc7518.txt
    kty: 'EC',
    crv: namedCurve,
    x: jseu.encoder.encodeBase64Url(bufX), // oct to base64url
    y: jseu.encoder.encodeBase64Url(bufY)
    // ext: true
  };

  if(type === 'private'){
    // octkey is exactly private key if type is private.
    jwKey.d = jseu.encoder.encodeBase64Url(binKey);
  }
  return jwKey;
}



export function octKeyObjFromJwk(jwkey, type, compact=false){
  const octKeyObj = {};
  octKeyObj.publicKey = fromJwk(jwkey, 'public', 'binary', compact);
  if(jwkey.d && type === 'private') octKeyObj.privateKey = fromJwk(jwkey, 'private', 'binary', compact);

  return octKeyObj;
}

export function octKeyObjToJwk(octKeyObj, type, namedCurve) {
  if (type !== 'public' && type !== 'private') throw new Error('InvalidType');
  if (Object.keys(params.namedCurves).indexOf(namedCurve) < 0) throw new Error('UnsupportedCurve');

  return (type === 'public')
    ? toJwk(octKeyObj.publicKey, 'public', namedCurve, 'binary')
    : toJwk(octKeyObj.privateKey, 'private', namedCurve, 'binary');
}