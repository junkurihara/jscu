"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _index = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-ec/dist/index.js"));

var _index3 = _interopRequireDefault(require("js-crypto-hkdf/dist/index.js"));

var _index4 = _interopRequireDefault(require("js-crypto-aes/dist/index.js"));

var _params = _interopRequireDefault(require("./params.js"));

/**
 * pkcec.js
 */
function encrypt(_x, _x2, _x3) {
  return _encrypt.apply(this, arguments);
}

function _encrypt() {
  _encrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(msg, publicKey, _ref) {
    var privateKey, _ref$hash, hash, _ref$encrypt, encrypt, _ref$keyLength, keyLength, _ref$iv, iv, _ref$info, info, sharedSecret, sessionKeySalt, data;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            privateKey = _ref.privateKey, _ref$hash = _ref.hash, hash = _ref$hash === void 0 ? 'SHA-256' : _ref$hash, _ref$encrypt = _ref.encrypt, encrypt = _ref$encrypt === void 0 ? 'AES-GCM' : _ref$encrypt, _ref$keyLength = _ref.keyLength, keyLength = _ref$keyLength === void 0 ? 32 : _ref$keyLength, _ref$iv = _ref.iv, iv = _ref$iv === void 0 ? null : _ref$iv, _ref$info = _ref.info, info = _ref$info === void 0 ? '' : _ref$info;
            _context.next = 3;
            return _index2.default.deriveSecret(publicKey, privateKey);

          case 3:
            sharedSecret = _context.sent;
            _context.next = 6;
            return _index3.default.compute(sharedSecret, hash, keyLength, info);

          case 6:
            sessionKeySalt = _context.sent;
            _context.t0 = encrypt;
            _context.next = _context.t0 === 'AES-GCM' ? 10 : 19;
            break;

          case 10:
            if (iv) {
              _context.next = 16;
              break;
            }

            _context.next = 13;
            return _index.default.getRandomBytes(_params.default.ciphers[encrypt].ivLength);

          case 13:
            _context.t1 = _context.sent;
            _context.next = 17;
            break;

          case 16:
            _context.t1 = iv;

          case 17:
            iv = _context.t1;
            return _context.abrupt("break", 20);

          case 19:
            throw new Error('UnsupportedSessionKeyAlgorithm');

          case 20:
            _context.next = 22;
            return _index4.default.encrypt(msg, sessionKeySalt.key, {
              name: encrypt,
              iv: iv
            });

          case 22:
            data = _context.sent;
            return _context.abrupt("return", {
              data: data,
              salt: sessionKeySalt.salt,
              iv: iv
            });

          case 24:
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
  _regenerator.default.mark(function _callee2(data, privateKey, _ref2) {
    var publicKey, _ref2$hash, hash, _ref2$encrypt, encrypt, _ref2$keyLength, keyLength, _ref2$info, info, _ref2$salt, salt, _ref2$iv, iv, sharedSecret, sessionKeySalt, msg;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            publicKey = _ref2.publicKey, _ref2$hash = _ref2.hash, hash = _ref2$hash === void 0 ? 'SHA-256' : _ref2$hash, _ref2$encrypt = _ref2.encrypt, encrypt = _ref2$encrypt === void 0 ? 'AES-GCM' : _ref2$encrypt, _ref2$keyLength = _ref2.keyLength, keyLength = _ref2$keyLength === void 0 ? 32 : _ref2$keyLength, _ref2$info = _ref2.info, info = _ref2$info === void 0 ? '' : _ref2$info, _ref2$salt = _ref2.salt, salt = _ref2$salt === void 0 ? null : _ref2$salt, _ref2$iv = _ref2.iv, iv = _ref2$iv === void 0 ? null : _ref2$iv;
            _context2.next = 3;
            return _index2.default.deriveSecret(publicKey, privateKey);

          case 3:
            sharedSecret = _context2.sent;
            _context2.next = 6;
            return _index3.default.compute(sharedSecret, hash, keyLength, info, salt);

          case 6:
            sessionKeySalt = _context2.sent;

            if (!(Object.keys(_params.default.ciphers).indexOf(encrypt) >= 0)) {
              _context2.next = 13;
              break;
            }

            _context2.next = 10;
            return _index4.default.decrypt(data, sessionKeySalt.key, {
              name: encrypt,
              iv: iv
            });

          case 10:
            msg = _context2.sent;
            _context2.next = 14;
            break;

          case 13:
            throw new Error('UnsupportedSessionKeyAlgorithm');

          case 14:
            return _context2.abrupt("return", msg);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _decrypt.apply(this, arguments);
}