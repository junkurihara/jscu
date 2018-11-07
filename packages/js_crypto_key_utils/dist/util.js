"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAsn1Encrypted = isAsn1Encrypted;
exports.isAsn1Public = isAsn1Public;
exports.getAsn1KeyType = getAsn1KeyType;
exports.getSec1KeyType = getSec1KeyType;
exports.getJwkType = getJwkType;
exports.pruneLeadingZeros = pruneLeadingZeros;
exports.appendLeadingZeros = appendLeadingZeros;

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _params = _interopRequireDefault(require("./params.js"));

var _asn1def = require("./asn1def.js");

/**
 * util.js
 */

/**
 * Check if the given key is encrypted
 * @param key
 * @param format : pem or der
 * @return {boolean}
 */
function isAsn1Encrypted(key) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'pem';
  var keyType;

  try {
    keyType = getAsn1KeyType(key, format);
  } catch (e) {
    return false;
  }

  return keyType === 'encryptedPrivate';
}

function isAsn1Public(key) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'pem';
  var keyType;

  try {
    keyType = getAsn1KeyType(key, format);
  } catch (e) {
    return false;
  }

  return keyType === 'public';
}

function getAsn1KeyType(key) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'pem';
  // Peel the pem strings
  var binKey = format === 'pem' ? _jsEncodingUtils.default.formatter.pemToBin(key, 'private') : key;

  var decoded = _asn1def.KeyStructure.decode(Buffer.from(binKey), 'der');

  if (decoded.type === 'encryptedPrivateKeyInfo') return 'encryptedPrivate';else if (decoded.type === 'oneAsymmetricKey') return 'private';else if (decoded.type === 'subjectPublicKeyInfo') return 'public';else throw new Error('NotSpkiNorPkcs8Key');
}

function getSec1KeyType(sec1key, namedCurve) {
  var format;
  if (sec1key instanceof Uint8Array) format = 'binary';else if (typeof sec1key === 'string') format = 'string';else throw new Error('InvalidObjectType');
  var binKey = format === 'string' ? _jsEncodingUtils.default.encoder.hexStringToArrayBuffer(sec1key) : sec1key;
  var len = _params.default.namedCurves[namedCurve].payloadSize; // original key type

  if (binKey.length <= len) return 'private';else if (binKey.length === 2 * len + 1 && binKey[0] === 0x04 || binKey.length === len + 1 && (binKey[0] === 0x02 || binKey[0] === 0x03)) return 'public';else throw new Error('UnsupportedKeyStructure');
}

function getJwkType(jwkey) {
  if (jwkey.kty === 'EC') {
    if (jwkey.x && jwkey.y && jwkey.d) return 'private';else if (jwkey.x && jwkey.y) return 'public';else throw new Error('InvalidECKey');
  } else if (jwkey.kty === 'RSA') {
    if (jwkey.n && jwkey.e && jwkey.d && jwkey.p && jwkey.q && jwkey.dp && jwkey.dq && jwkey.qi) return 'private';else if (jwkey.n && jwkey.e) return 'public';else throw new Error('InvalidRSAKey');
  } else throw new Error('UnsupportedJWKType');
} // for jwk formatting of RSA
// https://tools.ietf.org/html/rfc7518#section-6.3


function pruneLeadingZeros(array) {
  if (!(array instanceof Uint8Array)) throw new Error('NonUint8Array');
  var offset = 0;

  for (var i = 0; i < array.length; i++) {
    if (array[i] !== 0x00) break;
    offset++;
  }

  var returnArray = new Uint8Array(array.length - offset);
  returnArray.set(array.slice(offset, array.length));
  return returnArray;
} // for pem/oct/der formatting from jwk of RSA


function appendLeadingZeros(array, len) {
  if (!(array instanceof Uint8Array)) throw new Error('NonUint8Array');
  if (array.length > len) throw new Error('InvalidLength');
  var returnArray = new Uint8Array(len); // initialized with zeros

  returnArray.set(array, len - array.length);
  return returnArray;
}