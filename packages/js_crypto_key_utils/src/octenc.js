/**
 * octenc.js
 */

import params from './params.js';
import jseu from 'js-encoding-utils';
import elliptic from 'elliptic';
import {getJwkType, getSec1KeyType} from './util.js';
const Ec = elliptic.ec;


/**
 * Convert JWK EC public/private keys to octet form
 * compressed form of ec public key: https://tools.ietf.org/html/rfc5480
 * @param jwkey
 * @param outputPublic {boolean} (optional)
 * @param outputFormat
 * @param compact
 * @return {*}
 */
export function fromJwk(jwkey, {outputPublic, outputFormat='binary', compact=false}){
  // original key type
  const orgType = getJwkType(jwkey);
  const type = (typeof outputPublic === 'boolean' && outputPublic) ? 'public' : orgType;

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
 * @param outputPublic {boolean} (optional)
 * @param namedCurve
 * @return {{kty: string, crv: *, x, y}}
 */
export function toJwk(octkey, namedCurve, {outputPublic}){
  if (Object.keys(params.namedCurves).indexOf(namedCurve) < 0) throw new Error('UnsupportedCurve');

  // original key type and check the key structure
  const orgType = getSec1KeyType(octkey, namedCurve);
  const type = (typeof outputPublic === 'boolean' && outputPublic) ? 'public' : orgType;

  // format conversion
  const binKey = (typeof octkey === 'string') ? jseu.encoder.hexStringToArrayBuffer(octkey): octkey;

  // instantiation
  const curve = params.namedCurves[namedCurve].indutnyName;
  const ec = new Ec(curve);

  // derive key object from binary key
  const ecKey = (orgType === 'public') ? ec.keyFromPublic(binKey): ec.keyFromPrivate(binKey);
  const publicKey = new Uint8Array(ecKey.getPublic('array'));
  const len = params.namedCurves[namedCurve].payloadSize;

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
  octKeyObj.publicKey = fromJwk(jwkey, {outputFormat: 'binary', outputPublic: true, compact});
  if(jwkey.d && type === 'private') octKeyObj.privateKey = fromJwk(jwkey, {outputFormat: 'binary', outputPublic: false, compact});

  return octKeyObj;
}

export function octKeyObjToJwk(octKeyObj, type, namedCurve) {
  if (type !== 'public' && type !== 'private') throw new Error('InvalidType');
  if (Object.keys(params.namedCurves).indexOf(namedCurve) < 0) throw new Error('UnsupportedCurve');

  return (type === 'public')
    ? toJwk(octKeyObj.publicKey, namedCurve, {outputPublic: true})
    : toJwk(octKeyObj.privateKey, namedCurve, {outputPublic: false});
}