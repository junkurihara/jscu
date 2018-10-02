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

var _index3 = _interopRequireDefault(require("js-crypto-key-utils/dist/index.js"));

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
    var curve, ec, ecKey, len, publicOct, privateOct, publicKey, privateKey;
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
            publicKey = _index3.default.toJwkFrom('oct', publicOct, 'public', {
              format: 'binary',
              namedCurve: namedCurve
            });
            privateKey = _index3.default.toJwkFrom('oct', privateOct, 'private', {
              format: 'binary',
              namedCurve: namedCurve
            });
            return _context.abrupt("return", {
              publicKey: publicKey,
              privateKey: privateKey
            });

          case 16:
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
    var namedCurve, curve, ec, privateOct, ecKey, md, signature, len, arrayR, arrayS, concat;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            namedCurve = privateJwk.crv;
            curve = _params.default.namedCurves[namedCurve].indutnyName;
            ec = new Ec(curve);
            privateOct = _index3.default.fromJwkTo('oct', privateJwk, 'private', {
              compact: false
            });
            ecKey = ec.keyFromPrivate(privateOct); // get hash

            _context2.next = 7;
            return _index2.default.compute(msg, hash);

          case 7:
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

          case 16:
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
    var namedCurve, curve, ec, publicOct, ecKey, len, sigR, sigS, md;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            namedCurve = publicJwk.crv;
            curve = _params.default.namedCurves[namedCurve].indutnyName;
            ec = new Ec(curve);
            publicOct = _index3.default.fromJwkTo('oct', publicJwk, 'public', {
              compact: false
            });
            ecKey = ec.keyFromPublic(publicOct); // parse signature

            len = _params.default.namedCurves[namedCurve].payloadSize;
            if (!(signature instanceof Uint8Array)) signature = new Uint8Array(signature);
            signature = signatureFormat === 'raw' ? signature : asn1enc.decodeAsn1Signature(signature, namedCurve);
            sigR = signature.slice(0, len);
            sigS = signature.slice(len, len + sigR.length); // get hash

            _context3.next = 12;
            return _index2.default.compute(msg, hash);

          case 12:
            md = _context3.sent;
            _context3.next = 15;
            return ecKey.verify(md, {
              s: sigS,
              r: sigR
            });

          case 15:
            return _context3.abrupt("return", _context3.sent);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _verify.apply(this, arguments);
}

function deriveSecret(publicJwk, privateJwk) {
  var namedCurve = privateJwk.crv;
  var curve = _params.default.namedCurves[namedCurve].indutnyName;
  var ec = new Ec(curve);

  var privateOct = _index3.default.fromJwkTo('oct', privateJwk, 'private', {
    compact: false
  });

  var publicOct = _index3.default.fromJwkTo('oct', publicJwk, 'public', {
    compact: false
  });

  var privateKey = ec.keyFromPrivate(privateOct);
  var publicKey = ec.keyFromPublic(publicOct); // derive shared key

  var len = _params.default.namedCurves[namedCurve].payloadSize;
  return new Uint8Array(privateKey.derive(publicKey.getPublic()).toArray('be', len));
}