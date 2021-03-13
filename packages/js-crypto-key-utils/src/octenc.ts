/**
 * octenc.js
 */

import * as params from './params';
import jseu from 'js-encoding-utils';
import * as elliptic from 'elliptic';
import {getJwkType, getSec1KeyType} from './util';
import {OctetFormat, PublicOrPrivate, OctetEC, CurveTypes} from './typedef';
const Ec = elliptic.ec;


/**
 * Convert JWK EC public/private keys to octet form.
 * Compressed form of EC public key is referred to RFC 5480 {@link https://tools.ietf.org/html/rfc5480}.
 * @param {JsonWebKey} jwkey - A key object in JWK format to be encoded to SEC1 octet format key.
 * @param {boolean} [outputPublic] - Export public key even from private key if true.
 * @param {OctetFormat} [outputFormat='binary'] - 'binary' or 'string'.
 * @param {boolean} [compact=false] - Export compressed form of public key if true.
 * @return {Uint8Array|string} - Encoded key object in JWK format.
 */
export const fromJwk = (
  jwkey: JsonWebKey,
  {outputPublic, outputFormat='binary', compact=false}: {outputPublic?: boolean, outputFormat?: OctetFormat, compact?: boolean}
): Uint8Array|string => {
  // original key type
  const orgType = getJwkType(jwkey);
  const type: PublicOrPrivate = (typeof outputPublic === 'boolean' && outputPublic) ? 'public' : orgType;

  if(type === 'public'){
    const bufX = <Uint8Array>jseu.encoder.decodeBase64Url(<string>jwkey.x);
    const bufY = <Uint8Array>jseu.encoder.decodeBase64Url(<string>jwkey.y);

    let publicKey;
    if(compact){
      // compressed form
      // http://www.secg.org/SEC1-Ver-1.0.pdf
      publicKey = new Uint8Array(bufX.length + 1);
      publicKey[0] = 0xFF & ( (0x01 & <number>(bufY.slice(-1)[0])) + 0x02 );
      publicKey.set(<Uint8Array>bufX, 1);
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
  else { //type === 'private'
    if (!jwkey.d) throw new Error('InvalidKey');
    const bufD = <Uint8Array>jseu.encoder.decodeBase64Url(jwkey.d);
    return (outputFormat === 'string') ? jseu.encoder.arrayBufferToHexString(bufD) : bufD;
  }
};

/**
 * Convert Octet form of EC public/private keys to JWK.
 * @param {OctetEC} octkey - OctetEC key object in hex string format or Uint8Array.
 * @param {String} namedCurve - Name of elliptic curve like 'P-256'.
 * @param {boolean} [outputPublic] - Export public key even from private key if true.
 * @return {JsonWebKey} - Derived key object in JWK format.
 */
export const toJwk = (
  octkey: OctetEC,
  namedCurve: CurveTypes,
  {outputPublic} : {outputPublic? :boolean}
): JsonWebKey => {
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

  const jwKey: JsonWebKey = { // https://www.rfc-editor.org/rfc/rfc7518.txt
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
};
