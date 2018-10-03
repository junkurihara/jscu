"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwkToPem = jwkToPem;
exports.pemToJwk = pemToJwk;
exports.getJwkThumbprint = getJwkThumbprint;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _index = _interopRequireDefault(require("js-crypto-key-utils/dist/index.js"));

/**
 * For key conversion between jwk and pem
 * keyutil.mjs
 */

/**
 * convert key in jwk format to pem spki/pkcs8
 * @param jwkey
 * @param type
 * @return {Promise<*|*>}
 */
function jwkToPem(jwkey, type) {
  return _index.default.fromJwkTo('pem', jwkey, type, {
    compact: false
  }); // {compact: false} is just for EC keys (in RSA, will be omitted.)
}
/**
 * convert pem spki/pkcs8 to jwk
 * @param pem
 * @param type
 * @param keyParams
 * @return {Promise<*>}
 */


function pemToJwk(pem, type) {
  return _index.default.toJwkFrom('pem', pem, type);
}
/**
 * get jwk public key thumprint specified in https://tools.ietf.org/html/rfc7638
 * @param jwkey {Object}
 * @param hashAlgo {string}
 * @param output {string}
 * @return {Promise<*>}
 */


function getJwkThumbprint(_x) {
  return _getJwkThumbprint.apply(this, arguments);
}

function _getJwkThumbprint() {
  _getJwkThumbprint = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(jwkey) {
    var hashAlgo,
        output,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hashAlgo = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'SHA-256';
            output = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'binary';
            _context.next = 4;
            return _index.default.getJwkThumbprint(jwkey, hashAlgo, output);

          case 4:
            return _context.abrupt("return", _context.sent);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getJwkThumbprint.apply(this, arguments);
}