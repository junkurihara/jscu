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
 * @param passphrase
 * @param encOptions
 * @return {Uint8Array}
 */

function fromJwk(_x, _x2) {
  return _fromJwk.apply(this, arguments);
}
/**
 * Convert spki/pkcs8 key in string or binary format to jwk.
 * @param key
 * @param type
 * @param format
 * @param passphrase
 * @return {*|void}
 */


function _fromJwk() {
  _fromJwk = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(jwkey, _ref) {
    var type, format, _ref$compact, compact, _ref$passphrase, passphrase, encOptions, decoded, binKey;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = _ref.type, format = _ref.format, _ref$compact = _ref.compact, compact = _ref$compact === void 0 ? false : _ref$compact, _ref$passphrase = _ref.passphrase, passphrase = _ref$passphrase === void 0 ? '' : _ref$passphrase, encOptions = _ref.encOptions;

            if (jwkey.kty === 'EC') {
              decoded = asn1ec.fromJWK(jwkey, type, compact);
            } else if (jwkey.kty === 'RSA') {
              decoded = asn1rsa.fromJwk(jwkey, type);
            }

            if (!(type === 'public')) {
              _context.next = 6;
              break;
            }

            binKey = _asn1def.SubjectPublicKeyInfo.encode(decoded, 'der');
            _context.next = 12;
            break;

          case 6:
            binKey = _asn1def.OneAsymmetricKey.encode(decoded, 'der');

            if (!(passphrase.length > 0)) {
              _context.next = 12;
              break;
            }

            _context.next = 10;
            return (0, _rfc.encryptEncryptedPrivateKeyInfo)(binKey, passphrase, encOptions);

          case 10:
            binKey = _context.sent;
            type = 'encryptedPrivate';

          case 12:
            binKey = new Uint8Array(binKey);
            return _context.abrupt("return", format === 'pem' ? _jsEncodingUtils.default.formatter.binToPem(binKey, type) : binKey);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _fromJwk.apply(this, arguments);
}

function toJwk(_x3, _x4) {
  return _toJwk.apply(this, arguments);
}

function _toJwk() {
  _toJwk = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(key, _ref2) {
    var type, format, passphrase, binKey, decoded, keyTypes;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            type = _ref2.type, format = _ref2.format, passphrase = _ref2.passphrase;
            // Peel the pem strings
            binKey = format === 'pem' ? _jsEncodingUtils.default.formatter.pemToBin(key, type) : key; // decode binary spki/pkcs8-formatted key to parsed object

            if (!(type === 'public')) {
              _context2.next = 6;
              break;
            }

            decoded = _asn1def.SubjectPublicKeyInfo.decode(Buffer.from(binKey), 'der');
            _context2.next = 14;
            break;

          case 6:
            decoded = _asn1def.PrivateKeyStructure.decode(Buffer.from(binKey), 'der');

            if (!(decoded.type === 'encryptedPrivateKeyInfo')) {
              _context2.next = 13;
              break;
            }

            _context2.next = 10;
            return (0, _rfc.decryptEncryptedPrivateKeyInfo)(decoded.value, passphrase);

          case 10:
            decoded = _context2.sent;
            _context2.next = 14;
            break;

          case 13:
            if (decoded.type === 'oneAsymmetricKey') decoded = decoded.value;

          case 14:
            keyTypes = (0, _params.getAlgorithmFromOid)(type === 'public' ? decoded.algorithm.algorithm : decoded.privateKeyAlgorithm.algorithm, _params.default.publicKeyAlgorithms);

            if (!(keyTypes.length < 1)) {
              _context2.next = 17;
              break;
            }

            throw new Error('UnsupportedKey');

          case 17:
            if (!(keyTypes[0] === 'EC')) {
              _context2.next = 21;
              break;
            }

            return _context2.abrupt("return", asn1ec.toJWK(decoded, type));

          case 21:
            if (!(keyTypes[0] === 'RSA')) {
              _context2.next = 25;
              break;
            }

            return _context2.abrupt("return", asn1rsa.toJwk(decoded, type));

          case 25:
            throw new Error('InvalidKeyType');

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _toJwk.apply(this, arguments);
}