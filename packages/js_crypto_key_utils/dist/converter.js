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
 * @param options
  * For EC JWK : options.compact = true or false
  * For EC JWK with output = 'oct' : options.format = 'binary' or 'string'
  * For both: outputPublic (optional) : boolean. derived key type. from private key, public key can be derived when true.
 * @return {Uint8Array}
 */
function fromJwkTo() {
  return _fromJwkTo.apply(this, arguments);
}
/**
 * Convert ASN.1 encoded (for RSA and EC) or octet formed (for EC) keys to JWK.
 * @param input
 * @param key
 * @param options
 * type (optional) derived key type. from private key, public key can be derived.
 * @return {*}
 */


function _fromJwkTo() {
  _fromJwkTo = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var output,
        jwkey,
        options,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            output = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'pem';
            jwkey = _args.length > 1 ? _args[1] : undefined;
            options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};

            if (!(['pem', 'der', 'oct'].indexOf(output) < 0)) {
              _context.next = 5;
              break;
            }

            throw new Error('InvalidOutputForm');

          case 5:
            if (!((0, _typeof2.default)(jwkey) !== 'object')) {
              _context.next = 7;
              break;
            }

            throw new Error('InvalidJWKAsObject');

          case 7:
            if (!(jwkey.kty !== 'EC' && jwkey.kty !== 'RSA')) {
              _context.next = 9;
              break;
            }

            throw new Error('UnsupportedKeyType');

          case 9:
            if (!(typeof options.outputPublic !== 'undefined' && typeof options.outputPublic !== 'boolean')) {
              _context.next = 11;
              break;
            }

            throw new Error('outputPublicMustBeBoolean');

          case 11:
            // default values
            if (jwkey.key === 'EC' && typeof options.compact !== 'boolean') options.compact = false;
            if (output === 'oct' && options.format !== 'string') options.format = 'binary';
            if ((output === 'der' || output === 'pem') && typeof options.passphrase === 'undefined') options.passphrase = ''; // In the case of PEM/DER

            if (!(output === 'der' || output === 'pem')) {
              _context.next = 20;
              break;
            }

            _context.next = 17;
            return asn1enc.fromJwk(jwkey, output, {
              outputPublic: options.outputPublic,
              compact: options.compact,
              passphrase: options.passphrase,
              encOptions: options.encOptions
            });

          case 17:
            return _context.abrupt("return", _context.sent);

          case 20:
            if (!(output === 'oct' && jwkey.kty === 'EC')) {
              _context.next = 24;
              break;
            }

            return _context.abrupt("return", octenc.fromJwk(jwkey, {
              outputPublic: options.outputPublic,
              outputFormat: options.format,
              compact: options.compact
            }));

          case 24:
            throw new Error('UnsupportedConversion');

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _fromJwkTo.apply(this, arguments);
}

function toJwkFrom(_x, _x2) {
  return _toJwkFrom.apply(this, arguments);
}

function _toJwkFrom() {
  _toJwkFrom = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(input, key) {
    var options,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};

            if (!(['pem', 'der', 'oct'].indexOf(input) < 0)) {
              _context2.next = 3;
              break;
            }

            throw new Error('InvalidInputForm');

          case 3:
            if (!(input === 'oct' && !options.namedCurve)) {
              _context2.next = 5;
              break;
            }

            throw new Error('InappropriateOptions');

          case 5:
            if (!(typeof options.outputPublic !== 'undefined' && typeof options.outputPublic !== 'boolean')) {
              _context2.next = 7;
              break;
            }

            throw new Error('outputPublicMustBeBoolean');

          case 7:
            // default values
            if ((input === 'der' || input === 'pem') && typeof options.passphrase === 'undefined') options.passphrase = ''; // In the case of PEM

            if (!(input === 'der' || input === 'pem')) {
              _context2.next = 14;
              break;
            }

            _context2.next = 11;
            return asn1enc.toJwk(key, input, {
              outputPublic: options.outputPublic,
              passphrase: options.passphrase
            });

          case 11:
            return _context2.abrupt("return", _context2.sent);

          case 14:
            if (!(input === 'oct')) {
              _context2.next = 18;
              break;
            }

            return _context2.abrupt("return", octenc.toJwk(key, options.namedCurve, {
              oubputPublic: options.outputPublic
            }));

          case 18:
            throw new Error('UnsupportedConversion');

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _toJwkFrom.apply(this, arguments);
}