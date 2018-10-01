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

/**
 * octenc.js
 */
var Ec = _elliptic.default.ec;
/**
 * Convert JWK EC public/private keys to octet form
 * compressed form of ec public key: https://tools.ietf.org/html/rfc5480
 * @param jwkey
 * @param type
 * @param outputFormat
 * @param compact
 * @return {*}
 */

function fromJwk(jwkey, type) {
  var outputFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'binary';
  var compact = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (type !== 'public' && type !== 'private') throw new Error('InvalidType');

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
 * @param type
 * @param namedCurve
 * @param inputFormat
 * @return {{kty: string, crv: *, x, y}}
 */


function toJwk(octkey, type, namedCurve) {
  var inputFormat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'binary';
  if (type !== 'public' && type !== 'private') throw new Error('InvalidType');
  if (Object.keys(_params.default.namedCurves).indexOf(namedCurve) < 0) throw new Error('UnsupportedCurve');
  var binKey = inputFormat === 'string' ? _jsEncodingUtils.default.encoder.hexStringToArrayBuffer(octkey) : octkey;
  var curve = _params.default.namedCurves[namedCurve].indutnyName;
  var ec = new Ec(curve);
  var ecKey = type === 'public' ? ec.keyFromPublic(binKey) : ec.keyFromPrivate(binKey);
  var len = _params.default.namedCurves[namedCurve].payloadSize;
  var publicKey = new Uint8Array(ecKey.getPublic('array'));
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
  octKeyObj.publicKey = fromJwk(jwkey, 'public', 'binary', compact);
  if (jwkey.d && type === 'private') octKeyObj.privateKey = fromJwk(jwkey, 'private', 'binary', compact);
  return octKeyObj;
}

function octKeyObjToJwk(octKeyObj, type, namedCurve) {
  if (type !== 'public' && type !== 'private') throw new Error('InvalidType');
  if (Object.keys(_params.default.namedCurves).indexOf(namedCurve) < 0) throw new Error('UnsupportedCurve');
  return type === 'public' ? toJwk(octKeyObj.publicKey, 'public', namedCurve, 'binary') : toJwk(octKeyObj.privateKey, 'private', namedCurve, 'binary');
}