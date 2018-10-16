"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJwk = fromJwk;
exports.toJwk = toJwk;
exports.octKeyObjFromJwk = octKeyObjFromJwk;
exports.octKeyObjToJwk = octKeyObjToJwk;

var _params = _interopRequireDefault(require("./params.js"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _elliptic = _interopRequireDefault(require("elliptic"));

var _util = require("./util.js");

/**
 * octenc.js
 */
var Ec = _elliptic.default.ec;
/**
 * Convert JWK EC public/private keys to octet form
 * compressed form of ec public key: https://tools.ietf.org/html/rfc5480
 * @param jwkey
 * @param outputPublic {boolean} (optional)
 * @param outputFormat
 * @param compact
 * @return {*}
 */

function fromJwk(jwkey, _ref) {
  var outputPublic = _ref.outputPublic,
      _ref$outputFormat = _ref.outputFormat,
      outputFormat = _ref$outputFormat === void 0 ? 'binary' : _ref$outputFormat,
      _ref$compact = _ref.compact,
      compact = _ref$compact === void 0 ? false : _ref$compact;
  // original key type
  var orgType = (0, _util.getJwkType)(jwkey);
  var type = typeof outputPublic === 'boolean' && outputPublic ? 'public' : orgType;

  if (type === 'public') {
    var bufX = _jsEncodingUtils.default.encoder.decodeBase64Url(jwkey.x);

    var bufY = _jsEncodingUtils.default.encoder.decodeBase64Url(jwkey.y);

    var publicKey;

    if (compact) {
      // compressed form
      // http://www.secg.org/SEC1-Ver-1.0.pdf
      publicKey = new Uint8Array(bufX.length + 1);
      publicKey[0] = 0xFF & (0x01 & bufY.slice(-1)[0]) + 0x02;
      publicKey.set(bufX, 1);
    } else {
      // uncompressed form
      publicKey = new Uint8Array(bufX.length + bufY.length + 1);
      publicKey[0] = 0xFF & 0x04;
      publicKey.set(bufX, 1);
      publicKey.set(bufY, bufX.length + 1);
    }

    return outputFormat === 'string' ? _jsEncodingUtils.default.encoder.arrayBufferToHexString(publicKey) : publicKey;
  } else if (type === 'private') {
    if (!jwkey.d) throw new Error('InvalidKey');

    var bufD = _jsEncodingUtils.default.encoder.decodeBase64Url(jwkey.d);

    return outputFormat === 'string' ? _jsEncodingUtils.default.encoder.arrayBufferToHexString(bufD) : bufD;
  }
}
/**
 * Convert Octet form of EC public/private keys to JWK
 * @param octkey
 * @param outputPublic {boolean} (optional)
 * @param namedCurve
 * @return {{kty: string, crv: *, x, y}}
 */


function toJwk(octkey, namedCurve, _ref2) {
  var outputPublic = _ref2.outputPublic;
  if (Object.keys(_params.default.namedCurves).indexOf(namedCurve) < 0) throw new Error('UnsupportedCurve'); // original key type and check the key structure

  var orgType = (0, _util.getSec1KeyType)(octkey, namedCurve);
  var type = typeof outputPublic === 'boolean' && outputPublic ? 'public' : orgType; // format conversion

  var binKey = typeof octkey === 'string' ? _jsEncodingUtils.default.encoder.hexStringToArrayBuffer(octkey) : octkey; // instantiation

  var curve = _params.default.namedCurves[namedCurve].indutnyName;
  var ec = new Ec(curve); // derive key object from binary key

  var ecKey = orgType === 'public' ? ec.keyFromPublic(binKey) : ec.keyFromPrivate(binKey);
  var publicKey = new Uint8Array(ecKey.getPublic('array'));
  var len = _params.default.namedCurves[namedCurve].payloadSize;
  var bufX = publicKey.slice(1, len + 1);
  var bufY = publicKey.slice(len + 1, len * 2 + 1);
  var jwKey = {
    // https://www.rfc-editor.org/rfc/rfc7518.txt
    kty: 'EC',
    crv: namedCurve,
    x: _jsEncodingUtils.default.encoder.encodeBase64Url(bufX),
    // oct to base64url
    y: _jsEncodingUtils.default.encoder.encodeBase64Url(bufY) // ext: true

  };

  if (type === 'private') {
    // octkey is exactly private key if type is private.
    jwKey.d = _jsEncodingUtils.default.encoder.encodeBase64Url(binKey);
  }

  return jwKey;
}

function octKeyObjFromJwk(jwkey, type) {
  var compact = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var octKeyObj = {};
  octKeyObj.publicKey = fromJwk(jwkey, {
    outputFormat: 'binary',
    outputPublic: true,
    compact: compact
  });
  if (jwkey.d && type === 'private') octKeyObj.privateKey = fromJwk(jwkey, {
    outputFormat: 'binary',
    outputPublic: false,
    compact: compact
  });
  return octKeyObj;
}

function octKeyObjToJwk(octKeyObj, type, namedCurve) {
  if (type !== 'public' && type !== 'private') throw new Error('InvalidType');
  if (Object.keys(_params.default.namedCurves).indexOf(namedCurve) < 0) throw new Error('UnsupportedCurve');
  return type === 'public' ? toJwk(octKeyObj.publicKey, namedCurve, {
    outputPublic: true
  }) : toJwk(octKeyObj.privateKey, namedCurve, {
    outputPublic: false
  });
}