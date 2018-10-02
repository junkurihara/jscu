"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAsn1Signature = getAsn1Signature;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireDefault(require("./params.js"));

var _index = _interopRequireDefault(require("js-crypto-ec/dist/index.js"));

var _buffer = _interopRequireDefault(require("buffer"));

/**
 * ec.js
 */
var Buffer = _buffer.default.Buffer;

function getAsn1Signature(_x, _x2, _x3) {
  return _getAsn1Signature.apply(this, arguments);
}

function _getAsn1Signature() {
  _getAsn1Signature = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(encodedTbsCertificate, privateJwk, signatureAlgorithm) {
    var asn1sig;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _index.default.sign(encodedTbsCertificate, privateJwk, _params.default.signatureAlgorithms[signatureAlgorithm].hash, 'der');

          case 2:
            asn1sig = _context.sent;
            return _context.abrupt("return", {
              unused: 0,
              data: Buffer.from(asn1sig)
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getAsn1Signature.apply(this, arguments);
}