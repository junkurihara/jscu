"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compute = compute;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireDefault(require("./params.js"));

var util = _interopRequireWildcard(require("./util.js"));

var _index = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-hmac/dist/index.js"));

/**
 * hkdf.js
 */

/**
 * Hash-based Key Derivation Function computing from given master secret and salt.
 * If salt is not given, salt would be automatically generated inside.
 * Specification: https://tools.ietf.org/html/rfc5869
 * @param master
 * @param hash
 * @param length
 * @param info
 * @param salt
 * @return {Promise<{key: *, salt: *}>}
 */
function compute(_x) {
  return _compute.apply(this, arguments);
}
/**
 * Naive implementation of RFC5869 in PureJavaScript
 * @param master
 * @param salt
 * @param hash
 * @param info
 * @param length
 * @return {Promise<Uint8Array>}
 */


function _compute() {
  _compute = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(master) {
    var hash,
        length,
        info,
        salt,
        webCrypto,
        key,
        masterObj,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hash = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'SHA-256';
            length = _args.length > 2 && _args[2] !== undefined ? _args[2] : 32;
            info = _args.length > 3 && _args[3] !== undefined ? _args[3] : '';
            salt = _args.length > 4 && _args[4] !== undefined ? _args[4] : null;
            if (!info) info = '';
            webCrypto = util.getWebCrypto(); // web crypto api

            if (salt) {
              _context.next = 10;
              break;
            }

            _context.next = 9;
            return _index.default.getRandomBytes(length);

          case 9:
            salt = _context.sent;

          case 10:
            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.importKey === 'function' && typeof webCrypto.deriveBits === 'function' && typeof window.msCrypto === 'undefined')) {
              _context.next = 28;
              break;
            }

            _context.prev = 11;
            _context.next = 14;
            return webCrypto.subtle.importKey('raw', master, {
              name: 'HKDF'
            }, false, ['deriveKey', 'deriveBits']);

          case 14:
            masterObj = _context.sent;
            _context.next = 17;
            return webCrypto.subtle.deriveBits({
              name: 'HKDF',
              salt: salt,
              info: new Uint8Array(info),
              hash: hash
            }, masterObj, length * 8);

          case 17:
            key = _context.sent;
            key = new Uint8Array(key);
            _context.next = 26;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](11);
            _context.next = 25;
            return rfc5869(master, salt, hash, info, length);

          case 25:
            key = _context.sent;

          case 26:
            _context.next = 31;
            break;

          case 28:
            _context.next = 30;
            return rfc5869(master, salt, hash, info, length);

          case 30:
            key = _context.sent;

          case 31:
            return _context.abrupt("return", {
              key: key,
              salt: salt
            });

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[11, 21]]);
  }));
  return _compute.apply(this, arguments);
}

function rfc5869(_x2, _x3, _x4, _x5, _x6) {
  return _rfc.apply(this, arguments);
}

function _rfc() {
  _rfc = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(master, salt, hash, info, length) {
    var len, prk, t, okm, uintInfo, i, concat;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            len = _params.default.hashes[hash].hashSize; // RFC5869 Step 1 (Extract)

            _context2.next = 3;
            return _index2.default.compute(salt, master, hash);

          case 3:
            prk = _context2.sent;
            // RFC5869 Step 2 (Expand)
            t = new Uint8Array([]);
            okm = new Uint8Array(Math.ceil(length / len) * len);
            uintInfo = new Uint8Array(info);
            i = 0;

          case 8:
            if (!(i < Math.ceil(length / len))) {
              _context2.next = 20;
              break;
            }

            concat = new Uint8Array(t.length + uintInfo.length + 1);
            concat.set(t);
            concat.set(uintInfo, t.length);
            concat.set(new Uint8Array([i + 1]), t.length + uintInfo.length);
            _context2.next = 15;
            return _index2.default.compute(prk, concat, hash);

          case 15:
            t = _context2.sent;
            okm.set(t, len * i);

          case 17:
            i++;
            _context2.next = 8;
            break;

          case 20:
            return _context2.abrupt("return", okm.slice(0, length));

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _rfc.apply(this, arguments);
}