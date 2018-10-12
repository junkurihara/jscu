"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/**
 * webapi.js
 */
function encrypt(_x, _x2, _x3, _x4) {
  return _encrypt.apply(this, arguments);
}

function _encrypt() {
  _encrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(msg, key, _ref, webCrypto) {
    var _ref$name, name, iv, additionalData, tagLength, alg, sessionKeyObj, data, _sessionKeyObj, encryptedObj, _data;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref$name = _ref.name, name = _ref$name === void 0 ? 'AES-GCM' : _ref$name, iv = _ref.iv, additionalData = _ref.additionalData, tagLength = _ref.tagLength;
            _context.t0 = name;
            _context.next = _context.t0 === 'AES-GCM' ? 4 : _context.t0 === 'AES-CBC' ? 6 : 8;
            break;

          case 4:
            alg = Object.assign({
              name: name,
              iv: iv,
              tagLength: tagLength * 8
            }, additionalData.length > 0 ? {
              additionalData: additionalData
            } : {});
            return _context.abrupt("break", 9);

          case 6:
            alg = {
              name: name,
              iv: iv
            };
            return _context.abrupt("break", 9);

          case 8:
            throw new Error('UnsupportedCipher');

          case 9:
            if (!(typeof window.msCrypto === 'undefined')) {
              _context.next = 19;
              break;
            }

            _context.next = 12;
            return webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);

          case 12:
            sessionKeyObj = _context.sent;
            _context.next = 15;
            return webCrypto.encrypt(alg, sessionKeyObj, msg);

          case 15:
            data = _context.sent;
            return _context.abrupt("return", new Uint8Array(data));

          case 19:
            _context.next = 21;
            return msImportKey('raw', key, alg, false, ['encrypt', 'decrypt'], webCrypto);

          case 21:
            _sessionKeyObj = _context.sent;
            _context.next = 24;
            return msEncrypt(alg, _sessionKeyObj, msg, webCrypto);

          case 24:
            encryptedObj = _context.sent;

            if (!(name === 'AES-GCM')) {
              _context.next = 32;
              break;
            }

            _data = new Uint8Array(encryptedObj.ciphertext.byteLength + encryptedObj.tag.byteLength);

            _data.set(new Uint8Array(encryptedObj.ciphertext));

            _data.set(new Uint8Array(encryptedObj.tag), encryptedObj.ciphertext.byteLength);

            return _context.abrupt("return", _data);

          case 32:
            return _context.abrupt("return", new Uint8Array(encryptedObj));

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _encrypt.apply(this, arguments);
}

function decrypt(_x5, _x6, _x7, _x8) {
  return _decrypt.apply(this, arguments);
} // function definitions for IE


function _decrypt() {
  _decrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(data, key, _ref2, webCrypto) {
    var _ref2$name, name, iv, additionalData, tagLength, alg, sessionKeyObj, msg, _sessionKeyObj2, ciphertext, tag, _msg, _msg2;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref2$name = _ref2.name, name = _ref2$name === void 0 ? 'AES-GCM' : _ref2$name, iv = _ref2.iv, additionalData = _ref2.additionalData, tagLength = _ref2.tagLength;
            _context2.t0 = name;
            _context2.next = _context2.t0 === 'AES-GCM' ? 4 : _context2.t0 === 'AES-CBC' ? 6 : 8;
            break;

          case 4:
            alg = Object.assign({
              name: name,
              iv: iv,
              tagLength: tagLength * 8
            }, additionalData.length > 0 ? {
              additionalData: additionalData
            } : {});
            return _context2.abrupt("break", 9);

          case 6:
            alg = {
              name: name,
              iv: iv
            };
            return _context2.abrupt("break", 9);

          case 8:
            throw new Error('UnsupportedCipher');

          case 9:
            if (window.msCrypto) {
              _context2.next = 19;
              break;
            }

            _context2.next = 12;
            return webCrypto.importKey('raw', key, alg, false, ['encrypt', 'decrypt']);

          case 12:
            sessionKeyObj = _context2.sent;
            _context2.next = 15;
            return webCrypto.decrypt(alg, sessionKeyObj, data).catch(function () {
              throw new Error('DecryptionFailure');
            });

          case 15:
            msg = _context2.sent;
            return _context2.abrupt("return", new Uint8Array(msg));

          case 19:
            _context2.next = 21;
            return msImportKey('raw', key, alg, false, ['encrypt', 'decrypt'], webCrypto);

          case 21:
            _sessionKeyObj2 = _context2.sent;

            if (!(name === 'AES-GCM')) {
              _context2.next = 31;
              break;
            }

            ciphertext = data.slice(0, data.length - tagLength);
            tag = data.slice(data.length - tagLength, data.length);
            _context2.next = 27;
            return msDecrypt(Object.assign(alg, {
              tag: tag
            }), _sessionKeyObj2, ciphertext, webCrypto).catch(function () {
              throw new Error('DecryptionFailure');
            });

          case 27:
            _msg = _context2.sent;
            return _context2.abrupt("return", new Uint8Array(_msg));

          case 31:
            _context2.next = 33;
            return msDecrypt(alg, _sessionKeyObj2, data, webCrypto).catch(function () {
              throw new Error('DecryptionFailure');
            });

          case 33:
            _msg2 = _context2.sent;
            return _context2.abrupt("return", new Uint8Array(_msg2));

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _decrypt.apply(this, arguments);
}

var msImportKey = function msImportKey(type, key, alg, ext, use, webCrypto) {
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

var msEncrypt = function msEncrypt(alg, key, msg, webCrypto) {
  return new Promise(function (resolve, reject) {
    var op = webCrypto.encrypt(alg, key, msg);

    op.oncomplete = function (evt) {
      resolve(evt.target.result);
    };

    op.onerror = function () {
      reject('EncryptionFailure');
    };
  });
};

var msDecrypt = function msDecrypt(alg, key, data, webCrypto) {
  return new Promise(function (resolve, reject) {
    var op = webCrypto.decrypt(alg, key, data);

    op.oncomplete = function (evt) {
      resolve(evt.target.result);
    };

    op.onerror = function () {
      reject('DecryptionFailure');
    };
  });
};