"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJwk = fromJwk;
exports.toJwk = toJwk;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var asn1ec = _interopRequireWildcard(require("./asn1ec.js"));

var asn1rsa = _interopRequireWildcard(require("./asn1rsa.js"));

var _params = _interopRequireWildcard(require("./params.js"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _buffer = _interopRequireDefault(require("buffer"));

var _asn1def = require("./asn1def.js");

var _rfc = require("./rfc8081.js");

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

  var binKey = type === 'public' ? _asn1def.SubjectPublicKeyInfo.encode(decoded, 'der') : _asn1def.OneAsymmetricKey.encode(decoded, 'der');
  binKey = new Uint8Array(binKey);
  return format === 'pem' ? _jsEncodingUtils.default.formatter.binToPem(binKey, type) : binKey;
}
/**
 * Convert spki/pkcs8 key in string or binary format to jwk.
 * @param key
 * @param type
 * @param format
 * @param passphrase
 * @return {*|void}
 */


function toJwk(_x, _x2) {
  return _toJwk.apply(this, arguments);
}

function _toJwk() {
  _toJwk = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(key, _ref2) {
    var type, format, passphrase, binKey, decoded, keyTypes;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = _ref2.type, format = _ref2.format, passphrase = _ref2.passphrase;
            // Peel the pem strings
            binKey = format === 'pem' ? _jsEncodingUtils.default.formatter.pemToBin(key, type) : key; // decode binary spki/pkcs8-formatted key to parsed object

            if (!(type === 'public')) {
              _context.next = 6;
              break;
            }

            decoded = _asn1def.SubjectPublicKeyInfo.decode(Buffer.from(binKey), 'der');
            _context.next = 14;
            break;

          case 6:
            decoded = _asn1def.PrivateKeyStructure.decode(Buffer.from(binKey), 'der');

            if (!(decoded.type === 'encryptedPrivateKeyInfo')) {
              _context.next = 13;
              break;
            }

            _context.next = 10;
            return (0, _rfc.decryptEncryptedPrivateKeyInfo)(decoded.value, passphrase);

          case 10:
            decoded = _context.sent;
            _context.next = 14;
            break;

          case 13:
            if (decoded.type === 'oneAsymmetricKey') decoded = decoded.value;

          case 14:
            keyTypes = (0, _params.getAlgorithmFromOid)(type === 'public' ? decoded.algorithm.algorithm : decoded.privateKeyAlgorithm.algorithm, _params.default.publicKeyAlgorithms);

            if (!(keyTypes.length < 1)) {
              _context.next = 17;
              break;
            }

            throw new Error('UnsupportedKey');

          case 17:
            if (!(keyTypes[0] === 'EC')) {
              _context.next = 21;
              break;
            }

            return _context.abrupt("return", asn1ec.toJWK(decoded, type));

          case 21:
            if (!(keyTypes[0] === 'RSA')) {
              _context.next = 25;
              break;
            }

            return _context.abrupt("return", asn1rsa.toJwk(decoded, type));

          case 25:
            throw new Error('InvalidKeyType');

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _toJwk.apply(this, arguments);
}