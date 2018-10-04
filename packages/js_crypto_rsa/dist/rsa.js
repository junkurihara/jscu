"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateKey = generateKey;
exports.sign = sign;
exports.verify = verify;
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var util = _interopRequireWildcard(require("./util.js"));

var webapi = _interopRequireWildcard(require("./webapi.js"));

var nodeapi = _interopRequireWildcard(require("./nodeapi.js"));

var _params = _interopRequireDefault(require("./params.js"));

var _oaep = require("./oaep.js");

var _pss = require("./pss.js");

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

/**
 * rsa.js
 */

/**
 *
 * @param modulusLength
 * @param publicExponent
 * @return {Promise<void>}
 */
function generateKey() {
  return _generateKey.apply(this, arguments);
}
/**
 *
 * @param msg
 * @param privateJwk
 * @param hash
 * @param algorithm
 * @return {Promise<*>}
 */


function _generateKey() {
  _generateKey = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var modulusLength,
        publicExponent,
        webCrypto,
        nodeCrypto,
        native,
        keyPair,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            modulusLength = _args.length > 0 && _args[0] !== undefined ? _args[0] : 2048;
            publicExponent = _args.length > 1 && _args[1] !== undefined ? _args[1] : new Uint8Array([0x01, 0x00, 0x01]);
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;
            keyPair = {};

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.generateKey === 'function' && typeof webCrypto.exportKey === 'function')) {
              _context.next = 12;
              break;
            }

            _context.next = 9;
            return webapi.generateKey(modulusLength, publicExponent, webCrypto).catch(function () {
              native = false;
            });

          case 9:
            keyPair = _context.sent;
            _context.next = 13;
            break;

          case 12:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                keyPair = nodeapi.generateKey(modulusLength, publicExponent, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 13:
            if (!(native === false)) {
              _context.next = 15;
              break;
            }

            throw new Error('UnsupportedEnvironment');

          case 15:
            return _context.abrupt("return", keyPair);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _generateKey.apply(this, arguments);
}

function sign(_x, _x2) {
  return _sign.apply(this, arguments);
}
/**
 *
 * @param msg
 * @param signature
 * @param publicJwk
 * @param hash
 * @param algorithm
 * @return {Promise<*>}
 */


function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(msg, privateJwk) {
    var hash,
        algorithm,
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
            algorithm = _args2.length > 3 ? _args2[3] : undefined;
            if (typeof algorithm === 'undefined') algorithm = {
              name: 'RSA-PSS',
              saltLength: _params.default.hashes[hash].hashSize
            }; // assertion

            if (!(algorithm.name !== 'RSA-PSS' && algorithm.name !== 'RSASSA-PKCS1-v1_5')) {
              _context2.next = 5;
              break;
            }

            throw new Error('InvalidAlgorithm');

          case 5:
            if (!(Object.keys(_params.default.hashes).indexOf(hash) < 0)) {
              _context2.next = 7;
              break;
            }

            throw new Error('UnsupportedHash');

          case 7:
            if (msg instanceof Uint8Array) {
              _context2.next = 9;
              break;
            }

            throw new Error('InvalidMessageFormat');

          case 9:
            if (!(privateJwk.kty !== 'RSA')) {
              _context2.next = 11;
              break;
            }

            throw new Error('InvalidJwkRsaKey');

          case 11:
            if (algorithm.name === 'RSA-PSS') {
              (0, _pss.checkLength)('sign', {
                k: _jsEncodingUtils.default.encoder.decodeBase64Url(privateJwk.n).length,
                hash: hash,
                saltLength: algorithm.saltLength
              });
            }

            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function')) {
              _context2.next = 21;
              break;
            }

            _context2.next = 18;
            return webapi.sign(msg, privateJwk, hash, algorithm, webCrypto).catch(function () {
              native = false;
            });

          case 18:
            signature = _context2.sent;
            _context2.next = 22;
            break;

          case 21:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                signature = nodeapi.sign(msg, privateJwk, hash, algorithm, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 22:
            if (!(native === false)) {
              _context2.next = 24;
              break;
            }

            throw new Error('UnsupportedEnvironment');

          case 24:
            return _context2.abrupt("return", signature);

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _sign.apply(this, arguments);
}

function verify(_x3, _x4, _x5) {
  return _verify.apply(this, arguments);
}
/**
 *
 * @param msg
 * @param publicJwk
 * @param hash
 * @param label
 * @return {Promise<*>}
 */


function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(msg, signature, publicJwk) {
    var hash,
        algorithm,
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
            algorithm = _args3.length > 4 ? _args3[4] : undefined;
            if (typeof algorithm === 'undefined') algorithm = {
              name: 'RSA-PSS',
              saltLength: _params.default.hashes[hash].hashSize
            }; // assertion

            if (!(algorithm.name !== 'RSA-PSS' && algorithm.name !== 'RSASSA-PKCS1-v1_5')) {
              _context3.next = 5;
              break;
            }

            throw new Error('InvalidAlgorithm');

          case 5:
            if (!(Object.keys(_params.default.hashes).indexOf(hash) < 0)) {
              _context3.next = 7;
              break;
            }

            throw new Error('UnsupportedHash');

          case 7:
            if (signature instanceof Uint8Array) {
              _context3.next = 9;
              break;
            }

            throw new Error('InvalidSignatureFormat');

          case 9:
            if (msg instanceof Uint8Array) {
              _context3.next = 11;
              break;
            }

            throw new Error('InvalidMessageFormat');

          case 11:
            if (!(publicJwk.kty !== 'RSA')) {
              _context3.next = 13;
              break;
            }

            throw new Error('InvalidJwkRsaKey');

          case 13:
            if (algorithm.name === 'RSA-PSS') {
              (0, _pss.checkLength)('verify', {
                k: _jsEncodingUtils.default.encoder.decodeBase64Url(publicJwk.n).length,
                hash: hash,
                saltLength: algorithm.saltLength
              });
            }

            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.verify === 'function')) {
              _context3.next = 23;
              break;
            }

            _context3.next = 20;
            return webapi.verify(msg, signature, publicJwk, hash, algorithm, webCrypto).catch(function () {
              native = false;
            });

          case 20:
            valid = _context3.sent;
            _context3.next = 24;
            break;

          case 23:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                valid = nodeapi.verify(msg, signature, publicJwk, hash, algorithm, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 24:
            if (!(native === false)) {
              _context3.next = 26;
              break;
            }

            throw new Error('UnsupportedEnvironment');

          case 26:
            return _context3.abrupt("return", valid);

          case 27:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _verify.apply(this, arguments);
}

function encrypt(_x6, _x7) {
  return _encrypt.apply(this, arguments);
}
/**
 *
 * @param data
 * @param privateJwk
 * @param hash
 * @param label
 * @return {Promise<*>}
 */


function _encrypt() {
  _encrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(msg, publicJwk) {
    var hash,
        label,
        webCrypto,
        nodeCrypto,
        native,
        encrypted,
        _args4 = arguments;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            hash = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 'SHA-256';
            label = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : new Uint8Array([]);

            if (!(Object.keys(_params.default.hashes).indexOf(hash) < 0)) {
              _context4.next = 4;
              break;
            }

            throw new Error('UnsupportedHash');

          case 4:
            if (msg instanceof Uint8Array) {
              _context4.next = 6;
              break;
            }

            throw new Error('InvalidMessageFormat');

          case 6:
            if (label instanceof Uint8Array) {
              _context4.next = 8;
              break;
            }

            throw new Error('InvalidLabelFormat');

          case 8:
            if (!(publicJwk.kty !== 'RSA')) {
              _context4.next = 10;
              break;
            }

            throw new Error('InvalidJwkRsaKey');

          case 10:
            (0, _oaep.checkLength)('encrypt', {
              k: _jsEncodingUtils.default.encoder.decodeBase64Url(publicJwk.n).length,
              label: label,
              hash: hash,
              mLen: msg.length
            });
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function')) {
              _context4.next = 20;
              break;
            }

            _context4.next = 17;
            return webapi.encrypt(msg, publicJwk, hash, label, webCrypto).catch(function () {
              native = false;
            });

          case 17:
            encrypted = _context4.sent;
            _context4.next = 21;
            break;

          case 20:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                encrypted = nodeapi.encrypt(msg, publicJwk, hash, label, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 21:
            if (!(native === false)) {
              _context4.next = 23;
              break;
            }

            throw new Error('UnsupportedEnvironment');

          case 23:
            return _context4.abrupt("return", encrypted);

          case 24:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _encrypt.apply(this, arguments);
}

function decrypt(_x8, _x9) {
  return _decrypt.apply(this, arguments);
}

function _decrypt() {
  _decrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(data, privateJwk) {
    var hash,
        label,
        webCrypto,
        nodeCrypto,
        native,
        decrypted,
        _args5 = arguments;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            hash = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 'SHA-256';
            label = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : new Uint8Array([]);

            if (!(Object.keys(_params.default.hashes).indexOf(hash) < 0)) {
              _context5.next = 4;
              break;
            }

            throw new Error('UnsupportedHash');

          case 4:
            if (data instanceof Uint8Array) {
              _context5.next = 6;
              break;
            }

            throw new Error('InvalidMessageFormat');

          case 6:
            if (label instanceof Uint8Array) {
              _context5.next = 8;
              break;
            }

            throw new Error('InvalidLabelFormat');

          case 8:
            if (!(privateJwk.kty !== 'RSA')) {
              _context5.next = 10;
              break;
            }

            throw new Error('InvalidJwkRsaKey');

          case 10:
            (0, _oaep.checkLength)('decrypt', {
              k: _jsEncodingUtils.default.encoder.decodeBase64Url(privateJwk.n).length,
              label: label,
              hash: hash,
              cLen: data.length
            });
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // implementation on node.js

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.decrypt === 'function')) {
              _context5.next = 20;
              break;
            }

            _context5.next = 17;
            return webapi.decrypt(data, privateJwk, hash, label, webCrypto).catch(function () {
              native = false;
            });

          case 17:
            decrypted = _context5.sent;
            _context5.next = 21;
            break;

          case 20:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                decrypted = nodeapi.decrypt(data, privateJwk, hash, label, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 21:
            if (!(native === false)) {
              _context5.next = 23;
              break;
            }

            throw new Error('UnsupportedEnvironment');

          case 23:
            return _context5.abrupt("return", decrypted);

          case 24:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _decrypt.apply(this, arguments);
}