/**
 * converter.js
 */

import * as asn1enc from './asn1enc.js';
import * as octenc from './octenc.js';

// ASN.1 in RFC5280 (SPKI) and RFC5208 (PKCS8) -> RSA and EC, encode='asn', format='pem' or 'der'
// -> SPKI (in X.509): RFC5280 for public key, PKCS8: RFC5208 for private key
// Octet Form in ANSI X9.63 -> EC, encode='oct', format='string' or 'binary', compact=true or false
// -> Standards for Efficient Cryptography Group (SECG), "SEC1: Elliptic Curve Cryptography", Version 1.0, September 2000.
/**
 * Convert JWK to ASN.1 (for RSA and EC) and Octet (for EC) encoded keys.
 * @param jwkey
 * @param type
 * @param encode
 * @param format
 * @param compact
 * @return {Uint8Array}
 */
export function fromJwkTo(jwkey, type, { encode = 'asn', format='pem', compact=false}){
  // assertion
  if (type !== 'public' && type !== 'private') throw new Error('InvalidKeyType');
  // TODO: parameter assertion for each case of EC and RSA

  // In the case of PEM
  if (encode === 'asn') {
    if(!encode || !format) throw new Error('InvalidEncodingSpecs');
    return asn1enc.fromJwk(jwkey, {type, format, compact});
  }
  // In the case of Oct
  else if (encode === 'oct' && jwkey.kty === 'EC') {
    return octenc.fromJwk(jwkey, type, format, compact);
  }
  else throw new Error('UnsupportedEnvironment');
}

/**
 * Convert ASN.1 encoded (for RSA and EC) or octet formed (for EC) keys to JWK.
 * @param key
 * @param type
 * @param encode
 * @param format
 * @param namedCurve
 * @return {*}
 */
export function toJwkFrom(key, type, {encode='asn', format='pem', namedCurve}){
  // assertion
  if (type !== 'public' && type !== 'private') throw new Error('InvalidKeyType');
  // TODO: parameter assertion

  // In the case of PEM
  if (encode === 'asn') {
    if(!encode || !format) throw new Error('InvalidEncodingSpecs');
    return asn1enc.toJwk(key, {type, format});
  }
  // In the case of Oct
  else if (encode === 'oct') {
    return octenc.toJwk(key, type, namedCurve, format);
  }
  else throw new Error('UnsupportedEnvironment');
}
