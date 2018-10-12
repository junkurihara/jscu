"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var util = _interopRequireWildcard(require("./util.js"));

var nodeapi = _interopRequireWildcard(require("./nodeapi.js"));

var webapi = _interopRequireWildcard(require("./webapi.js"));

var _params = _interopRequireDefault(require("./params.js"));

/**
 * aes.js
 */

/**
 * Check if the given algorithm spec is valid.
 * @param name
 * @param iv
 * @param tagLength
 */
function assertAlgorithms(_ref) {
  var name = _ref.name,
      iv = _ref.iv,
      tagLength = _ref.tagLength;
  if (Object.keys(_params.default.ciphers).indexOf(name) < 0) throw new Error('UnsupportedAlgorithm');

  if (_params.default.ciphers[name].ivLength) {
    if (!(iv instanceof Uint8Array)) throw new Error('InvalidArguments');
    if (iv.byteLength < 2 || iv.byteLength > 16) throw new Error('InvalidIVLength');
    if (_params.default.ciphers[name].staticIvLength && _params.default.ciphers[name].ivLength !== iv.byteLength) throw new Error('InvalidIVLength');
  }

  if (_params.default.ciphers[name].tagLength && tagLength) {
    if (!Number.isInteger(tagLength)) throw new Error('InvalidArguments');
    if (tagLength < 4 || tagLength > 16) throw new Error('InvalidTagLength');
  }
}
/**
 * Encrypt with AES
 * @param msg
 * @param key
 * @param name
 * @param iv
 * @param additionalData
 * @param tagLength
 * @return {Promise<Uint8Array>}
 */


function encrypt(_x, _x2, _x3) {
  return _encrypt.apply(this, arguments);
}
/**
 * Decrypt with AES
 * @param data
 * @param key
 * @param name
 * @param iv
 * @param additionalData
 * @param tagLength
 * @return {Promise<Uint8Array>}
 */


function _encrypt() {
  _encrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(msg, key, _ref2) {
    var _ref2$name, name, iv, _ref2$additionalData, additionalData, tagLength, webCrypto, nodeCrypto, native, data;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2$name = _ref2.name, name = _ref2$name === void 0 ? 'AES-GCM' : _ref2$name, iv = _ref2.iv, _ref2$additionalData = _ref2.additionalData, additionalData = _ref2$additionalData === void 0 ? new Uint8Array([]) : _ref2$additionalData, tagLength = _ref2.tagLength;

            if (!(!(msg instanceof Uint8Array) || !(key instanceof Uint8Array))) {
              _context.next = 3;
              break;
            }

            throw new Error('InvalidArguments');

          case 3:
            assertAlgorithms({
              name: name,
              iv: iv,
              tagLength: tagLength
            });
            if (_params.default.ciphers[name].tagLength && !tagLength) tagLength = _params.default.ciphers[name].tagLength;
            _context.next = 7;
            return util.getWebCryptoAll();

          case 7:
            webCrypto = _context.sent;
            _context.next = 10;
            return util.getNodeCrypto();

          case 10:
            nodeCrypto = _context.sent;
            // node crypto
            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function')) {
              _context.next = 18;
              break;
            }

            _context.next = 15;
            return webapi.encrypt(msg, key, {
              name: name,
              iv: iv,
              additionalData: additionalData,
              tagLength: tagLength
            }, webCrypto).catch(function () {
              native = false;
            });

          case 15:
            data = _context.sent;
            _context.next = 19;
            break;

          case 18:
            if (typeof nodeCrypto !== 'undefined') {
              // for node
              try {
                data = nodeapi.encrypt(msg, key, {
                  name: name,
                  iv: iv,
                  additionalData: additionalData,
                  tagLength: tagLength
                }, nodeCrypto);
              } catch (e) {
                native = false;
              }
            } else native = false;

          case 19:
            if (!(native === false)) {
              _context.next = 21;
              break;
            }

            throw new Error('UnsupportedEnvironment');

          case 21:
            return _context.abrupt("return", data);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _encrypt.apply(this, arguments);
}

function decrypt(_x4, _x5, _x6) {
  return _decrypt.apply(this, arguments);
}

function _decrypt() {
  _decrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(data, key, _ref3) {
    var _ref3$name, name, iv, _ref3$additionalData, additionalData, tagLength, webCrypto, nodeCrypto, native, errMsg, msg;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref3$name = _ref3.name, name = _ref3$name === void 0 ? 'AES-GCM' : _ref3$name, iv = _ref3.iv, _ref3$additionalData = _ref3.additionalData, additionalData = _ref3$additionalData === void 0 ? new Uint8Array([]) : _ref3$additionalData, tagLength = _ref3.tagLength;

            if (!(!(data instanceof Uint8Array) || !(key instanceof Uint8Array))) {
              _context2.next = 3;
              break;
            }

            throw new Error('InvalidArguments');

          case 3:
            assertAlgorithms({
              name: name,
              iv: iv,
              tagLength: tagLength
            });
            if (_params.default.ciphers[name].tagLength && !tagLength) tagLength = _params.default.ciphers[name].tagLength;
            _context2.next = 7;
            return util.getWebCryptoAll();

          case 7:
            webCrypto = _context2.sent;
            _context2.next = 10;
            return util.getNodeCrypto();

          case 10:
            nodeCrypto = _context2.sent;
            // node crypto
            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.encrypt === 'function')) {
              _context2.next = 18;
              break;
            }

            _context2.next = 15;
            return webapi.decrypt(data, key, {
              name: name,
              iv: iv,
              additionalData: additionalData,
              tagLength: tagLength
            }, webCrypto).catch(function (e) {
              native = false;
              errMsg = e.message;
            });

          case 15:
            msg = _context2.sent;
            _context2.next = 19;
            break;

          case 18:
            if (typeof nodeCrypto !== 'undefined') {
              try {
                msg = nodeapi.decrypt(data, key, {
                  name: name,
                  iv: iv,
                  additionalData: additionalData,
                  tagLength: tagLength
                }, nodeCrypto);
              } catch (e) {
                native = false;
                errMsg = e.message;
              }
            }

          case 19:
            if (!(native === false)) {
              _context2.next = 25;
              break;
            }

            if (!errMsg) {
              _context2.next = 24;
              break;
            }

            throw new Error(errMsg);

          case 24:
            throw new Error('UnsupportedEnvironment');

          case 25:
            return _context2.abrupt("return", msg);

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _decrypt.apply(this, arguments);
}