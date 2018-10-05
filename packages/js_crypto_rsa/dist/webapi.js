"use strict";

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

/**
 * webapi.js
 */
function generateKey() {
  return _generateKey.apply(this, arguments);
}

function _generateKey() {
  _generateKey = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var modulusLength,
        publicExponent,
        webCrypto,
        keys,
        publicKey,
        privateKey,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            modulusLength = _args.length > 0 && _args[0] !== undefined ? _args[0] : 2048;
            publicExponent = _args.length > 1 && _args[1] !== undefined ? _args[1] : new Uint8Array([0x01, 0x00, 0x01]);
            webCrypto = _args.length > 2 ? _args[2] : undefined;
            _context.next = 5;
            return webCrypto.generateKey({
              name: 'RSA-OAEP',
              modulusLength: modulusLength,
              publicExponent: publicExponent,
              hash: {
                name: 'SHA-256'
              }
            }, true, ['encrypt', 'decrypt']);

          case 5:
            keys = _context.sent;
            _context.next = 8;
            return webCrypto.exportKey('jwk', keys.publicKey);

          case 8:
            publicKey = _context.sent;
            _context.next = 11;
            return webCrypto.exportKey('jwk', keys.privateKey);

          case 11:
            privateKey = _context.sent;
            // delete optional entries to export as general rsa sign/encrypt key
            ['key_ops', 'alg', 'ext'].forEach(function (elem) {
              delete publicKey[elem];
              delete privateKey[elem];
            });
            return _context.abrupt("return", {
              publicKey: publicKey,
              privateKey: privateKey
            });

          case 14:
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

function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(msg, privateJwk) {
    var hash,
        algorithm,
        webCrypto,
        algo,
        key,
        signature,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hash = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'SHA-256';
            algorithm = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {
              name: 'RSA-PSS',
              saltLength: 192
            };
            webCrypto = _args2.length > 4 ? _args2[4] : undefined;
            algo = {
              name: algorithm.name,
              hash: {
                name: hash
              },
              saltLength: algorithm.saltLength
            };
            _context2.next = 6;
            return webCrypto.importKey('jwk', privateJwk, algo, false, ['sign']);

          case 6:
            key = _context2.sent;
            _context2.next = 9;
            return webCrypto.sign(algo, key, msg);

          case 9:
            signature = _context2.sent;
            return _context2.abrupt("return", new Uint8Array(signature));

          case 11:
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

function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(msg, signature, publicJwk) {
    var hash,
        algorithm,
        webCrypto,
        algo,
        key,
        _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            hash = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 'SHA-256';
            algorithm = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : {
              name: 'RSA-PSS',
              saltLength: 192
            };
            webCrypto = _args3.length > 5 ? _args3[5] : undefined;
            algo = {
              name: algorithm.name,
              hash: {
                name: hash
              },
              saltLength: algorithm.saltLength
            };
            _context3.next = 6;
            return webCrypto.importKey('jwk', publicJwk, algo, false, ['verify']);

          case 6:
            key = _context3.sent;
            _context3.next = 9;
            return webCrypto.verify(algo, key, signature, msg);

          case 9:
            return _context3.abrupt("return", _context3.sent);

          case 10:
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

function _encrypt() {
  _encrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(msg, publicJwk) {
    var hash,
        label,
        webCrypto,
        algo,
        key,
        encrypted,
        _args4 = arguments;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            hash = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 'SHA-256';
            label = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : new Uint8Array([]);
            webCrypto = _args4.length > 4 ? _args4[4] : undefined;
            algo = {
              name: 'RSA-OAEP',
              hash: {
                name: hash
              },
              label: label
            };
            _context4.next = 6;
            return webCrypto.importKey('jwk', publicJwk, algo, false, ['encrypt']);

          case 6:
            key = _context4.sent;
            _context4.next = 9;
            return webCrypto.encrypt(algo, key, msg);

          case 9:
            encrypted = _context4.sent;
            return _context4.abrupt("return", new Uint8Array(encrypted));

          case 11:
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
  _regenerator.default.mark(function _callee5(msg, privateJwk) {
    var hash,
        label,
        webCrypto,
        algo,
        key,
        decrypted,
        _args5 = arguments;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            hash = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 'SHA-256';
            label = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : new Uint8Array([]);
            webCrypto = _args5.length > 4 ? _args5[4] : undefined;
            algo = {
              name: 'RSA-OAEP',
              hash: {
                name: hash
              },
              label: label
            };
            _context5.next = 6;
            return webCrypto.importKey('jwk', privateJwk, algo, false, ['decrypt']);

          case 6:
            key = _context5.sent;
            _context5.next = 9;
            return webCrypto.decrypt(algo, key, msg);

          case 9:
            decrypted = _context5.sent;
            return _context5.abrupt("return", new Uint8Array(decrypted));

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _decrypt.apply(this, arguments);
}