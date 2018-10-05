"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJwk = fromJwk;
exports.toJwk = toJwk;

var _asn = _interopRequireDefault(require("asn1.js"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _buffer = _interopRequireDefault(require("buffer"));

var _params = _interopRequireDefault(require("./params.js"));

/**
 * asn1rsa.js
 */
var Buffer = _buffer.default.Buffer;

function fromJwk(jwk, type) {
  var publicKeyAlgorithmOid = _params.default.publicKeyAlgorithms['RSA'].oid; // Parameters is always null Ox0500 in ASN.1 as shown in the Section 2.3.1 https://tools.ietf.org/html/rfc3279

  var parameters = Buffer.from([0x05, 0x00]);
  var algorithm = {
    algorithm: publicKeyAlgorithmOid,
    parameters: parameters
  };
  var modulus = new _asn.default.bignum(_jsEncodingUtils.default.encoder.decodeBase64Url(jwk.n));
  var publicExponent = new _asn.default.bignum(_jsEncodingUtils.default.encoder.decodeBase64Url(jwk.e));
  var decoded = {};

  if (type === 'public') {
    // SPKI
    decoded.subjectPublicKey = {
      unused: 0,
      data: RSAPublicKey.encode({
        modulus: modulus,
        publicExponent: publicExponent
      }, 'der')
    };
    decoded.algorithm = algorithm;
  } else if (type === 'private') {
    // PKCS8
    decoded.version = 0; // no public key presents for v2 (0)

    decoded.privateKeyAlgorithm = algorithm;
    decoded.privateKey = RSAPrivateKey.encode({
      version: 0,
      modulus: modulus,
      publicExponent: publicExponent,
      privateExponent: new _asn.default.bignum(_jsEncodingUtils.default.encoder.decodeBase64Url(jwk.d)),
      prime1: new _asn.default.bignum(_jsEncodingUtils.default.encoder.decodeBase64Url(jwk.p)),
      prime2: new _asn.default.bignum(_jsEncodingUtils.default.encoder.decodeBase64Url(jwk.q)),
      exponent1: new _asn.default.bignum(_jsEncodingUtils.default.encoder.decodeBase64Url(jwk.dp)),
      exponent2: new _asn.default.bignum(_jsEncodingUtils.default.encoder.decodeBase64Url(jwk.dq)),
      coefficient: new _asn.default.bignum(_jsEncodingUtils.default.encoder.decodeBase64Url(jwk.qi))
    }, 'der');
  }

  return decoded;
}
/**
 * Convert RSA spki/pkcs8 public/private keys to JWK
 * @param decoded
 * @param type
 * @return {*}
 */


function toJwk(decoded, type) {
  if (type === 'public') {
    // SPKI
    // algorithm.algorithm.parameters is always null Ox0500 in ASN.1
    // as shown in the Section 2.3.1 https://tools.ietf.org/html/rfc3279
    // overwrite nested binary object as parsed object
    decoded.subjectPublicKey.data = RSAPublicKey.decode(decoded.subjectPublicKey.data, 'der');
    var modulus = decoded.subjectPublicKey.data.modulus;
    var publicExponent = decoded.subjectPublicKey.data.publicExponent; // convert n and e from BN
    // modulus n

    var nLen = modulus.byteLength();
    var len = nLen % 128 === 0 ? nLen : nLen + (128 - nLen % 128);
    modulus = new Uint8Array(modulus.toArray('be', len)); // // publicExponent e;

    publicExponent = new Uint8Array(publicExponent.toArray('be', publicExponent.byteLength()));
    return {
      kty: 'RSA',
      n: _jsEncodingUtils.default.encoder.encodeBase64Url(modulus),
      e: _jsEncodingUtils.default.encoder.encodeBase64Url(publicExponent)
    };
  } else if (type === 'private') {
    // PKCS8
    // privateKeyAlgorithm.algorithm.parameters is always null Ox0500 in ASN.1
    // as shown in the Section 2.3.1 https://tools.ietf.org/html/rfc3279
    // overwrite nested binary object as parsed object
    decoded.privateKey = RSAPrivateKey.decode(decoded.privateKey, 'der');
    var privateKeyElems = {};
    privateKeyElems.modulus = decoded.privateKey.modulus; // calculate key length from modulus n

    var _nLen = privateKeyElems.modulus.byteLength();

    var _len = _nLen % 128 === 0 ? _nLen : _nLen + (128 - _nLen % 128); // this is actual key length, e.g., 256 bytes
    // convert BN to Uint8Array


    privateKeyElems.modulus = new Uint8Array(privateKeyElems.modulus.toArray('be', _len)); // n of length len

    privateKeyElems.publicExponent = new Uint8Array(decoded.privateKey.publicExponent.toArray('be', decoded.privateKey.publicExponent.byteLength())); // e of arbitrary small length

    privateKeyElems.privateExponent = new Uint8Array(decoded.privateKey.privateExponent.toArray('be', _len)); // d of length len

    var keys = ['prime1', 'prime2', 'exponent1', 'exponent2', 'coefficient']; // elements of length len/2

    keys.forEach(function (key) {
      privateKeyElems[key] = new Uint8Array(decoded.privateKey[key].toArray('be', _len >> 1));
    }); // JWW RSA private key: https://tools.ietf.org/html/rfc7517

    return {
      kty: 'RSA',
      n: _jsEncodingUtils.default.encoder.encodeBase64Url(privateKeyElems.modulus),
      e: _jsEncodingUtils.default.encoder.encodeBase64Url(privateKeyElems.publicExponent),
      d: _jsEncodingUtils.default.encoder.encodeBase64Url(privateKeyElems.privateExponent),
      p: _jsEncodingUtils.default.encoder.encodeBase64Url(privateKeyElems.prime1),
      q: _jsEncodingUtils.default.encoder.encodeBase64Url(privateKeyElems.prime2),
      dp: _jsEncodingUtils.default.encoder.encodeBase64Url(privateKeyElems.exponent1),
      dq: _jsEncodingUtils.default.encoder.encodeBase64Url(privateKeyElems.exponent2),
      qi: _jsEncodingUtils.default.encoder.encodeBase64Url(privateKeyElems.coefficient)
    };
  }
} ///////////
// https://tools.ietf.org/html/rfc3447


var RSAPublicKey = _asn.default.define('RSAPublicKey', function () {
  this.seq().obj(this.key('modulus').int(), // n
  this.key('publicExponent').int() // e
  );
});

var RSAPrivateKey = _asn.default.define('RSAPrivateKey', function () {
  this.seq().obj(this.key('version').int(), // 0
  this.key('modulus').int(), // n
  this.key('publicExponent').int(), // e
  this.key('privateExponent').int(), // d
  this.key('prime1').int(), // p
  this.key('prime2').int(), // q
  this.key('exponent1').int(), // d mod (p-1)
  this.key('exponent2').int(), // d mod (q-1)
  this.key('coefficient').int(), // (inverse of q) mod p
  this.key('otherPrimeInfos').optional().use(OtherPrimeInfos));
});

var OtherPrimeInfos = _asn.default.define('OtherPrimeInfos', function () {
  this.seqof(OtherPrimeInfo);
});

var OtherPrimeInfo = _asn.default.define('OtherPrimeInfo', function () {
  this.seq().obj(this.key('prime').int(), this.key('exponent').int(), this.key('coefficient').int());
});