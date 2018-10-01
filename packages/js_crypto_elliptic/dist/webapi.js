"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateKey = generateKey;
exports.sign = sign;
exports.verify = verify;
exports.deriveSecret = deriveSecret;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

/**
 * webapi.js
 */
function generateKey(_x, _x2) {
  return _generateKey.apply(this, arguments);
}

function _generateKey() {
  _generateKey = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(namedCurve, webCrypto) {
    var keys, publicKey, privateKey;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return webCrypto.generateKey({
              name: 'ECDSA',
              namedCurve: namedCurve,
              hash: {
                name: 'SHA-256'
              }
            }, true, ['sign', 'verify']);

          case 2:
            keys = _context.sent;
            _context.next = 5;
            return webCrypto.exportKey('jwk', keys.publicKey);

          case 5:
            publicKey = _context.sent;
            _context.next = 8;
            return webCrypto.exportKey('jwk', keys.privateKey);

          case 8:
            privateKey = _context.sent;
            // delete optional entries to export as general ecdsa/ecdh key
            ['key_ops', 'alg', 'ext'].forEach(function (elem) {
              delete publicKey[elem];
              delete privateKey[elem];
            });
            return _context.abrupt("return", {
              publicKey: publicKey,
              privateKey: privateKey
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _generateKey.apply(this, arguments);
}

function sign(_x3, _x4, _x5, _x6) {
  return _sign.apply(this, arguments);
}

function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(msg, privateJwk, hash, webCrypto) {
    var algo, key, signature;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            algo = {
              name: 'ECDSA',
              namedCurve: privateJwk.crv,
              hash: {
                name: hash
              }
            };
            _context2.next = 3;
            return webCrypto.importKey('jwk', privateJwk, algo, false, ['sign']);

          case 3:
            key = _context2.sent;
            _context2.next = 6;
            return webCrypto.sign(algo, key, msg);

          case 6:
            signature = _context2.sent;
            return _context2.abrupt("return", new Uint8Array(signature));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _sign.apply(this, arguments);
}

function verify(_x7, _x8, _x9, _x10, _x11) {
  return _verify.apply(this, arguments);
}

function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(msg, signature, publicJwk, hash, webCrypto) {
    var algo, key;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            algo = {
              name: 'ECDSA',
              namedCurve: publicJwk.crv,
              hash: {
                name: hash
              }
            };
            _context3.next = 3;
            return webCrypto.importKey('jwk', publicJwk, algo, false, ['verify']);

          case 3:
            key = _context3.sent;
            _context3.next = 6;
            return webCrypto.verify(algo, key, signature, msg);

          case 6:
            return _context3.abrupt("return", _context3.sent);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _verify.apply(this, arguments);
}

function deriveSecret(_x12, _x13, _x14) {
  return _deriveSecret.apply(this, arguments);
}

function _deriveSecret() {
  _deriveSecret = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(publicJwk, privateJwk, webCrypto) {
    var algo, privateKey, publicKey, bitLen;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            algo = {
              name: 'ECDH',
              namedCurve: privateJwk.crv
            };
            _context4.next = 3;
            return webCrypto.importKey('jwk', privateJwk, algo, false, ['deriveBits']);

          case 3:
            privateKey = _context4.sent;
            _context4.next = 6;
            return webCrypto.importKey('jwk', publicJwk, algo, false, []);

          case 6:
            publicKey = _context4.sent;

            bitLen = function bitLen() {
              var arr = _jsEncodingUtils.default.encoder.decodeBase64Url(privateJwk.x);

              return 8 * arr.length;
            };

            _context4.t0 = Uint8Array;
            _context4.next = 11;
            return webCrypto.deriveBits(Object.assign(algo, {
              public: publicKey
            }), privateKey, bitLen());

          case 11:
            _context4.t1 = _context4.sent;
            return _context4.abrupt("return", new _context4.t0(_context4.t1));

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _deriveSecret.apply(this, arguments);
}