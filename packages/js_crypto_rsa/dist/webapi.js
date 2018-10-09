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

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

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
        publicKey,
        privateKey,
        alg,
        keys,
        _keys,
        _args = arguments;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            modulusLength = _args.length > 0 && _args[0] !== undefined ? _args[0] : 2048;
            publicExponent = _args.length > 1 && _args[1] !== undefined ? _args[1] : new Uint8Array([0x01, 0x00, 0x01]);
            webCrypto = _args.length > 2 ? _args[2] : undefined;
            alg = {
              name: 'RSA-OAEP',
              modulusLength: modulusLength,
              publicExponent: publicExponent,
              hash: {
                name: 'SHA-256'
              }
            };

            if (!(typeof window.msCrypto === 'undefined')) {
              _context.next = 16;
              break;
            }

            _context.next = 7;
            return webCrypto.generateKey(alg, true, ['encrypt', 'decrypt']);

          case 7:
            keys = _context.sent;
            _context.next = 10;
            return webCrypto.exportKey('jwk', keys.publicKey);

          case 10:
            publicKey = _context.sent;
            _context.next = 13;
            return webCrypto.exportKey('jwk', keys.privateKey);

          case 13:
            privateKey = _context.sent;
            _context.next = 25;
            break;

          case 16:
            _context.next = 18;
            return msGenerateKey(alg, true, ['encrypt', 'decrypt'], webCrypto);

          case 18:
            _keys = _context.sent;
            _context.next = 21;
            return msExportKey('jwk', _keys.publicKey, webCrypto);

          case 21:
            publicKey = _context.sent;
            _context.next = 24;
            return msExportKey('jwk', _keys.privateKey, webCrypto);

          case 24:
            privateKey = _context.sent;

          case 25:
            // delete optional entries to export as general rsa sign/encrypt key
            ['key_ops', 'alg', 'ext'].forEach(function (elem) {
              delete publicKey[elem];
              delete privateKey[elem];
            });
            return _context.abrupt("return", {
              publicKey: publicKey,
              privateKey: privateKey
            });

          case 27:
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
        signature,
        key,
        _key,
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

            if (!(typeof window.msCrypto === 'undefined')) {
              _context2.next = 13;
              break;
            }

            _context2.next = 7;
            return webCrypto.importKey('jwk', privateJwk, algo, false, ['sign']);

          case 7:
            key = _context2.sent;
            _context2.next = 10;
            return webCrypto.sign(algo, key, msg);

          case 10:
            signature = _context2.sent;
            _context2.next = 21;
            break;

          case 13:
            if (!(algorithm.name === 'RSA-PSS')) {
              _context2.next = 15;
              break;
            }

            throw new Error('IE does not support RSA-PSS. Use RSASSA-PKCS1-v1_5.');

          case 15:
            _context2.next = 17;
            return msImportKey('jwk', privateJwk, algo, false, ['sign'], webCrypto);

          case 17:
            _key = _context2.sent;
            _context2.next = 20;
            return msSign(algo, _key, msg, webCrypto);

          case 20:
            signature = _context2.sent;

          case 21:
            return _context2.abrupt("return", new Uint8Array(signature));

          case 22:
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
        valid,
        key,
        _key2,
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

            if (!(typeof window.msCrypto === 'undefined')) {
              _context3.next = 13;
              break;
            }

            _context3.next = 7;
            return webCrypto.importKey('jwk', publicJwk, algo, false, ['verify']);

          case 7:
            key = _context3.sent;
            _context3.next = 10;
            return webCrypto.verify(algo, key, signature, msg);

          case 10:
            valid = _context3.sent;
            _context3.next = 21;
            break;

          case 13:
            if (!(algorithm.name === 'RSA-PSS')) {
              _context3.next = 15;
              break;
            }

            throw new Error('IE does not support RSA-PSS. Use RSASSA-PKCS1-v1_5.');

          case 15:
            _context3.next = 17;
            return msImportKey('jwk', publicJwk, algo, false, ['verify'], webCrypto);

          case 17:
            _key2 = _context3.sent;
            _context3.next = 20;
            return msVerify(algo, _key2, signature, msg, webCrypto);

          case 20:
            valid = _context3.sent;

          case 21:
            return _context3.abrupt("return", valid);

          case 22:
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
        encrypted,
        key,
        _key3,
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

            if (!(typeof window.msCrypto === 'undefined')) {
              _context4.next = 13;
              break;
            }

            _context4.next = 7;
            return webCrypto.importKey('jwk', publicJwk, algo, false, ['encrypt']);

          case 7:
            key = _context4.sent;
            _context4.next = 10;
            return webCrypto.encrypt(algo, key, msg);

          case 10:
            encrypted = _context4.sent;
            _context4.next = 21;
            break;

          case 13:
            if (!(label.toString() !== new Uint8Array().toString())) {
              _context4.next = 15;
              break;
            }

            throw new Error('IE does not support RSA-OAEP label.');

          case 15:
            _context4.next = 17;
            return msImportKey('jwk', publicJwk, algo, false, ['encrypt'], webCrypto);

          case 17:
            _key3 = _context4.sent;
            _context4.next = 20;
            return msEncrypt(algo, _key3, msg, webCrypto);

          case 20:
            encrypted = _context4.sent;

          case 21:
            return _context4.abrupt("return", new Uint8Array(encrypted));

          case 22:
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
} // function definitions for IE


function _decrypt() {
  _decrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(msg, privateJwk) {
    var hash,
        label,
        webCrypto,
        algo,
        decrypted,
        key,
        _key4,
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

            if (!(typeof window.msCrypto === 'undefined')) {
              _context5.next = 13;
              break;
            }

            _context5.next = 7;
            return webCrypto.importKey('jwk', privateJwk, algo, false, ['decrypt']);

          case 7:
            key = _context5.sent;
            _context5.next = 10;
            return webCrypto.decrypt(algo, key, msg);

          case 10:
            decrypted = _context5.sent;
            _context5.next = 21;
            break;

          case 13:
            if (!(label.toString() !== new Uint8Array().toString())) {
              _context5.next = 15;
              break;
            }

            throw new Error('IE does not support RSA-OAEP label.');

          case 15:
            _context5.next = 17;
            return msImportKey('jwk', privateJwk, algo, false, ['decrypt'], webCrypto);

          case 17:
            _key4 = _context5.sent;
            _context5.next = 20;
            return msDecrypt(algo, _key4, msg, webCrypto);

          case 20:
            decrypted = _context5.sent;

          case 21:
            return _context5.abrupt("return", new Uint8Array(decrypted));

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _decrypt.apply(this, arguments);
}

var msGenerateKey = function msGenerateKey(alg, ext, use, webCrypto) {
  return new Promise(function (resolve, reject) {
    var op = webCrypto.generateKey(alg, ext, use);

    op.oncomplete = function (evt) {
      resolve(evt.target.result);
    };

    op.onerror = function () {
      reject('KeyGenerationFailed');
    };
  });
};

var msImportKey = function msImportKey(type, key, alg, ext, use, webCrypto) {
  return new Promise(function (resolve, reject) {
    var inputKey = key;

    if (type === 'jwk') {
      inputKey = JSON.stringify(key);
      inputKey = _jsEncodingUtils.default.encoder.stringToArrayBuffer(inputKey);
    }

    var op = webCrypto.importKey(type, inputKey, alg, ext, use);

    op.oncomplete = function (evt) {
      resolve(evt.target.result);
    };

    op.onerror = function () {
      reject('KeyImportingFailed');
    };
  });
};

var msExportKey = function msExportKey(type, key, webCrypto) {
  return new Promise(function (resolve, reject) {
    var op = webCrypto.exportKey(type, key);

    op.oncomplete = function (evt) {
      var output = evt.target.result;

      if (type === 'jwk') {
        output = _jsEncodingUtils.default.encoder.arrayBufferToString(new Uint8Array(output));
        output = JSON.parse(output);
      }

      resolve(output);
    };

    op.onerror = function () {
      reject('KeyExportingFailed');
    };
  });
};

var msEncrypt = function msEncrypt(alg, key, msg, webCrypto) {
  return new Promise(function (resolve, reject) {
    delete alg.label; // if exists, the MSCrypto doesn't work...wtf

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
    delete alg.label; // if exists, the MSCrypto doesn't work...wtf

    var op = webCrypto.decrypt(alg, key, data);

    op.oncomplete = function (evt) {
      resolve(evt.target.result);
    };

    op.onerror = function () {
      reject('DecryptionFailure');
    };
  });
};

var msSign = function msSign(alg, key, msg, webCrypto) {
  return new Promise(function (resolve, reject) {
    var op = webCrypto.sign(alg, key, msg);

    op.oncomplete = function (evt) {
      resolve(evt.target.result);
    };

    op.onerror = function () {
      reject('SigningFailed');
    };
  });
};

var msVerify = function msVerify(alg, key, sig, msg, webCrypto) {
  return new Promise(function (resolve, reject) {
    var op = webCrypto.verify(alg, key, sig, msg);

    op.oncomplete = function (evt) {
      resolve(evt.target.result);
    };

    op.onerror = function () {
      reject('VerificationFailed');
    };
  });
};