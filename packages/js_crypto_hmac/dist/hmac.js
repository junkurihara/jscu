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
}
/**
 * Verify HMAC
 * @param key
 * @param data
 * @param mac
 * @param hash
 * @return {Promise<boolean>}
 */


function _compute() {
  _compute = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(key, data) {
    var hash,
        webCrypto,
        nodeCrypto,
        msCrypto,
        keyObj,
        mac,
        _keyObj,
        _mac,
        f,
        msImportKey,
        msHmac,
        _keyObj2,
        rawPrk,
        _args = arguments;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hash = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'SHA-256';
            webCrypto = util.getWebCrypto(); // web crypto api

            nodeCrypto = util.getNodeCrypto(); // node crypto

            msCrypto = util.getMsCrypto(); // ms crypto

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.sign === 'function')) {
              _context.next = 26;
              break;
            }

            _context.prev = 5;
            _context.next = 8;
            return webCrypto.importKey('raw', key, {
              name: 'HMAC',
              hash: {
                name: hash
              }
            }, false, ['sign', 'verify']);

          case 8:
            keyObj = _context.sent;
            _context.next = 11;
            return webCrypto.sign('HMAC', keyObj, data);

          case 11:
            mac = _context.sent;
            return _context.abrupt("return", new Uint8Array(mac));

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](5);
            _context.next = 19;
            return webCrypto.importKey('raw', key, {
              name: 'HMAC',
              hash: {
                name: hash
              }
            }, false, ['sign', 'verify']);

          case 19:
            _keyObj = _context.sent;
            _context.next = 22;
            return webCrypto.sign({
              name: 'HMAC',
              hash: {
                name: hash
              }
            }, _keyObj, data);

          case 22:
            _mac = _context.sent;
            return _context.abrupt("return", new Uint8Array(_mac));

          case 24:
            _context.next = 44;
            break;

          case 26:
            if (!(typeof nodeCrypto !== 'undefined')) {
              _context.next = 31;
              break;
            }

            // for node
            f = nodeCrypto.createHmac(_params.default.hashes[hash].nodeName, key);
            return _context.abrupt("return", new Uint8Array(f.update(data).digest()));

          case 31:
            if (!(typeof msCrypto !== 'undefined' && typeof msCrypto.importKey === 'function' && typeof msCrypto.sign === 'function')) {
              _context.next = 43;
              break;
            }

            // for legacy ie 11
            // function definitions
            msImportKey = function msImportKey(type, key, alg, ext, use) {
              return new Promise(function (resolve) {
                var op = msCrypto.importKey(type, key, alg, ext, use);

                op.oncomplete = function (evt) {
                  resolve(evt.target.result);
                };
              });
            };

            msHmac = function msHmac(hash, k, d) {
              return new Promise(function (resolve) {
                var op = msCrypto.sign({
                  name: 'HMAC',
                  hash: {
                    name: hash
                  }
                }, k, d);

                op.oncomplete = function (evt) {
                  resolve(new Uint8Array(evt.target.result));
                };
              });
            };

            _context.next = 36;
            return msImportKey('raw', key, {
              name: 'HMAC',
              hash: {
                name: hash
              }
            }, false, ['sign', 'verify']);

          case 36:
            _keyObj2 = _context.sent;
            _context.next = 39;
            return msHmac(hash, _keyObj2, data);

          case 39:
            rawPrk = _context.sent;
            return _context.abrupt("return", new Uint8Array(rawPrk));

          case 43:
            throw new Error('UnsupportedEnvironment');

          case 44:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[5, 15]]);
  }));
  return _compute.apply(this, arguments);
}

function verify(_x3, _x4, _x5) {
  return _verify.apply(this, arguments);
}

function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(key, data, mac) {
    var hash,
        newMac,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hash = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : 'SHA-256';

            if (mac instanceof Uint8Array) {
              _context2.next = 3;
              break;
            }

            throw new Error('InvalidInputMac');

          case 3:
            _context2.next = 5;
            return compute(key, data, hash);

          case 5:
            newMac = _context2.sent;
            return _context2.abrupt("return", mac.toString() === newMac.toString());

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _verify.apply(this, arguments);
}