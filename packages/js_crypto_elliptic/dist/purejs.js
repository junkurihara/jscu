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

var _index = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-hash/dist/index.js"));

var _index3 = require("js-crypto-key-utils/dist/index.js");

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _elliptic = _interopRequireDefault(require("elliptic"));

/**
 * purejs.js
 */
var Ec = _elliptic.default.ec;

function generateKey(_x) {
  return _generateKey.apply(this, arguments);
}

function _generateKey() {
  _generateKey = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(namedCurve) {
    var curve, ec, ecKey, len, publicOct, privateOct, publicKey, publicJwk, privateKey, privateJwk;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            curve = _params.default.namedCurves[namedCurve].indutnyName;
            ec = new Ec(curve);
            _context.t0 = ec;
            _context.t1 = _jsEncodingUtils.default.encoder;
            _context.next = 6;
            return _index.default.getRandomBytes(32);

          case 6:
            _context.t2 = _context.sent;
            _context.t3 = _context.t1.arrayBufferToString.call(_context.t1, _context.t2);
            _context.t4 = {
              entropy: _context.t3
            };
            ecKey = _context.t0.genKeyPair.call(_context.t0, _context.t4);
            len = _params.default.namedCurves[namedCurve].payloadSize;
            publicOct = new Uint8Array(ecKey.getPublic('array'));
            privateOct = new Uint8Array(ecKey.getPrivate().toArray('be', len));
            publicKey = new _index3.Key('oct', publicOct, {
              namedCurve: namedCurve
            });

            if (!publicKey.isPrivate) {
              _context.next = 16;
              break;
            }

            throw new Error('NotPublicKeyForECCKeyGenPureJS');

          case 16:
            _context.next = 18;
            return publicKey.export('jwk', {
              outputPublic: true
            });

          case 18:
            publicJwk = _context.sent;
            privateKey = new _index3.Key('oct', privateOct, {
              namedCurve: namedCurve
            });

            if (privateKey.isPrivate) {
              _context.next = 22;
              break;
            }

            throw new Error('NotPrivateKeyForECCKeyGenPureJS');

          case 22:
            _context.next = 24;
            return privateKey.export('jwk');

          case 24:
            privateJwk = _context.sent;
            return _context.abrupt("return", {
              publicKey: publicJwk,
              privateKey: privateJwk
            });

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _generateKey.apply(this, arguments);
}

function sign(_x2, _x3, _x4, _x5) {
  return _sign.apply(this, arguments);
}

function _sign() {
  _sign = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(msg, privateJwk, hash, signatureFormat) {
    var namedCurve, curve, ec, privateKey, privateOct, ecKey, md, signature, len, arrayR, arrayS, concat;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            namedCurve = privateJwk.crv;
            curve = _params.default.namedCurves[namedCurve].indutnyName;
            ec = new Ec(curve);
            privateKey = new _index3.Key('jwk', privateJwk);

            if (privateKey.isPrivate) {
              _context2.next = 6;
              break;
            }

            throw new Error('NotPrivateKeyForECCSignPureJS');

          case 6:
            _context2.next = 8;
            return privateKey.export('oct');

          case 8:
            privateOct = _context2.sent;
            ecKey = ec.keyFromPrivate(privateOct); // get hash

            _context2.next = 12;
            return _index2.default.compute(msg, hash);

          case 12:
            md = _context2.sent;
            // generate signature
            signature = ecKey.sign(md); // formatting

            len = _params.default.namedCurves[namedCurve].payloadSize;
            arrayR = new Uint8Array(signature.r.toArray('be', len));
            arrayS = new Uint8Array(signature.s.toArray('be', len));
            concat = new Uint8Array(arrayR.length + arrayS.length);
            concat.set(arrayR);
            concat.set(arrayS, arrayR.length);
            return _context2.abrupt("return", signatureFormat === 'raw' ? concat : asn1enc.encodeAsn1Signature(concat, namedCurve));

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _sign.apply(this, arguments);
}

function verify(_x6, _x7, _x8, _x9, _x10) {
  return _verify.apply(this, arguments);
}

function _verify() {
  _verify = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(msg, signature, publicJwk, hash, signatureFormat) {
    var namedCurve, curve, ec, publicKey, publicOct, ecKey, len, sigR, sigS, md;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            namedCurve = publicJwk.crv;
            curve = _params.default.namedCurves[namedCurve].indutnyName;
            ec = new Ec(curve);
            publicKey = new _index3.Key('jwk', publicJwk);

            if (!publicKey.isPrivate) {
              _context3.next = 6;
              break;
            }

            throw new Error('NotPublicKeyForECCVerifyPureJS');

          case 6:
            _context3.next = 8;
            return publicKey.export('oct', {
              compact: false,
              outputPublic: true
            });

          case 8:
            publicOct = _context3.sent;
            ecKey = ec.keyFromPublic(publicOct); // parse signature

            len = _params.default.namedCurves[namedCurve].payloadSize;
            if (!(signature instanceof Uint8Array)) signature = new Uint8Array(signature);
            signature = signatureFormat === 'raw' ? signature : asn1enc.decodeAsn1Signature(signature, namedCurve);
            sigR = signature.slice(0, len);
            sigS = signature.slice(len, len + sigR.length); // get hash

            _context3.next = 17;
            return _index2.default.compute(msg, hash);

          case 17:
            md = _context3.sent;
            _context3.next = 20;
            return ecKey.verify(md, {
              s: sigS,
              r: sigR
            });

          case 20:
            return _context3.abrupt("return", _context3.sent);

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _verify.apply(this, arguments);
}

function deriveSecret(_x11, _x12) {
  return _deriveSecret.apply(this, arguments);
}

function _deriveSecret() {
  _deriveSecret = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(publicJwk, privateJwk) {
    var namedCurve, curve, ec, priKeyObj, privateOct, pubKeyObj, publicOct, privateKey, publicKey, len;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            namedCurve = privateJwk.crv;
            curve = _params.default.namedCurves[namedCurve].indutnyName;
            ec = new Ec(curve);
            priKeyObj = new _index3.Key('jwk', privateJwk);

            if (priKeyObj.isPrivate) {
              _context4.next = 6;
              break;
            }

            throw new Error('NotPrivateKeyForECCSDeriveKeyPureJS');

          case 6:
            _context4.next = 8;
            return priKeyObj.export('oct');

          case 8:
            privateOct = _context4.sent;
            pubKeyObj = new _index3.Key('jwk', publicJwk);

            if (!pubKeyObj.isPrivate) {
              _context4.next = 12;
              break;
            }

            throw new Error('NotPublicKeyForECCDeriveKeyPureJS');

          case 12:
            _context4.next = 14;
            return pubKeyObj.export('oct', {
              compact: false,
              outputPublic: true
            });

          case 14:
            publicOct = _context4.sent;
            privateKey = ec.keyFromPrivate(privateOct);
            publicKey = ec.keyFromPublic(publicOct); // derive shared key

            len = _params.default.namedCurves[namedCurve].payloadSize;
            return _context4.abrupt("return", new Uint8Array(privateKey.derive(publicKey.getPublic()).toArray('be', len)));

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _deriveSecret.apply(this, arguments);
}