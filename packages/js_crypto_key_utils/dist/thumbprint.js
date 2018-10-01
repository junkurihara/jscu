"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJwkThumbprint = getJwkThumbprint;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _index = _interopRequireDefault(require("js-crypto-hash/dist/index.js"));

var _buffer = _interopRequireDefault(require("buffer"));

/**
 * thumbprint.js
 */
var Buffer = _buffer.default.Buffer;
/**
 * Compute jwk public key thumprint specified in RFC7638
 * https://tools.ietf.org/html/rfc7638
 * @param jwkey
 * @param alg
 * @param output
 * @return {Promise<*>}
 */

function getJwkThumbprint(_x) {
  return _getJwkThumbprint.apply(this, arguments);
}

function _getJwkThumbprint() {
  _getJwkThumbprint = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(jwkey) {
    var alg,
        output,
        jsonString,
        uint8json,
        thumbPrintBuf,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            alg = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'SHA-256';
            output = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'array';

            if (!(['hex', 'array'].indexOf(output) < 0)) {
              _context.next = 4;
              break;
            }

            throw new Error('UnsupportedOutputFormat');

          case 4:
            if (!(jwkey.kty === 'EC')) {
              _context.next = 8;
              break;
            }

            jsonString = JSON.stringify({
              crv: jwkey.crv,
              kty: jwkey.kty,
              x: jwkey.x,
              y: jwkey.y
            });
            _context.next = 13;
            break;

          case 8:
            if (!(jwkey.kty === 'RSA')) {
              _context.next = 12;
              break;
            }

            jsonString = JSON.stringify({
              e: jwkey.e,
              kty: jwkey.kty,
              n: jwkey.n
            });
            _context.next = 13;
            break;

          case 12:
            throw new Error('UnsupportedKeyType');

          case 13:
            uint8json = new Uint8Array(Buffer.from(jsonString, 'utf8'));
            _context.next = 16;
            return _index.default.compute(uint8json, alg);

          case 16:
            thumbPrintBuf = _context.sent;

            if (!(output === 'hex')) {
              _context.next = 21;
              break;
            }

            return _context.abrupt("return", _jsEncodingUtils.default.encoder.arrayBufferToHexString(thumbPrintBuf));

          case 21:
            if (!(output === 'array')) {
              _context.next = 23;
              break;
            }

            return _context.abrupt("return", thumbPrintBuf);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getJwkThumbprint.apply(this, arguments);
}