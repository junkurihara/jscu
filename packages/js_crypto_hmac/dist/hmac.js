"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compute = compute;
exports.verify = verify;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireDefault(require("./params.js"));

var util = _interopRequireWildcard(require("./util.js"));

var _index = _interopRequireDefault(require("js-crypto-hash/dist/index.js"));

/**
 * hmac.js
 */

/**
 * Compute keyed hash value
 * @param key
 * @param data
 * @param hash
 * @return {Promise<Uint8Array>}
 */
function compute(_x, _x2) {
  return _compute.apply(this, arguments);
} // RFC 2104 https://tools.ietf.org/html/rfc2104


function _compute() {
  _compute = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(key, data) {
    var hash,
        webCrypto,
        nodeCrypto,
        native,
        keyObj,
        mac,
        msImportKey,
        msHmac,
        _keyObj,
        rawPrk,
        f,
        _args = arguments;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hash = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'SHA-256';
            webCrypto = util.getWebCryptoAll(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // node crypto
            // const msCrypto = util.getMsCrypto(); // ms crypto

            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function')) {
              _context.next = 38;
              break;
            }

            if (!(typeof window.msCrypto === 'undefined')) {
              _context.next = 21;
              break;
            }

            _context.prev = 6;
            _context.next = 9;
            return webCrypto.importKey('raw', key, {
              name: 'HMAC',
              hash: {
                name: hash
              }
            }, false, ['sign', 'verify']);

          case 9:
            keyObj = _context.sent;
            _context.next = 12;
            return webCrypto.sign({
              name: 'HMAC',
              hash: {
                name: hash
              }
            }, keyObj, data);

          case 12:
            mac = _context.sent;
            return _context.abrupt("return", new Uint8Array(mac));

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](6);
            native = false;

          case 19:
            _context.next = 36;
            break;

          case 21:
            _context.prev = 21;

            // function definitions
            msImportKey = function msImportKey(type, key, alg, ext, use) {
              return new Promise(function (resolve, reject) {
                var op = webCrypto.importKey(type, key, alg, ext, use);

                op.oncomplete = function (evt) {
                  resolve(evt.target.result);
                };

                op.onerror = function () {
                  reject('KeyImportingFailed');
                };
              });
            };

            msHmac = function msHmac(hash, k, d) {
              return new Promise(function (resolve, reject) {
                var op = webCrypto.sign({
                  name: 'HMAC',
                  hash: {
                    name: hash
                  }
                }, k, d);

                op.oncomplete = function (evt) {
                  resolve(new Uint8Array(evt.target.result));
                };

                op.onerror = function () {
                  reject('ComputingHMACFailed');
                };
              });
            };

            _context.next = 26;
            return msImportKey('raw', key, {
              name: 'HMAC',
              hash: {
                name: hash
              }
            }, false, ['sign', 'verify']);

          case 26:
            _keyObj = _context.sent;
            _context.next = 29;
            return msHmac(hash, _keyObj, data);

          case 29:
            rawPrk = _context.sent;
            return _context.abrupt("return", new Uint8Array(rawPrk));

          case 33:
            _context.prev = 33;
            _context.t1 = _context["catch"](21);
            native = false;

          case 36:
            _context.next = 50;
            break;

          case 38:
            if (!(typeof nodeCrypto !== 'undefined')) {
              _context.next = 49;
              break;
            }

            _context.prev = 39;
            f = nodeCrypto.createHmac(_params.default.hashes[hash].nodeName, key);
            return _context.abrupt("return", new Uint8Array(f.update(data).digest()));

          case 44:
            _context.prev = 44;
            _context.t2 = _context["catch"](39);
            native = false;

          case 47:
            _context.next = 50;
            break;

          case 49:
            native = false;

          case 50:
            if (native) {
              _context.next = 60;
              break;
            }

            _context.prev = 51;
            _context.next = 54;
            return purejs(key, data, hash);

          case 54:
            return _context.abrupt("return", _context.sent);

          case 57:
            _context.prev = 57;
            _context.t3 = _context["catch"](51);
            throw new Error('UnsupportedEnvironments');

          case 60:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[6, 16], [21, 33], [39, 44], [51, 57]]);
  }));
  return _compute.apply(this, arguments);
}

function purejs(_x3, _x4) {
  return _purejs.apply(this, arguments);
}
/**
 * Verify HMAC
 * @param key
 * @param data
 * @param mac
 * @param hash
 * @return {Promise<boolean>}
 */


function _purejs() {
  _purejs = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(key, data) {
    var hash,
        B,
        L,
        K,
        KxorIpad,
        KxorOpad,
        inner,
        hashedInner,
        outer,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hash = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'SHA-256';
            B = _params.default.hashes[hash].blockSize;
            L = _params.default.hashes[hash].hashSize;

            if (!(key.length > B)) {
              _context2.next = 7;
              break;
            }

            _context2.next = 6;
            return _index.default.compute(key, hash);

          case 6:
            key = _context2.sent;

          case 7:
            K = new Uint8Array(B); // first the array is initialized with 0x00

            K.set(key);
            KxorIpad = K.map(function (k) {
              return 0xFF & (0x36 ^ k);
            });
            KxorOpad = K.map(function (k) {
              return 0xFF & (0x5c ^ k);
            });
            inner = new Uint8Array(B + data.length);
            inner.set(KxorIpad);
            inner.set(data, B);
            _context2.next = 16;
            return _index.default.compute(inner, hash);

          case 16:
            hashedInner = _context2.sent;
            outer = new Uint8Array(B + L);
            outer.set(KxorOpad);
            outer.set(hashedInner, B);
            _context2.next = 22;
            return _index.default.compute(outer, hash);

          case 22:
            return _context2.abrupt("return", _context2.sent);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _purejs.apply(this, arguments);
}

function verify(_x5, _x6, _x7) {
  return _verify.apply(this, arguments);
}

function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(key, data, mac) {
    var hash,
        newMac,
        _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            hash = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 'SHA-256';

            if (mac instanceof Uint8Array) {
              _context3.next = 3;
              break;
            }

            throw new Error('InvalidInputMac');

          case 3:
            _context3.next = 5;
            return compute(key, data, hash);

          case 5:
            newMac = _context3.sent;
            return _context3.abrupt("return", mac.toString() === newMac.toString());

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _verify.apply(this, arguments);
}