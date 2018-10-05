"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignature = getSignature;
exports.encodeRsassaPssParams = encodeRsassaPssParams;
exports.decodeRsassaPssParams = decodeRsassaPssParams;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireDefault(require("./params.js"));

var util = _interopRequireWildcard(require("./util.js"));

var _index = _interopRequireDefault(require("js-crypto-rsa/dist/index.js"));

var _asn = _interopRequireDefault(require("asn1.js"));

var _asn2 = _interopRequireDefault(require("asn1.js-rfc5280"));

var _buffer = _interopRequireDefault(require("buffer"));

/**
 * rsa.js
 */
var BN = _asn.default.bignum;
var Buffer = _buffer.default.Buffer;

function getSignature(_x, _x2, _x3, _x4, _x5) {
  return _getSignature.apply(this, arguments);
}

function _getSignature() {
  _getSignature = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(encodedTbsCertificate, privateJwk, algorithm, hash, saltLength) {
    var signature;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(algorithm === 'rsassaPss')) {
              _context.next = 6;
              break;
            }

            _context.next = 3;
            return _index.default.sign(encodedTbsCertificate, privateJwk, hash, {
              name: 'RSA-PSS',
              saltLength: saltLength
            });

          case 3:
            signature = _context.sent;
            _context.next = 9;
            break;

          case 6:
            _context.next = 8;
            return _index.default.sign(encodedTbsCertificate, privateJwk, _params.default.signatureAlgorithms[algorithm].hash, {
              name: 'RSASSA-PKCS1-v1_5'
            });

          case 8:
            signature = _context.sent;

          case 9:
            return _context.abrupt("return", {
              unused: 0,
              data: Buffer.from(signature)
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getSignature.apply(this, arguments);
}

function encodeRsassaPssParams(options) {
  if (options.hash === 'SHA-1' && options.saltLength === 20 && options.explicit === false) return Buffer.from([0x30, 0x00]);else {
    var pssParams = {
      hashAlgorithm: {
        algorithm: _params.default.hashes[options.hash].oid,
        parameters: Buffer.from(_params.default.ans1null)
      },
      maskGenAlgorithm: {
        algorithm: _params.default.maskGeneratorFunctions.MGF1.oid,
        // only MGF1 is available
        parameters: _asn2.default.AlgorithmIdentifier.encode({
          algorithm: _params.default.hashes[options.hash].oid,
          parameters: Buffer.from(_params.default.ans1null)
        }, 'der')
      },
      saltLength: new BN(options.saltLength),
      trailerField: new BN(1) // default

    };
    return RSASSAPSSParams.encode(pssParams, 'der');
  }
}

function decodeRsassaPssParams(pssParams) {
  var returnParams;

  if (new Uint8Array(pssParams).toString() !== new Uint8Array([0x30, 0x00]).toString()) {
    // non empty params
    var decodedParams = RSASSAPSSParams.decode(pssParams, 'der');
    decodedParams.maskGenAlgorithm.parameters = _asn2.default.AlgorithmIdentifier.decode(decodedParams.maskGenAlgorithm.parameters, 'der');
    decodedParams.saltLength = decodedParams.saltLength.toNumber();
    decodedParams.trailerField = decodedParams.trailerField.toNumber();
    var hash = util.getKeyFromOid(decodedParams.hashAlgorithm.algorithm, _params.default.hashes);
    var mgf = util.getKeyFromOid(decodedParams.maskGenAlgorithm.algorithm, _params.default.maskGeneratorFunctions);
    var hashForMgf = util.getKeyFromOid(decodedParams.maskGenAlgorithm.parameters.algorithm, _params.default.hashes);
    if (hash.length === 0 || mgf.length === 0 || hashForMgf === 0) throw new Error('InvalidCertificateFormat');
    returnParams = {
      hash: hash[0],
      mgf: mgf[0],
      hashForMgf: hashForMgf[0],
      saltLength: decodedParams.saltLength
    };
  } else {
    // if empty, defaults are SHA-1 for Sign and MGF1 with SHA-1, using salt of length 20
    returnParams = {
      hash: 'SHA-1',
      mgf: 'MGF1',
      hashForMgf: 'SHA-1',
      saltLength: 20
    };
  }

  return returnParams;
} /////////////////////////////////////////////////////////////////////////////////////////
// RFC4055 https://tools.ietf.org/html/rfc4055
// RFC7427 https://tools.ietf.org/html/rfc7427
// RSASSA-PSS-params  ::=  SEQUENCE  {
//          hashAlgorithm      [0] HashAlgorithm DEFAULT
//                                    sha1Identifier,
//          maskGenAlgorithm   [1] MaskGenAlgorithm DEFAULT
//                                    mgf1SHA1Identifier,
//          saltLength         [2] INTEGER DEFAULT 20,
//          trailerField       [3] INTEGER DEFAULT 1  }


var RSASSAPSSParams = _asn.default.define('rsassaPssParams', function () {
  this.seq().obj(this.key('hashAlgorithm').explicit(0).use(_asn2.default.AlgorithmIdentifier), this.key('maskGenAlgorithm').explicit(1).use(_asn2.default.AlgorithmIdentifier), this.key('saltLength').explicit(2).int(), this.key('trailerField').explicit(3).int());
});