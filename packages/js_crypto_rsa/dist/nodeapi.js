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

var _index = _interopRequireDefault(require("js-crypto-key-utils/dist/index.js"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var oaep = _interopRequireWildcard(require("./oaep.js"));

/**
 * nodeapi.js
 */
// TODO: Currently not implemented in Node.js. Will be available from Node.js v10.12.0.
function generateKey() {
  var modulusLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2048;
  var publicExponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Uint8Array([0x01, 0x00, 0x01]);
  var nodeCrypto = arguments.length > 2 ? arguments[2] : undefined;
  throw new Error('CurrentlyNodeKeyGenIsUnsupported');
}

function sign(msg, privateJwk) {
  var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'SHA-256';
  var algorithm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    name: 'RSA-PSS',
    saltLength: 192
  };
  var nodeCrypto = arguments.length > 4 ? arguments[4] : undefined;

  var privatePem = _index.default.fromJwkTo('pem', privateJwk, 'private', {
    compact: false
  });

  var sign = nodeCrypto.createSign(_params.default.hashes[hash].nodeName);
  sign.update(msg);
  var key = Object.assign({
    key: privatePem
  }, algorithm.name === 'RSA-PSS' ? {
    saltLength: algorithm.saltLength,
    padding: nodeCrypto.constants.RSA_PKCS1_PSS_PADDING
  } : {});
  return new Uint8Array(sign.sign(key));
}

function verify(msg, signature, publicJwk) {
  var hash = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'SHA-256';
  var algorithm = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    name: 'RSA-PSS',
    saltLength: 192
  };
  var nodeCrypto = arguments.length > 5 ? arguments[5] : undefined;

  var publicPem = _index.default.fromJwkTo('pem', publicJwk, 'public', {
    compact: false
  });

  var verify = nodeCrypto.createVerify(_params.default.hashes[hash].nodeName);
  verify.update(msg);
  var key = Object.assign({
    key: publicPem
  }, algorithm.name === 'RSA-PSS' ? {
    saltLength: algorithm.saltLength,
    padding: nodeCrypto.constants.RSA_PKCS1_PSS_PADDING
  } : {});
  return verify.verify(key, signature);
}

function encrypt(_x, _x2) {
  return _encrypt.apply(this, arguments);
}

function _encrypt() {
  _encrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(msg, publicJwk) {
    var hash,
        label,
        nodeCrypto,
        publicPem,
        encrypted,
        em,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hash = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'SHA-256';
            label = _args.length > 3 && _args[3] !== undefined ? _args[3] : new Uint8Array([]);
            nodeCrypto = _args.length > 4 ? _args[4] : undefined;
            publicPem = _index.default.fromJwkTo('pem', publicJwk, 'public', {
              compact: false
            });

            if (!(hash === 'SHA-1')) {
              _context.next = 8;
              break;
            }

            encrypted = nodeCrypto.publicEncrypt({
              key: publicPem,
              padding: nodeCrypto.constants.RSA_PKCS1_OAEP_PADDING
            }, msg);
            _context.next = 12;
            break;

          case 8:
            _context.next = 10;
            return oaep.emeOaepEncode(msg, label, _jsEncodingUtils.default.encoder.decodeBase64Url(publicJwk.n).length, hash);

          case 10:
            em = _context.sent;
            encrypted = nodeCrypto.publicEncrypt({
              key: publicPem,
              padding: nodeCrypto.constants.RSA_NO_PADDING
            }, em);

          case 12:
            return _context.abrupt("return", new Uint8Array(encrypted));

          case 13:
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

function _decrypt() {
  _decrypt = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(data, privateJwk) {
    var hash,
        label,
        nodeCrypto,
        privatePem,
        decrypted,
        em,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hash = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'SHA-256';
            label = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : new Uint8Array([]);
            nodeCrypto = _args2.length > 4 ? _args2[4] : undefined;
            privatePem = _index.default.fromJwkTo('pem', privateJwk, 'private', {
              compact: false
            });

            if (!(hash === 'SHA-1')) {
              _context2.next = 8;
              break;
            }

            decrypted = nodeCrypto.privateDecrypt({
              key: privatePem,
              padding: nodeCrypto.constants.RSA_PKCS1_OAEP_PADDING
            }, data);
            _context2.next = 12;
            break;

          case 8:
            // https://tools.ietf.org/html/rfc3447
            em = nodeCrypto.privateDecrypt({
              key: privatePem,
              padding: nodeCrypto.constants.RSA_NO_PADDING
            }, data);
            _context2.next = 11;
            return oaep.emeOaepDecode(new Uint8Array(em), label, _jsEncodingUtils.default.encoder.decodeBase64Url(privateJwk.n).length, hash);

          case 11:
            decrypted = _context2.sent;

          case 12:
            return _context2.abrupt("return", new Uint8Array(decrypted));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _decrypt.apply(this, arguments);
}