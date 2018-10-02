"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeAsn1Signature = decodeAsn1Signature;
exports.encodeAsn1Signature = encodeAsn1Signature;

var _params = _interopRequireDefault(require("./params.js"));

var _asn = _interopRequireDefault(require("asn1.js"));

var _buffer = _interopRequireDefault(require("buffer"));

/**
 * asn1enc.js
 */
var Buffer = _buffer.default.Buffer;
var BN = _asn.default.bignum;

function decodeAsn1Signature(asn1sig, namedCurve) {
  var asn1sigBuffer = Buffer.from(asn1sig); // This must be Buffer object to get decoded;

  var decoded = ECDSASignature.decode(asn1sigBuffer, 'der');
  var len = _params.default.namedCurves[namedCurve].payloadSize;
  var r = new Uint8Array(decoded.r.toArray('be', len));
  var s = new Uint8Array(decoded.s.toArray('be', len));
  var signature = new Uint8Array(len * 2);
  signature.set(r);
  signature.set(s, len);
  return signature;
}

function encodeAsn1Signature(signature, namedCurve) {
  var len = _params.default.namedCurves[namedCurve].payloadSize;
  var r = signature.slice(0, len);
  var s = signature.slice(len, signature.length);
  var asn1sig = ECDSASignature.encode({
    r: new BN(r),
    s: new BN(s)
  }, 'der');
  return new Uint8Array(asn1sig);
} /////////////////////////////////////////////////////////////////////////////////////////
// RFC5759 https://tools.ietf.org/html/rfc5759.html


var ECDSASignature = _asn.default.define('ECDSASignature', function () {
  this.seq().obj(this.key('r').int(), this.key('s').int());
});