"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJwkTo = fromJwkTo;
exports.toJwkFrom = toJwkFrom;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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
  return _fromJwkTo.apply(this, arguments);
}
/**
 * Convert ASN.1 encoded (for RSA and EC) or octet formed (for EC) keys to JWK.
 * @param input
 * @param key
 * @param type
 * @param options
 * @return {*}
 */


function _fromJwkTo() {
  _fromJwkTo = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var output,
        jwkey,
        type,
        options,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            output = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'pem';
            jwkey = _args.length > 1 ? _args[1] : undefined;
            type = _args.length > 2 ? _args[2] : undefined;
            options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};

            if (!(['pem', 'der', 'oct'].indexOf(output) < 0)) {
              _context.next = 6;
              break;
            }

            throw new Error('InvalidOutputForm');

          case 6:
            if (!(type !== 'public' && type !== 'private')) {
              _context.next = 8;
              break;
            }

            throw new Error('InvalidKeyType');

          case 8:
            if (!((0, _typeof2.default)(jwkey) !== 'object')) {
              _context.next = 10;
              break;
            }

            throw new Error('InvalidJWKAsObject');

          case 10:
            if (!(jwkey.kty !== 'EC' && jwkey.kty !== 'RSA')) {
              _context.next = 12;
              break;
            }

            throw new Error('UnsupportedKeyType');

          case 12:
            // default values
            if (jwkey.key === 'EC' && typeof options.compact !== 'boolean') options.compact = false;
            if (output === 'oct' && options.format !== 'string') options.format = 'binary';
            if ((output === 'der' || output === 'pem') && typeof options.passphrase === 'undefined') options.passphrase = ''; // In the case of PEM/DER

            if (!(output === 'der' || output === 'pem')) {
              _context.next = 21;
              break;
            }

            _context.next = 18;
            return asn1enc.fromJwk(jwkey, {
              type: type,
              format: output,
              compact: options.compact,
              passphrase: options.passphrase,
              encOptions: options.encOptions
            });

          case 18:
            return _context.abrupt("return", _context.sent);

          case 21:
            if (!(output === 'oct' && jwkey.kty === 'EC')) {
              _context.next = 25;
              break;
            }

            return _context.abrupt("return", octenc.fromJwk(jwkey, type, options.format, options.compact));

          case 25:
            throw new Error('UnsupportedEnvironment');

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _fromJwkTo.apply(this, arguments);
}

function toJwkFrom(_x, _x2, _x3) {
  return _toJwkFrom.apply(this, arguments);
}

function _toJwkFrom() {
  _toJwkFrom = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(input, key, type) {
    var options,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};

            if (!(['pem', 'der', 'oct'].indexOf(input) < 0)) {
              _context2.next = 3;
              break;
            }

            throw new Error('InvalidInputForm');

          case 3:
            if (!(type !== 'public' && type !== 'private')) {
              _context2.next = 5;
              break;
            }

            throw new Error('InvalidKeyType');

          case 5:
            if (!(input === 'oct' && !options.namedCurve)) {
              _context2.next = 7;
              break;
            }

            throw new Error('InappropriateOptions');

          case 7:
            // default values
            if (input === 'oct' && options.format !== 'string') options.format = 'binary';
            if ((input === 'der' || input === 'pem') && typeof options.passphrase === 'undefined') options.passphrase = ''; // In the case of PEM

            if (!(input === 'der' || input === 'pem')) {
              _context2.next = 15;
              break;
            }

            _context2.next = 12;
            return asn1enc.toJwk(key, {
              type: type,
              format: input,
              passphrase: options.passphrase
            });

          case 12:
            return _context2.abrupt("return", _context2.sent);

          case 15:
            if (!(input === 'oct')) {
              _context2.next = 19;
              break;
            }

            return _context2.abrupt("return", octenc.toJwk(key, type, options.namedCurve, options.format));

          case 19:
            throw new Error('UnsupportedEnvironment');

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _toJwkFrom.apply(this, arguments);
}