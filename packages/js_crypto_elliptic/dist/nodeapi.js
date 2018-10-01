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

var _params = _interopRequireDefault(require("./params.js"));

var asn1enc = _interopRequireWildcard(require("./asn1enc.js"));

var _index = _interopRequireDefault(require("js-crypto-key-utils/dist/index.js"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

/**
 * nodeapi.js
 */
function generateKey(namedCurve, nodeCrypto) {
  var ecdh = nodeCrypto.ECDH(_params.default.namedCurves[namedCurve].nodeName);
  ecdh.generateKeys();
  var publicOct = new Uint8Array(ecdh.getPublicKey());
  var privateOct = new Uint8Array(ecdh.getPrivateKey());

  var publicKey = _index.default.toJwkFrom('oct', publicOct, 'public', {
    format: 'binary',
    namedCurve: namedCurve
  });

  var privateKey = _index.default.toJwkFrom('oct', privateOct, 'private', {
    format: 'binary',
    namedCurve: namedCurve
  });

  return {
    publicKey: publicKey,
    privateKey: privateKey
  };
}

function sign(msg, privateJwk, hash, nodeCrypto) {
  var privatePem = _index.default.fromJwkTo('pem', privateJwk, 'private', {
    compact: false
  });

  var sign = nodeCrypto.createSign(_params.default.hashes[hash].nodeName);
  sign.update(msg);
  var asn1sig = sign.sign(privatePem);
  return asn1enc.decodeAsn1Signature(asn1sig, privateJwk.crv);
}

function verify(msg, signature, publicJwk, hash, nodeCrypto) {
  var publicPem = _index.default.fromJwkTo('pem', publicJwk, 'public', {
    compact: false
  });

  var verify = nodeCrypto.createVerify(_params.default.hashes[hash].nodeName);
  verify.update(msg);
  var asn1sig = asn1enc.encodeAsn1Signature(signature, publicJwk.crv);
  return verify.verify(publicPem, asn1sig);
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