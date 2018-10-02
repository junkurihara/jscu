"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.sign = sign;
exports.verify = verify;
exports.generateKeyPair = generateKeyPair;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireDefault(require("./params.mjs"));

var _index = _interopRequireDefault(require("js-crypto-ec/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-hkdf/dist/index.js"));

var _index3 = _interopRequireDefault(require("js-crypto-aes/dist/index.js"));

var _index4 = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

/**
 * crypto.mjs
 */

/**
 * encryption with public key algorithm. in case of ECDH, the session key is derived from HKDF and the data itself will be encrypted by symmetric cipher.
 * @param msg
 * @param pubkey
 * @param privkey
 * @param options
 * @return {Promise<{data: Uint8Array, salt: Uint8Array, iv: Uint8Array}>}
 */
function encrypt(_x, _x2) {
  return _encrypt.apply(this, arguments);
}
/**
 * decryption with public key algorithm. in case of ECDH, the session key is derived from HKDF and the data itself will be decrypted by symmetric cipher.
 * @param data
 * @param privkey
 * @param pubkey
 * @param options
 * @return {Promise<Uint8Array>}
 */


function _encrypt() {
  _encrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(msg, pubkey) {
    var privkey,
        options,
        sharedSecret,
        sessionKeySalt,
        data,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            privkey = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {
              hkdf: 'SHA-256',
              encrypt: 'AES-GCM',
              keyLength: 32,
              iv: null,
              info: ''
            };

            if (!(pubkey.kty !== 'EC')) {
              _context.next = 6;
              break;
            }

            throw new Error('RSA is not supported at this point');

          case 6:
            if (privkey) {
              _context.next = 8;
              break;
            }

            throw new Error('Private key must be specified for ECDH');

          case 8:
            _context.next = 10;
            return _index.default.deriveSecret(pubkey, privkey);

          case 10:
            sharedSecret = _context.sent;
            _context.next = 13;
            return _index2.default.compute(sharedSecret, 'SHA-256', options.keyLength, options.info);

          case 13:
            sessionKeySalt = _context.sent;

            if (!(Object.keys(_params.default.ciphers).indexOf(options.encrypt) >= 0)) {
              _context.next = 25;
              break;
            }

            if (!(options.encrypt === 'AES-GCM')) {
              _context.next = 20;
              break;
            }

            if (options.iv) {
              _context.next = 20;
              break;
            }

            _context.next = 19;
            return _index4.default.getRandomBytes(_params.default.ciphers[options.encrypt].ivLength);

          case 19:
            options.iv = _context.sent;

          case 20:
            _context.next = 22;
            return _index3.default.encrypt(msg, sessionKeySalt.key, {
              name: options.encrypt,
              iv: options.iv
            });

          case 22:
            data = _context.sent;
            _context.next = 26;
            break;

          case 25:
            throw new Error('unsupported cipher type (currently only AEC-GCM is supported)');

          case 26:
            return _context.abrupt("return", {
              data: data,
              salt: sessionKeySalt.salt,
              iv: options.iv
            });

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _encrypt.apply(this, arguments);
}

function decrypt(_x3, _x4) {
  return _decrypt.apply(this, arguments);
}
/**
 * sign message with given private key in jwk
 * @param privkey
 * @param msg
 * @param hash
 * @param format
 * @return {Promise<ArrayBuffer>}
 */


function _decrypt() {
  _decrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(data, privkey) {
    var pubkey,
        options,
        sharedSecret,
        sessionKeySalt,
        msg,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pubkey = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : null;
            options = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {
              hkdf: 'SHA-256',
              encrypt: 'AES-GCM',
              keyLength: 32,
              info: '',
              salt: null,
              iv: null
            };

            if (!(privkey.kty !== 'EC')) {
              _context2.next = 6;
              break;
            }

            throw new Error('RSA is not supported at this point');

          case 6:
            if (pubkey) {
              _context2.next = 8;
              break;
            }

            throw new Error('Public key must be specified for ECDH');

          case 8:
            _context2.next = 10;
            return _index.default.deriveSecret(pubkey, privkey);

          case 10:
            sharedSecret = _context2.sent;
            _context2.next = 13;
            return _index2.default.compute(sharedSecret, 'SHA-256', options.keyLength, options.info, options.salt);

          case 13:
            sessionKeySalt = _context2.sent;

            if (!(Object.keys(_params.default.ciphers).indexOf(options.encrypt) >= 0)) {
              _context2.next = 20;
              break;
            }

            _context2.next = 17;
            return _index3.default.decrypt(data, sessionKeySalt.key, {
              name: options.encrypt,
              iv: options.iv
            });

          case 17:
            msg = _context2.sent;
            _context2.next = 21;
            break;

          case 20:
            throw new Error('unsupported cipher type (currently only AEC-GCM is supported)');

          case 21:
            return _context2.abrupt("return", msg);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _decrypt.apply(this, arguments);
}

function sign(_x5, _x6) {
  return _sign.apply(this, arguments);
}
/**
 * verify message with given public key in jwk
 * @param msg
 * @param sig
 * @param pubkey
 * @param hash
 * @param format
 * @return {Promise<boolean>}
 */


function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(msg, privkey) {
    var hash,
        format,
        _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            hash = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {
              name: 'SHA-256'
            };
            format = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 'raw';

            if (!(privkey.kty !== 'EC')) {
              _context3.next = 4;
              break;
            }

            throw new Error('RSA is not supported at this point');

          case 4:
            _context3.next = 6;
            return _index.default.sign(msg, privkey, hash.name, format);

          case 6:
            return _context3.abrupt("return", _context3.sent);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _sign.apply(this, arguments);
}

function verify(_x7, _x8, _x9) {
  return _verify.apply(this, arguments);
}
/**
 * generate key pair in jwk format via web crypto api
 * @param keyParams
 * @return {Promise<{publicKey: {format: string, key: (string|*)}, privateKey: {format: string, key: (string|*)}}>}
 */


function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(msg, sig, pubkey) {
    var hash,
        format,
        _args4 = arguments;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            hash = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {
              name: 'SHA-256'
            };
            format = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : 'raw';

            if (!(pubkey.kty !== 'EC')) {
              _context4.next = 4;
              break;
            }

            throw new Error('RSA is not supported at this point');

          case 4:
            _context4.next = 6;
            return _index.default.verify(msg, sig, pubkey, hash.name, format);

          case 6:
            return _context4.abrupt("return", _context4.sent);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _verify.apply(this, arguments);
}

function generateKeyPair(_x10) {
  return _generateKeyPair.apply(this, arguments);
}

function _generateKeyPair() {
  _generateKeyPair = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(keyParams) {
    var kp;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!keyParams) keyParams = _params.default.keyParams;

            if (!(keyParams.keyType !== 'EC')) {
              _context5.next = 3;
              break;
            }

            throw new Error('RSA is not supported at this point');

          case 3:
            _context5.next = 5;
            return _index.default.generateKey(keyParams.namedCurve);

          case 5:
            kp = _context5.sent;
            return _context5.abrupt("return", {
              publicKey: {
                format: 'jwk',
                key: kp.publicKey
              },
              privateKey: {
                format: 'jwk',
                key: kp.privateKey
              }
            });

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _generateKeyPair.apply(this, arguments);
}