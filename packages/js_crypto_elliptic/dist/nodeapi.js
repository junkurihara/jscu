"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateKey = generateKey;
exports.sign = sign;
exports.verify = verify;
exports.deriveSecret = deriveSecret;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireDefault(require("./params.js"));

var asn1enc = _interopRequireWildcard(require("./asn1enc.js"));

var _index = require("js-crypto-key-utils/dist/index.js");

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

/**
 * nodeapi.js
 */
function generateKey(_x, _x2) {
  return _generateKey.apply(this, arguments);
}

function _generateKey() {
  _generateKey = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(namedCurve, nodeCrypto) {
    var ecdh, publicOct, privateOct, publicKey, publicJwk, privateKey, privateJwk;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ecdh = nodeCrypto.ECDH(_params.default.namedCurves[namedCurve].nodeName);
            ecdh.generateKeys();
            publicOct = new Uint8Array(ecdh.getPublicKey());
            privateOct = new Uint8Array(ecdh.getPrivateKey());
            publicKey = new _index.Key('oct', publicOct, {
              namedCurve: namedCurve
            });

            if (!publicKey.isPrivate) {
              _context.next = 7;
              break;
            }

            throw new Error('NotPublicKeyForECCKeyGenNode');

          case 7:
            _context.next = 9;
            return publicKey.export('jwk', {
              outputPublic: true
            });

          case 9:
            publicJwk = _context.sent;
            privateKey = new _index.Key('oct', privateOct, {
              namedCurve: namedCurve
            });

            if (privateKey.isPrivate) {
              _context.next = 13;
              break;
            }

            throw new Error('NotPrivateKeyForECCKeyGenNode');

          case 13:
            _context.next = 15;
            return privateKey.export('jwk');

          case 15:
            privateJwk = _context.sent;
            return _context.abrupt("return", {
              publicKey: publicJwk,
              privateKey: privateJwk
            });

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _generateKey.apply(this, arguments);
}

function sign(_x3, _x4, _x5, _x6, _x7) {
  return _sign.apply(this, arguments);
}

function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(msg, privateJwk, hash, signatureFormat, nodeCrypto) {
    var privateKey, privatePem, sign, asn1sig;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            privateKey = new _index.Key('jwk', privateJwk);

            if (privateKey.isPrivate) {
              _context2.next = 3;
              break;
            }

            throw new Error('NotPrivateKeyForECCSignNode');

          case 3:
            _context2.next = 5;
            return privateKey.export('pem');

          case 5:
            privatePem = _context2.sent;
            sign = nodeCrypto.createSign(_params.default.hashes[hash].nodeName);
            sign.update(msg);
            asn1sig = sign.sign(privatePem);
            return _context2.abrupt("return", signatureFormat === 'raw' ? asn1enc.decodeAsn1Signature(asn1sig, privateJwk.crv) : asn1sig);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _sign.apply(this, arguments);
}

function verify(_x8, _x9, _x10, _x11, _x12, _x13) {
  return _verify.apply(this, arguments);
}

function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(msg, signature, publicJwk, hash, signatureFormat, nodeCrypto) {
    var publicKey, publicPem, verify, asn1sig;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            publicKey = new _index.Key('jwk', publicJwk);

            if (publicKey.isPrivate) {
              _context3.next = 3;
              break;
            }

            throw new Error('NotPrivateKeyForECCVerifyNode');

          case 3:
            _context3.next = 5;
            return publicKey.export('pem', {
              outputPublic: true,
              compact: false
            });

          case 5:
            publicPem = _context3.sent;
            verify = nodeCrypto.createVerify(_params.default.hashes[hash].nodeName);
            verify.update(msg);
            asn1sig = signatureFormat === 'raw' ? asn1enc.encodeAsn1Signature(signature, publicJwk.crv) : signature;
            return _context3.abrupt("return", verify.verify(publicPem, asn1sig));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _verify.apply(this, arguments);
}

function deriveSecret(publicJwk, privateJwk, nodeCrypto) {
  var curve = _params.default.namedCurves[privateJwk.crv].nodeName;
  var payloadSize = _params.default.namedCurves[privateJwk.crv].payloadSize;
  var ecdh = nodeCrypto.createECDH(curve);

  var privKeyBuf = _jsEncodingUtils.default.encoder.decodeBase64Url(privateJwk.d);

  var pubKeyBuf = new Uint8Array(payloadSize * 2 + 1);
  pubKeyBuf[0] = 0xFF & 0x04;
  pubKeyBuf.set(_jsEncodingUtils.default.encoder.decodeBase64Url(publicJwk.x), 1);
  pubKeyBuf.set(_jsEncodingUtils.default.encoder.decodeBase64Url(publicJwk.y), payloadSize + 1);
  ecdh.setPrivateKey(privKeyBuf);
  return new Uint8Array(ecdh.computeSecret(pubKeyBuf));
}