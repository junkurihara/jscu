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

var _params = _interopRequireDefault(require("./params.js"));

var _index = require("js-crypto-key-utils/dist/index.js");

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var oaep = _interopRequireWildcard(require("./oaep.js"));

var _bn = _interopRequireDefault(require("bn.js"));

/**
 * nodeapi.js
 */
// TODO: Currently not implemented in Node.js. Will be available from Node.js v10.12.0.
function generateKey() {
  return _generateKey.apply(this, arguments);
}

function _generateKey() {
  _generateKey = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var modulusLength,
        publicExponent,
        nodeCrypto,
        pe,
        options,
        nodeKeyGen,
        keyPairDer,
        publicObj,
        privateObj,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            modulusLength = _args.length > 0 && _args[0] !== undefined ? _args[0] : 2048;
            publicExponent = _args.length > 1 && _args[1] !== undefined ? _args[1] : new Uint8Array([0x01, 0x00, 0x01]);
            nodeCrypto = _args.length > 2 ? _args[2] : undefined;
            pe = new _bn.default(publicExponent);
            options = {
              modulusLength: typeof modulusLength !== 'number' ? parseInt(modulusLength, 10) : modulusLength,
              publicExponent: pe.toNumber(),
              publicKeyEncoding: {
                type: 'spki',
                format: 'der'
              },
              privateKeyEncoding: {
                type: 'pkcs8',
                format: 'der'
              }
            };

            nodeKeyGen = function nodeKeyGen() {
              return new Promise(function (resolve, reject) {
                nodeCrypto.generateKeyPair('rsa', options, function (err, publicKey, privateKey) {
                  if (err) reject('KeyGenerationFailedNode');else resolve({
                    publicKey: publicKey,
                    privateKey: privateKey
                  });
                });
              });
            };

            _context.next = 8;
            return nodeKeyGen().catch(function () {
              throw new Error('KeyGenerationFailedNode');
            });

          case 8:
            keyPairDer = _context.sent;
            publicObj = new _index.Key('der', new Uint8Array(keyPairDer.publicKey));
            privateObj = new _index.Key('der', new Uint8Array(keyPairDer.privateKey));
            _context.next = 13;
            return publicObj.export('jwk');

          case 13:
            _context.t0 = _context.sent;
            _context.next = 16;
            return privateObj.export('jwk');

          case 16:
            _context.t1 = _context.sent;
            return _context.abrupt("return", {
              publicKey: _context.t0,
              privateKey: _context.t1
            });

          case 18:
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
        nodeCrypto,
        keyObj,
        privatePem,
        sign,
        key,
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
            nodeCrypto = _args2.length > 4 ? _args2[4] : undefined;
            keyObj = new _index.Key('jwk', privateJwk);

            if (keyObj.isPrivate) {
              _context2.next = 6;
              break;
            }

            throw new Error('NotPrivateKeyForRSASign');

          case 6:
            _context2.next = 8;
            return keyObj.export('pem');

          case 8:
            privatePem = _context2.sent;
            sign = nodeCrypto.createSign(_params.default.hashes[hash].nodeName);
            sign.update(msg);
            key = Object.assign({
              key: privatePem
            }, algorithm.name === 'RSA-PSS' ? {
              saltLength: algorithm.saltLength,
              padding: nodeCrypto.constants.RSA_PKCS1_PSS_PADDING
            } : {});
            return _context2.abrupt("return", new Uint8Array(sign.sign(key)));

          case 13:
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
        nodeCrypto,
        keyObj,
        publicPem,
        verify,
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
            nodeCrypto = _args3.length > 5 ? _args3[5] : undefined;
            keyObj = new _index.Key('jwk', publicJwk);

            if (!keyObj.isPrivate) {
              _context3.next = 6;
              break;
            }

            throw new Error('NotPublicKeyForRSAVerify');

          case 6:
            _context3.next = 8;
            return keyObj.export('pem', {
              outputPublic: true
            });

          case 8:
            publicPem = _context3.sent;
            verify = nodeCrypto.createVerify(_params.default.hashes[hash].nodeName);
            verify.update(msg);
            key = Object.assign({
              key: publicPem
            }, algorithm.name === 'RSA-PSS' ? {
              saltLength: algorithm.saltLength,
              padding: nodeCrypto.constants.RSA_PKCS1_PSS_PADDING
            } : {});
            return _context3.abrupt("return", verify.verify(key, signature));

          case 13:
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
        nodeCrypto,
        keyObj,
        publicPem,
        encrypted,
        em,
        _args4 = arguments;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            hash = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 'SHA-256';
            label = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : new Uint8Array([]);
            nodeCrypto = _args4.length > 4 ? _args4[4] : undefined;
            keyObj = new _index.Key('jwk', publicJwk);

            if (!keyObj.isPrivate) {
              _context4.next = 6;
              break;
            }

            throw new Error('NotPublicKeyForRSAEncrypt');

          case 6:
            _context4.next = 8;
            return keyObj.export('pem', {
              outputPublic: true
            });

          case 8:
            publicPem = _context4.sent;

            if (!(hash === 'SHA-1')) {
              _context4.next = 13;
              break;
            }

            encrypted = nodeCrypto.publicEncrypt({
              key: publicPem,
              padding: nodeCrypto.constants.RSA_PKCS1_OAEP_PADDING
            }, msg);
            _context4.next = 17;
            break;

          case 13:
            _context4.next = 15;
            return oaep.emeOaepEncode(msg, label, _jsEncodingUtils.default.encoder.decodeBase64Url(publicJwk.n).length, hash);

          case 15:
            em = _context4.sent;
            encrypted = nodeCrypto.publicEncrypt({
              key: publicPem,
              padding: nodeCrypto.constants.RSA_NO_PADDING
            }, em);

          case 17:
            return _context4.abrupt("return", new Uint8Array(encrypted));

          case 18:
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
  _regenerator.default.mark(function _callee5(data, privateJwk) {
    var hash,
        label,
        nodeCrypto,
        keyObj,
        privatePem,
        decrypted,
        em,
        _args5 = arguments;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            hash = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 'SHA-256';
            label = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : new Uint8Array([]);
            nodeCrypto = _args5.length > 4 ? _args5[4] : undefined;
            keyObj = new _index.Key('jwk', privateJwk);

            if (keyObj.isPrivate) {
              _context5.next = 6;
              break;
            }

            throw new Error('NotPrivateKeyForRSADecrypt');

          case 6:
            _context5.next = 8;
            return keyObj.export('pem');

          case 8:
            privatePem = _context5.sent;

            if (!(hash === 'SHA-1')) {
              _context5.next = 13;
              break;
            }

            decrypted = nodeCrypto.privateDecrypt({
              key: privatePem,
              padding: nodeCrypto.constants.RSA_PKCS1_OAEP_PADDING
            }, data);
            _context5.next = 17;
            break;

          case 13:
            // https://tools.ietf.org/html/rfc3447
            em = nodeCrypto.privateDecrypt({
              key: privatePem,
              padding: nodeCrypto.constants.RSA_NO_PADDING
            }, data);
            _context5.next = 16;
            return oaep.emeOaepDecode(new Uint8Array(em), label, _jsEncodingUtils.default.encoder.decodeBase64Url(privateJwk.n).length, hash);

          case 16:
            decrypted = _context5.sent;

          case 17:
            return _context5.abrupt("return", new Uint8Array(decrypted));

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _decrypt.apply(this, arguments);
}