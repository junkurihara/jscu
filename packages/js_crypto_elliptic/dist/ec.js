"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var util = _interopRequireWildcard(require("./util.js"));

var webapi = _interopRequireWildcard(require("./webapi.js"));

var nodeapi = _interopRequireWildcard(require("./nodeapi.js"));

var purejs = _interopRequireWildcard(require("./purejs.js"));

/**
 * ec.js
 */

/**
 * Generate elliptic curve cryptography public/private key pair
 * @param namedCurve
 * @return {Promise<void>}
 */
function generateKey() {
  return _generateKey.apply(this, arguments);
}
/**
 * Sign message with ECDSA
 * @param msg
 * @param privateJWK
 * @param hash
 * @return {Promise<*>}
 */


function _generateKey() {
  _generateKey = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var namedCurve,
        webCrypto,
        nodeCrypto,
        native,
        keyPair,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            namedCurve = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'P-256';
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;
            keyPair = {};

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.generateKey === 'function' && typeof webCrypto.exportKey === 'function')) {
              _context.next = 11;
              break;
            }

            _context.next = 8;
            return webapi.generateKey(namedCurve, webCrypto).catch(function () {
              native = false;
            });

          case 8:
            keyPair = _context.sent;
            _context.next = 12;
            break;

          case 11:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                keyPair = nodeapi.generateKey(namedCurve, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 12:
            if (!(native === false)) {
              _context.next = 22;
              break;
            }

            _context.prev = 13;
            _context.next = 16;
            return purejs.generateKey(namedCurve);

          case 16:
            keyPair = _context.sent;
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](13);
            throw new Error('UnsupportedEnvironment');

          case 22:
            return _context.abrupt("return", keyPair);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[13, 19]]);
  }));
  return _generateKey.apply(this, arguments);
}

function sign(_x, _x2) {
  return _sign.apply(this, arguments);
}
/**
 * Verify signature with ECDSA
 * @param msg
 * @param signature
 * @param publicJwk
 * @param hash
 * @return {Promise<*>}
 */


function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(msg, privateJwk) {
    var hash,
        webCrypto,
        nodeCrypto,
        native,
        signature,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hash = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'SHA-256';
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function')) {
              _context2.next = 10;
              break;
            }

            _context2.next = 7;
            return webapi.sign(msg, privateJwk, hash, webCrypto).catch(function () {
              native = false;
            });

          case 7:
            signature = _context2.sent;
            _context2.next = 11;
            break;

          case 10:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                signature = nodeapi.sign(msg, privateJwk, hash, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 11:
            if (!(native === false)) {
              _context2.next = 21;
              break;
            }

            _context2.prev = 12;
            _context2.next = 15;
            return purejs.sign(msg, privateJwk, hash);

          case 15:
            signature = _context2.sent;
            _context2.next = 21;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](12);
            throw new Error('UnsupportedEnvironment');

          case 21:
            return _context2.abrupt("return", signature);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[12, 18]]);
  }));
  return _sign.apply(this, arguments);
}

function verify(_x3, _x4, _x5) {
  return _verify.apply(this, arguments);
}
/**
 * Derive shared secret from my private key and destination's public key.
 * **NOTE** We SHOULD NOT use the derived secret as an encryption key directly.
 * We should employ an appropriate key derivation procedure like HKDF to use the secret for symmetric key encryption.
 * @param publicJwk
 * @param privateJwk
 * @return {Promise<*>}
 */


function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(msg, signature, publicJwk) {
    var hash,
        webCrypto,
        nodeCrypto,
        native,
        valid,
        _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            hash = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 'SHA-256';
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.verify === 'function')) {
              _context3.next = 10;
              break;
            }

            _context3.next = 7;
            return webapi.verify(msg, signature, publicJwk, hash, webCrypto).catch(function () {
              native = false;
            });

          case 7:
            valid = _context3.sent;
            _context3.next = 11;
            break;

          case 10:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                valid = nodeapi.verify(msg, signature, publicJwk, hash, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 11:
            if (!(native === false)) {
              _context3.next = 21;
              break;
            }

            _context3.prev = 12;
            _context3.next = 15;
            return purejs.verify(msg, signature, publicJwk, hash);

          case 15:
            valid = _context3.sent;
            _context3.next = 21;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](12);
            throw new Error('UnsupportedEnvironment');

          case 21:
            return _context3.abrupt("return", valid);

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[12, 18]]);
  }));
  return _verify.apply(this, arguments);
}

function deriveSecret(_x6, _x7) {
  return _deriveSecret.apply(this, arguments);
}

function _deriveSecret() {
  _deriveSecret = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(publicJwk, privateJwk) {
    var webCrypto, nodeCrypto, native, secret;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(publicJwk.crv !== privateJwk.crv)) {
              _context4.next = 2;
              break;
            }

            throw new Error('UnmatchedCurveName');

          case 2:
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.deriveBits === 'function')) {
              _context4.next = 11;
              break;
            }

            _context4.next = 8;
            return webapi.deriveSecret(publicJwk, privateJwk, webCrypto).catch(function () {
              native = false;
            });

          case 8:
            secret = _context4.sent;
            _context4.next = 12;
            break;

          case 11:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                secret = nodeapi.deriveSecret(publicJwk, privateJwk, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 12:
            if (!(native === false)) {
              _context4.next = 20;
              break;
            }

            _context4.prev = 13;
            secret = purejs.deriveSecret(publicJwk, privateJwk);
            _context4.next = 20;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](13);
            throw new Error('UnsupportedEnvironment');

          case 20:
            return _context4.abrupt("return", secret);

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[13, 17]]);
  }));
  return _deriveSecret.apply(this, arguments);
}