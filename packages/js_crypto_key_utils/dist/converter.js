"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJwkTo = fromJwkTo;
exports.toJwkFrom = toJwkFrom;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var asn1enc = _interopRequireWildcard(require("./asn1enc.js"));

var octenc = _interopRequireWildcard(require("./octenc.js"));

/**
 * converter.js
 */
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
function fromJwkTo() {
  var output = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'pem';
  var jwkey = arguments.length > 1 ? arguments[1] : undefined;
  var type = arguments.length > 2 ? arguments[2] : undefined;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  // assertion
  if (['pem', 'der', 'oct'].indexOf(output) < 0) throw new Error('InvalidOutputForm');
  if (type !== 'public' && type !== 'private') throw new Error('InvalidKeyType');
  if ((0, _typeof2.default)(jwkey) !== 'object') throw new Error('InvalidJWKAsObject');
  if (jwkey.kty !== 'EC' && jwkey.kty !== 'RSA') throw new Error('UnsupportedKeyType'); // default values

  if (jwkey.key === 'EC' && typeof options.compact !== 'boolean') options.compact = false;
  if (output === 'oct' && options.format !== 'string') options.format = 'binary'; // In the case of PEM/DER

  if (output === 'der' || output === 'pem') {
    return asn1enc.fromJwk(jwkey, {
      type: type,
      format: output,
      compact: options.compact
    });
  } // In the case of Oct
  else if (output === 'oct' && jwkey.kty === 'EC') {
      return octenc.fromJwk(jwkey, type, options.format, options.compact);
    } else throw new Error('UnsupportedEnvironment');
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


function toJwkFrom(input, key, type) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  // assertion
  if (['pem', 'der', 'oct'].indexOf(input) < 0) throw new Error('InvalidInputForm');
  if (type !== 'public' && type !== 'private') throw new Error('InvalidKeyType');
  if (input === 'oct' && !options.namedCurve) throw new Error('InappropriateOptions'); // default values

  if (input === 'oct' && options.format !== 'string') options.format = 'binary'; // In the case of PEM

  if (input === 'der' || input === 'pem') {
    return asn1enc.toJwk(key, {
      type: type,
      format: input
    });
  } // In the case of Oct
  else if (input === 'oct') {
      return octenc.toJwk(key, type, options.namedCurve, options.format);
    } else throw new Error('UnsupportedEnvironment');
}