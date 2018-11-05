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

var _index = _interopRequireDefault(require("js-crypto-ec/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-rsa/dist/index.js"));

var pkcec = _interopRequireWildcard(require("./pkcec.js"));

var _params = _interopRequireDefault(require("./params.js"));

/**
 * pkc.js
 */

/**
 * Generate key pair in JWK format
 * @param keyType
 * @param options
 * @return {Promise<{publicKey: *, privateKey: *}>}
 */
function generateKey() {
  return _generateKey.apply(this, arguments);
}
/**
 * Sign message with given private key in jwk
 * @param privkey
 * @param msg
 * @param hash
 * @param options
 * @return {Promise<ArrayBuffer>}
 */


function _generateKey() {
  _generateKey = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var keyType,
        options,
        kp,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            keyType = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'EC';
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};

            if (!(keyType === 'EC')) {
              _context.next = 9;
              break;
            }

            if (typeof options.namedCurve === 'undefined') options.namedCurve = 'P-256';
            _context.next = 6;
            return _index.default.generateKey(options.namedCurve);

          case 6:
            kp = _context.sent;
            _context.next = 18;
            break;

          case 9:
            if (!(keyType === 'RSA')) {
              _context.next = 17;
              break;
            }

            if (typeof options.modulusLength === 'undefined') options.modulusLength = 2048;
            if (typeof options.publicExponent === 'undefined') options.publicExponent = new Uint8Array([0x01, 0x00, 0x01]);
            _context.next = 14;
            return _index2.default.generateKey(options.modulusLength, options.publicExponent);

          case 14:
            kp = _context.sent;
            _context.next = 18;
            break;

          case 17:
            throw new Error('UnsupportedKeyType');

          case 18:
            return _context.abrupt("return", {
              publicKey: kp.publicKey,
              privateKey: kp.privateKey
            });

          case 19:
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
 * Verify message with given public key in jwk
 * @param msg
 * @param sig
 * @param pubkey
 * @param hash
 * @param options
 * @return {Promise<boolean>}
 */


function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(msg, privkey) {
    var hash,
        options,
        signature,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hash = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'SHA-256';
            options = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};

            if (!(privkey.kty === 'EC')) {
              _context2.next = 9;
              break;
            }

            if (typeof options.format === 'undefined') options.format = 'raw';
            _context2.next = 6;
            return _index.default.sign(msg, privkey, hash, options.format);

          case 6:
            signature = _context2.sent;
            _context2.next = 18;
            break;

          case 9:
            if (!(privkey.kty === 'RSA')) {
              _context2.next = 17;
              break;
            }

            if (typeof options.name === 'undefined') options.name = 'RSA-PSS';
            if (typeof options.saltLength === 'undefined') options.saltLength = _params.default.hashes[hash].hashSize;
            _context2.next = 14;
            return _index2.default.sign(msg, privkey, hash, options);

          case 14:
            signature = _context2.sent;
            _context2.next = 18;
            break;

          case 17:
            throw new Error('UnsupportedKeyType');

          case 18:
            return _context2.abrupt("return", signature);

          case 19:
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
 * Encryption with public key algorithm. in case of ECDH.
 * Session key is derived from HKDF and the data itself will be encrypted by symmetric cipher.
 * @param msg
 * @param publicKey
 * @param options
 * @return {Promise<{data: Uint8Array, salt: Uint8Array, iv: Uint8Array}>}
 */


function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(msg, sig, pubkey) {
    var hash,
        options,
        valid,
        _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            hash = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 'SHA-256';
            options = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : {};

            if (!(pubkey.kty === 'EC')) {
              _context3.next = 9;
              break;
            }

            if (typeof options.format === 'undefined') options.format = 'raw';
            _context3.next = 6;
            return _index.default.verify(msg, sig, pubkey, hash, options.format);

          case 6:
            valid = _context3.sent;
            _context3.next = 18;
            break;

          case 9:
            if (!(pubkey.kty === 'RSA')) {
              _context3.next = 17;
              break;
            }

            if (typeof options.name === 'undefined') options.name = 'RSA-PSS';
            if (typeof options.saltLength === 'undefined') options.saltLength = _params.default.hashes[hash].hashSize;
            _context3.next = 14;
            return _index2.default.verify(msg, sig, pubkey, hash, options);

          case 14:
            valid = _context3.sent;
            _context3.next = 18;
            break;

          case 17:
            throw new Error('UnsupportedKeyType');

          case 18:
            return _context3.abrupt("return", valid);

          case 19:
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
 * Decryption with public key algorithm. in case of ECDH
 * Session key is derived from HKDF and the data itself will be decrypted by symmetric cipher.
 * @param data
 * @param privateKey
 * @param options
 * @return {Promise<Uint8Array>}
 */


function _encrypt() {
  _encrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(msg, publicKey) {
    var options,
        ciphertext,
        _args4 = arguments;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            ciphertext = {};

            if (!(publicKey.kty === 'EC')) {
              _context4.next = 10;
              break;
            }

            if (options.privateKey) {
              _context4.next = 5;
              break;
            }

            throw new Error('MissingPrivateKeyForECDH');

          case 5:
            _context4.next = 7;
            return pkcec.encrypt(msg, publicKey, options);

          case 7:
            ciphertext = _context4.sent;
            _context4.next = 19;
            break;

          case 10:
            if (!(publicKey.kty === 'RSA')) {
              _context4.next = 18;
              break;
            }

            if (typeof options.hash !== 'undefined') options.hash = 'SHA-256';
            if (typeof options.label !== 'undefined') options.label = new Uint8Array([]);
            _context4.next = 15;
            return _index2.default.encrypt(msg, publicKey, options.hash, options.label);

          case 15:
            ciphertext.data = _context4.sent;
            _context4.next = 19;
            break;

          case 18:
            throw new Error('UnsupportedKeyType');

          case 19:
            return _context4.abrupt("return", ciphertext);

          case 20:
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
  _regenerator.default.mark(function _callee5(data, privateKey) {
    var options,
        msg,
        _args5 = arguments;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            options = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};

            if (!(privateKey.kty === 'EC')) {
              _context5.next = 9;
              break;
            }

            if (options.publicKey) {
              _context5.next = 4;
              break;
            }

            throw new Error('MissingPublicKeyForECDH');

          case 4:
            _context5.next = 6;
            return pkcec.decrypt(data, privateKey, options);

          case 6:
            msg = _context5.sent;
            _context5.next = 18;
            break;

          case 9:
            if (!(privateKey.kty === 'RSA')) {
              _context5.next = 17;
              break;
            }

            if (typeof options.hash !== 'undefined') options.hash = 'SHA-256';
            if (typeof options.label !== 'undefined') options.label = new Uint8Array([]);
            _context5.next = 14;
            return _index2.default.decrypt(data.data, privateKey, options.hash, options.label);

          case 14:
            msg = _context5.sent;
            _context5.next = 18;
            break;

          case 17:
            throw new Error('UnsupportedKeyType');

          case 18:
            return _context5.abrupt("return", msg);

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _decrypt.apply(this, arguments);
}