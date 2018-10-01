"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJWK = fromJWK;
exports.toJWK = toJWK;

var _asn = _interopRequireDefault(require("asn1.js"));

var _params = _interopRequireWildcard(require("./params.js"));

var _octenc = require("./octenc.js");

/**
 * asn1ec.js
 */

/**
 * Convert JWK to parsed ASN.1 EC key object
 * @param jwk
 * @param type
 * @param compact
 * @return {object}
 */
function fromJWK(jwk, type) {
  var compact = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (Object.keys(_params.default.namedCurves).indexOf(jwk.crv) < 0) throw new Error('UnsupportedCurve');
  var octkeyObj = (0, _octenc.octKeyObjFromJwk)(jwk, type, compact);
  var publicKeyAlgorithmOid = _params.default.publicKeyAlgorithms['EC'].oid;
  var publicKey = {
    unused: 0,
    data: Array.from(octkeyObj.publicKey)
  }; //Buffer.from(octkeyObj.publicKey)};

  var parameters = ECParameters.encode({
    type: 'namedCurve',
    value: _params.default.namedCurves[jwk.crv].oid
  }, 'der');
  var algorithm = {
    algorithm: publicKeyAlgorithmOid,
    parameters: parameters
  };
  var decoded = {};

  if (type === 'public') {
    // SPKI
    decoded.subjectPublicKey = publicKey;
    decoded.algorithm = algorithm;
  } else if (type === 'private') {
    // PKCS8
    decoded.version = 0;
    decoded.privateKeyAlgorithm = algorithm;
    decoded.privateKey = ECPrivateKey.encode({
      version: 1,
      privateKey: Array.from(octkeyObj.privateKey),
      //Buffer.from(octkeyObj.privateKey),
      parameters: parameters,
      publicKey: publicKey
    }, 'der');
  }

  return decoded;
}
/**
 * Convert parsed ASN.1 EC key object to JWK
 * @param decoded
 * @param type
 * @return {{kty, crv, x, y}}
 */


function toJWK(decoded, type) {
  if (type === 'public') {
    // SPKI
    decoded.algorithm.parameters = ECParameters.decode(decoded.algorithm.parameters, 'der'); // overwrite nested binary object as parsed object

    var octPubKey = new Uint8Array(decoded.subjectPublicKey.data); // convert oct key to jwk

    var namedCurves = (0, _params.getAlgorithmFromOid)(decoded.algorithm.parameters.value, _params.default.namedCurves);
    if (namedCurves.length < 1) throw new Error('UnsupportedCurve');
    return (0, _octenc.octKeyObjToJwk)({
      publicKey: octPubKey
    }, type, namedCurves[0]);
  } else if (type === 'private') {
    // PKCS8
    decoded.privateKeyAlgorithm.parameters = ECParameters.decode(decoded.privateKeyAlgorithm.parameters, 'der'); // Work around for optional private key parameter field.

    try {
      decoded.privateKey = ECPrivateKey.decode(decoded.privateKey, 'der');
    } catch (e) {
      decoded.privateKey = ECPrivateKeyAlt.decode(decoded.privateKey, 'der');
    }

    var _octPubKey = new Uint8Array(decoded.privateKey.publicKey.data);

    var octPrivKey = new Uint8Array(decoded.privateKey.privateKey);

    var _namedCurves = (0, _params.getAlgorithmFromOid)(decoded.privateKeyAlgorithm.parameters.value, _params.default.namedCurves);

    if (_namedCurves.length < 1) throw new Error('UnsupportedCurve');
    return (0, _octenc.octKeyObjToJwk)({
      publicKey: _octPubKey,
      privateKey: octPrivKey
    }, type, _namedCurves[0]);
  }
} /////////////////////////
// https://tools.ietf.org/html/rfc5480


var ECParameters = _asn.default.define('ECParameters', function () {
  this.choice({
    namedCurve: this.objid()
  });
}); // https://tools.ietf.org/html/rfc5915


var ECPrivateKey = _asn.default.define('ECPrivateKey', function () {
  this.seq().obj(this.key('version').int(), this.key('privateKey').octstr(), this.key('parameters').explicit(0).optional().any(), // rfc suggested that this must be implemented
  this.key('publicKey').explicit(1).optional().bitstr() // rfc suggested that this must be implemented
  );
});

var ECPrivateKeyAlt = _asn.default.define('ECPrivateKey', function () {
  this.seq().obj(this.key('version').int(), this.key('privateKey').octstr(), // this.key('parameters').explicit(0).optional().any(), // rfc suggested that this must be implemented
  this.key('publicKey').explicit(1).optional().bitstr() // rfc suggested that this must be implemented
  );
});