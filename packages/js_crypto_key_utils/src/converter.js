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
 * @param output : 'pem', 'der', or 'oct' (only EC JWK)
 * @param jwkey
 * @param type : 'public' or 'private' indicating the key type of input jwk
 * @param options
  * For EC JWK : options.compact = true or false
  * For EC JWK with output = 'oct' : options.format = 'binary' or 'string'
 * @return {Uint8Array}
 */
export async function fromJwkTo(output = 'pem', jwkey, type, options={}){
  // assertion
  if (['pem', 'der', 'oct'].indexOf(output) < 0) throw new Error('InvalidOutputForm');
  if (type !== 'public' && type !== 'private') throw new Error('InvalidKeyType');
  if (typeof jwkey !== 'object') throw new Error('InvalidJWKAsObject');
  if (jwkey.kty !== 'EC' && jwkey.kty !== 'RSA') throw new Error('UnsupportedKeyType');

  // default values
  if (jwkey.key === 'EC' && typeof options.compact !== 'boolean') options.compact = false;
  if (output === 'oct' && options.format !== 'string') options.format = 'binary';
  if ((output === 'der' || output === 'pem') && typeof options.passphrase === 'undefined') options.passphrase = '';

  // In the case of PEM/DER
  if (output === 'der' || output === 'pem') {
    return await asn1enc.fromJwk(
      jwkey,
      {type, format: output, compact: options.compact, passphrase: options.passphrase, encOptions: options.encOptions }
    );
  }
  // In the case of Oct
  else if (output === 'oct' && jwkey.kty === 'EC') {
    return octenc.fromJwk(jwkey, type, options.format, options.compact);
  }
  else throw new Error('UnsupportedEnvironment');

}


/**
 * Convert ASN.1 encoded (for RSA and EC) or octet formed (for EC) keys to JWK.
 * @param input
 * @param key
 * @param type
 * @param options
 * @return {*}
 */
export async function toJwkFrom(input, key, type, options={}){
  // assertion
  if (['pem', 'der', 'oct'].indexOf(input) < 0) throw new Error('InvalidInputForm');
  if (type !== 'public' && type !== 'private') throw new Error('InvalidKeyType');
  if (input === 'oct' && !options.namedCurve ) throw new Error('InappropriateOptions');

  // default values
  if (input === 'oct' && options.format !== 'string') options.format = 'binary';
  if ((input === 'der' || input === 'pem') && typeof options.passphrase === 'undefined') options.passphrase = '';

  // In the case of PEM
  if (input === 'der' || input === 'pem') {
    return await asn1enc.toJwk(key, {type, format: input, passphrase: options.passphrase});
  }
  // In the case of Oct
  else if (input === 'oct') {
    return octenc.toJwk(key, type, options.namedCurve, options.format);
  }
  else throw new Error('UnsupportedEnvironment');
}
