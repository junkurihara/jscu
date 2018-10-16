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

var _rfc = require("./rfc8018.js");

var _util = require("./util.js");

/**
 * asn1enc.js
 */
var Buffer = _buffer.default.Buffer;
/**
 * Convert jwk to spki/pkcs8 in string or binary format.
 * @param jwkey
 * @param outputPublic {boolean} : derive public key from private key when true
 * @param format {string} : 'pem' or 'der'
 * @param compact {boolean} : 'true' or 'false' for EC public key compressed representation in der/pem
 * @param passphrase
 * @param encOptions
 * @return {Uint8Array}
 */

function fromJwk(_x, _x2, _x3) {
  return _fromJwk.apply(this, arguments);
}
/**
 * Convert spki/pkcs8 key in string or binary format to jwk.
 * @param key
 * @param format
 * @param outputPublic {boolean} (optional)
 * @param passphrase
 * @return {*|void}
 */


function _fromJwk() {
  _fromJwk = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(jwkey, format, _ref) {
    var outputPublic, _ref$compact, compact, _ref$passphrase, passphrase, encOptions, orgType, type, decoded, binKey;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            outputPublic = _ref.outputPublic, _ref$compact = _ref.compact, compact = _ref$compact === void 0 ? false : _ref$compact, _ref$passphrase = _ref.passphrase, passphrase = _ref$passphrase === void 0 ? '' : _ref$passphrase, encOptions = _ref.encOptions;
            orgType = (0, _util.getJwkType)(jwkey);
            type = typeof outputPublic === 'boolean' && outputPublic ? 'public' : orgType;

            if (jwkey.kty === 'EC') {
              decoded = asn1ec.fromJWK(jwkey, type, compact);
            } else if (jwkey.kty === 'RSA') {
              decoded = asn1rsa.fromJwk(jwkey, type);
            }

            if (!(type === 'public')) {
              _context.next = 8;
              break;
            }

            binKey = _asn1def.SubjectPublicKeyInfo.encode(decoded, 'der');
            _context.next = 14;
            break;

          case 8:
            binKey = _asn1def.OneAsymmetricKey.encode(decoded, 'der');

            if (!(passphrase.length > 0)) {
              _context.next = 14;
              break;
            }

            _context.next = 12;
            return (0, _rfc.encryptEncryptedPrivateKeyInfo)(binKey, passphrase, encOptions);

          case 12:
            binKey = _context.sent;
            type = 'encryptedPrivate';

          case 14:
            binKey = new Uint8Array(binKey);
            return _context.abrupt("return", format === 'pem' ? _jsEncodingUtils.default.formatter.binToPem(binKey, type) : binKey);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _fromJwk.apply(this, arguments);
}

function toJwk(_x4, _x5, _x6) {
  return _toJwk.apply(this, arguments);
}

function _toJwk() {
  _toJwk = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(key, format, _ref2) {
    var outputPublic, passphrase, binKey, decoded, type, keyTypes;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            outputPublic = _ref2.outputPublic, passphrase = _ref2.passphrase;
            // Peel the pem strings
            binKey = format === 'pem' ? _jsEncodingUtils.default.formatter.pemToBin(key) : key; // decode binary spki/pkcs8-formatted key to parsed object

            _context2.prev = 2;
            decoded = _asn1def.KeyStructure.decode(Buffer.from(binKey), 'der');
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](2);
            throw new Error('FailedToDecodeKey');

          case 9:
            if (!(decoded.type === 'subjectPublicKeyInfo')) {
              _context2.next = 14;
              break;
            }

            type = 'public';
            decoded = decoded.value;
            _context2.next = 26;
            break;

          case 14:
            type = typeof outputPublic === 'boolean' && outputPublic ? 'public' : 'private';

            if (!(decoded.type === 'encryptedPrivateKeyInfo')) {
              _context2.next = 21;
              break;
            }

            _context2.next = 18;
            return (0, _rfc.decryptEncryptedPrivateKeyInfo)(decoded.value, passphrase);

          case 18:
            decoded = _context2.sent;
            _context2.next = 26;
            break;

          case 21:
            if (!(decoded.type === 'oneAsymmetricKey')) {
              _context2.next = 25;
              break;
            }

            decoded = decoded.value;
            _context2.next = 26;
            break;

          case 25:
            throw new Error('UnsupportedKeyStructure');

          case 26:
            keyTypes = (0, _params.getAlgorithmFromOid)(type === 'public' ? decoded.algorithm.algorithm : decoded.privateKeyAlgorithm.algorithm, _params.default.publicKeyAlgorithms);

            if (!(keyTypes.length < 1)) {
              _context2.next = 29;
              break;
            }

            throw new Error('UnsupportedKey');

          case 29:
            if (!(keyTypes[0] === 'EC')) {
              _context2.next = 33;
              break;
            }

            return _context2.abrupt("return", asn1ec.toJWK(decoded, type));

          case 33:
            if (!(keyTypes[0] === 'RSA')) {
              _context2.next = 37;
              break;
            }

            return _context2.abrupt("return", asn1rsa.toJwk(decoded, type));

          case 37:
            throw new Error('InvalidKeyType');

          case 38:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 6]]);
  }));
  return _toJwk.apply(this, arguments);
}