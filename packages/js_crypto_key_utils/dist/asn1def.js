"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PBES2ESParams = exports.PBKDF2Params = exports.PBES2Params = exports.PBEParameter = exports.EncryptedPrivateKeyInfo = exports.OneAsymmetricKey = exports.PrivateKeyStructure = exports.SubjectPublicKeyInfo = void 0;

var _asn = _interopRequireDefault(require("asn1.js"));

/**
 * asn1def.js
 */
///////////////////////////////////////////////////////////////////////////////////////////
// https://tools.ietf.org/html/rfc5280
var SubjectPublicKeyInfo = _asn.default.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(this.key('algorithm').use(AlgorithmIdentifier), this.key('subjectPublicKey').bitstr());
}); ///////////////////////////////////////////////////////////////////////////////////////////
// ( old version PrivateKeyInfo https://tools.ietf.org/html/rfc5208 )
// RFC5958 https://tools.ietf.org/html/rfc5958


exports.SubjectPublicKeyInfo = SubjectPublicKeyInfo;

var PrivateKeyStructure = _asn.default.define('PrivateKeyStructure', function () {
  this.choice({
    oneAsymmetricKey: this.use(OneAsymmetricKey),
    encryptedPrivateKeyInfo: this.use(EncryptedPrivateKeyInfo)
  });
});

exports.PrivateKeyStructure = PrivateKeyStructure;

var OneAsymmetricKey = _asn.default.define('OneAsymmetricKey', function () {
  this.seq().obj(this.key('version').use(Version), this.key('privateKeyAlgorithm').use(AlgorithmIdentifier), this.key('privateKey').octstr(), this.key('attributes').implicit(0).optional().any(), this.key('publicKey').implicit(1).optional().bitstr());
});

exports.OneAsymmetricKey = OneAsymmetricKey;

var EncryptedPrivateKeyInfo = _asn.default.define('EncryptedPrivateKeyInfo', function () {
  this.seq().obj(this.key('encryptionAlgorithm').use(AlgorithmIdentifier), this.key('encryptedData').octstr());
}); ///////////////////////////////////////////////////////////////////////////////////////////
// https://tools.ietf.org/html/rfc8018


exports.EncryptedPrivateKeyInfo = EncryptedPrivateKeyInfo;

var PBEParameter = _asn.default.define('PBEParameter', function () {
  this.seq().obj(this.key('salt').octstr(8), this.key('iterationCount').int());
});

exports.PBEParameter = PBEParameter;

var PBES2Params = _asn.default.define('PBES2Params', function () {
  this.seq().obj(this.key('keyDerivationFunc').use(AlgorithmIdentifier), this.key('encryptionScheme').use(AlgorithmIdentifier));
}); ///////////////////////////////////////////////////////////////////////////////////////////
// PBKDF2-params ::= SEQUENCE {
//        salt CHOICE {
//          specified OCTET STRING,
//          otherSource AlgorithmIdentifier {{PBKDF2-SaltSources}}
//        },
//        iterationCount INTEGER (1..MAX),
//        keyLength INTEGER (1..MAX) OPTIONAL,
//        prf AlgorithmIdentifier {{PBKDF2-PRFs}} DEFAULT
//        algid-hmacWithSHA1
//    }


exports.PBES2Params = PBES2Params;

var PBKDF2Params = _asn.default.define('PBKDF2Params', function () {
  this.seq().obj(this.key('salt').choice({
    'specified': this.octstr(),
    'otherSource': this.use(AlgorithmIdentifier)
  }), this.key('iterationCount').int(), this.key('keyLength').int().optional(), this.key('prf').use(AlgorithmIdentifier).def({
    algorithm: [1, 2, 840, 113549, 2, 7],
    // hmacWithSHA1
    parameters: Buffer.from([0x05, 0x00])
  }));
}); ///////////////////////////////////////////////////////////////////////////////////////////


exports.PBKDF2Params = PBKDF2Params;
var PBES2ESParams = {
  'des-ede3-cbc': _asn.default.define('DesEde3CbcParams', function () {
    this.octstr();
  })
}; ////////////////////////////////////////////////////////////////////////////////////
// https://tools.ietf.org/html/rfc5280

exports.PBES2ESParams = PBES2ESParams;

var AlgorithmIdentifier = _asn.default.define('AlgorithmIdentifier', function () {
  this.seq().obj(this.key('algorithm').objid(), this.key('parameters').optional().any());
});

var Version = _asn.default.define('Version', function () {
  this.int();
});