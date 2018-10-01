"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJwk = fromJwk;
exports.toJwk = toJwk;

var asn1ec = _interopRequireWildcard(require("./asn1ec.js"));

var asn1rsa = _interopRequireWildcard(require("./asn1rsa.js"));

var _params = _interopRequireWildcard(require("./params.js"));

var _asn = _interopRequireDefault(require("asn1.js"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _buffer = _interopRequireDefault(require("buffer"));

/**
 * asn1enc.js
 */
var Buffer = _buffer.default.Buffer;
/**
 * Convert jwk to spki/pkcs8 in string or binary format.
 * @param jwkey
 * @param type {string} : 'public' or 'private'
 * @param format {string} : 'pem' or 'der'
 * @param compact {boolean} : 'true' or 'false' for EC public key compressed representation in der/pem
 * @return {Uint8Array}
 */

function fromJwk(jwkey, _ref) {
  var type = _ref.type,
      format = _ref.format,
      _ref$compact = _ref.compact,
      compact = _ref$compact === void 0 ? false : _ref$compact;
  var decoded;

  if (jwkey.kty === 'EC') {
    decoded = asn1ec.fromJWK(jwkey, type, compact);
  } else if (jwkey.kty === 'RSA') {
    decoded = asn1rsa.fromJwk(jwkey, type);
  }

  var binKey = type === 'public' ? SubjectPublicKeyInfo.encode(decoded, 'der') : PrivateKeyInfo.encode(decoded, 'der');
  binKey = new Uint8Array(binKey);
  return format === 'pem' ? _jsEncodingUtils.default.formatter.binToPem(binKey, type) : binKey;
}
/**
 * Convert spki/pkcs8 key in string or binary format to jwk.
 * @param key
 * @param type
 * @param format
 * @return {*|void}
 */


function toJwk(key, _ref2) {
  var type = _ref2.type,
      format = _ref2.format;
  // Peel the pem strings
  var binKey = format === 'pem' ? _jsEncodingUtils.default.formatter.pemToBin(key, type) : key; // decode binary spki/pkcs8-formatted key to parsed object

  var decoded = type === 'public' ? SubjectPublicKeyInfo.decode(Buffer.from(binKey), 'der') : PrivateKeyInfo.decode(Buffer.from(binKey), 'der');
  var keyTypes = (0, _params.getAlgorithmFromOid)(type === 'public' ? decoded.algorithm.algorithm : decoded.privateKeyAlgorithm.algorithm, _params.default.publicKeyAlgorithms);
  if (keyTypes.length < 1) throw new Error('UnsupportedKey');

  if (keyTypes[0] === 'EC') {
    return asn1ec.toJWK(decoded, type);
  } else if (keyTypes[0] === 'RSA') {
    return asn1rsa.toJwk(decoded, type);
  } else throw new Error('InvalidKeyType');
} ///////
// https://tools.ietf.org/html/rfc5280


var AlgorithmIdentifier = _asn.default.define('AlgorithmIdentifier', function () {
  this.seq().obj(this.key('algorithm').objid(), this.key('parameters').optional().any());
}); // https://tools.ietf.org/html/rfc5280


var SubjectPublicKeyInfo = _asn.default.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(this.key('algorithm').use(AlgorithmIdentifier), this.key('subjectPublicKey').bitstr());
}); // https://tools.ietf.org/html/rfc5208


var PrivateKeyInfo = _asn.default.define('PrivateKeyInfo', function () {
  this.seq().obj(this.key('version').use(Version), this.key('privateKeyAlgorithm').use(AlgorithmIdentifier), this.key('privateKey').octstr(), this.key('attributes').optional().any());
});

var Version = _asn.default.define('Version', function () {
  this.int();
});