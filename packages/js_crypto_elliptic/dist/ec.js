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
 * @param privateJwk
 * @param hash
 * @param signatureFormat
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
        errMsg,
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
            return webapi.generateKey(namedCurve, webCrypto).catch(function (e) {
              errMsg = e.message;
              native = false;
            });

          case 8:
            keyPair = _context.sent;
            _context.next = 25;
            break;

          case 11:
            if (!(typeof nodeCrypto !== 'undefined')) {
              _context.next = 24;
              break;
            }

            _context.prev = 12;
            _context.next = 15;
            return nodeapi.generateKey(namedCurve, nodeCrypto);

          case 15:
            keyPair = _context.sent;
            _context.next = 22;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](12);
            errMsg = _context.t0.message;
            native = false;

          case 22:
            _context.next = 25;
            break;

          case 24:
            native = false;

          case 25:
            if (!(native === false)) {
              _context.next = 36;
              break;
            }

            _context.prev = 26;
            _context.next = 29;
            return purejs.generateKey(namedCurve);

          case 29:
            keyPair = _context.sent;
            _context.next = 36;
            break;

          case 32:
            _context.prev = 32;
            _context.t1 = _context["catch"](26);
            errMsg = "".concat(errMsg, " => ").concat(_context.t1.message);
            throw new Error("UnsupportedEnvironment: ".concat(errMsg));

          case 36:
            return _context.abrupt("return", keyPair);

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[12, 18], [26, 32]]);
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
 * @param signatureFormat
 * @return {Promise<*>}
 */


function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(msg, privateJwk) {
    var hash,
        signatureFormat,
        webCrypto,
        nodeCrypto,
        native,
        errMsg,
        signature,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hash = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'SHA-256';
            signatureFormat = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : 'raw';

            if (!(signatureFormat !== 'raw' && signatureFormat !== 'der')) {
              _context2.next = 4;
              break;
            }

            throw new Error('InvalidSignatureFormat');

          case 4:
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function')) {
              _context2.next = 13;
              break;
            }

            _context2.next = 10;
            return webapi.sign(msg, privateJwk, hash, signatureFormat, webCrypto).catch(function (e) {
              errMsg = e.message;
              native = false;
            });

          case 10:
            signature = _context2.sent;
            _context2.next = 27;
            break;

          case 13:
            if (!(typeof nodeCrypto !== 'undefined')) {
              _context2.next = 26;
              break;
            }

            _context2.prev = 14;
            _context2.next = 17;
            return nodeapi.sign(msg, privateJwk, hash, signatureFormat, nodeCrypto);

          case 17:
            signature = _context2.sent;
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](14);
            errMsg = _context2.t0.message;
            native = false;

          case 24:
            _context2.next = 27;
            break;

          case 26:
            native = false;

          case 27:
            if (!(native === false)) {
              _context2.next = 38;
              break;
            }

            _context2.prev = 28;
            _context2.next = 31;
            return purejs.sign(msg, privateJwk, hash, signatureFormat);

          case 31:
            signature = _context2.sent;
            _context2.next = 38;
            break;

          case 34:
            _context2.prev = 34;
            _context2.t1 = _context2["catch"](28);
            errMsg = "".concat(errMsg, " => ").concat(_context2.t1.message);
            throw new Error("UnsupportedEnvironment: ".concat(errMsg));

          case 38:
            return _context2.abrupt("return", signature);

          case 39:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[14, 20], [28, 34]]);
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
        signatureFormat,
        webCrypto,
        nodeCrypto,
        native,
        errMsg,
        valid,
        _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            hash = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 'SHA-256';
            signatureFormat = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : 'raw';

            if (!(signatureFormat !== 'raw' && signatureFormat !== 'der')) {
              _context3.next = 4;
              break;
            }

            throw new Error('InvalidSignatureFormat');

          case 4:
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.verify === 'function')) {
              _context3.next = 13;
              break;
            }

            _context3.next = 10;
            return webapi.verify(msg, signature, publicJwk, hash, signatureFormat, webCrypto).catch(function (e) {
              errMsg = e.message;
              native = false;
            });

          case 10:
            valid = _context3.sent;
            _context3.next = 27;
            break;

          case 13:
            if (!(typeof nodeCrypto !== 'undefined')) {
              _context3.next = 26;
              break;
            }

            _context3.prev = 14;
            _context3.next = 17;
            return nodeapi.verify(msg, signature, publicJwk, hash, signatureFormat, nodeCrypto);

          case 17:
            valid = _context3.sent;
            _context3.next = 24;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3["catch"](14);
            errMsg = _context3.t0.message;
            native = false;

          case 24:
            _context3.next = 27;
            break;

          case 26:
            native = false;

          case 27:
            if (!(native === false)) {
              _context3.next = 38;
              break;
            }

            _context3.prev = 28;
            _context3.next = 31;
            return purejs.verify(msg, signature, publicJwk, hash, signatureFormat);

          case 31:
            valid = _context3.sent;
            _context3.next = 38;
            break;

          case 34:
            _context3.prev = 34;
            _context3.t1 = _context3["catch"](28);
            errMsg = "".concat(errMsg, " => ").concat(_context3.t1.message);
            throw new Error("UnsupportedEnvironment: ".concat(errMsg));

          case 38:
            return _context3.abrupt("return", valid);

          case 39:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[14, 20], [28, 34]]);
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
    var webCrypto, nodeCrypto, native, errMsg, secret;
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
            return webapi.deriveSecret(publicJwk, privateJwk, webCrypto).catch(function (e) {
              errMsg = e.message;
              native = false;
            });

          case 8:
            secret = _context4.sent;
            _context4.next = 25;
            break;

          case 11:
            if (!(typeof nodeCrypto !== 'undefined')) {
              _context4.next = 24;
              break;
            }

            _context4.prev = 12;
            _context4.next = 15;
            return nodeapi.deriveSecret(publicJwk, privateJwk, nodeCrypto);

          case 15:
            secret = _context4.sent;
            _context4.next = 22;
            break;

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](12);
            errMsg = _context4.t0.message;
            native = false;

          case 22:
            _context4.next = 25;
            break;

          case 24:
            native = false;

          case 25:
            if (!(native === false)) {
              _context4.next = 36;
              break;
            }

            _context4.prev = 26;
            _context4.next = 29;
            return purejs.deriveSecret(publicJwk, privateJwk);

          case 29:
            secret = _context4.sent;
            _context4.next = 36;
            break;

          case 32:
            _context4.prev = 32;
            _context4.t1 = _context4["catch"](26);
            errMsg = "".concat(errMsg, " => ").concat(_context4.t1.message);
            throw new Error("UnsupportedEnvironment: ".concat(errMsg));

          case 36:
            return _context4.abrupt("return", secret);

          case 37:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[12, 18], [26, 32]]);
  }));
  return _deriveSecret.apply(this, arguments);
}