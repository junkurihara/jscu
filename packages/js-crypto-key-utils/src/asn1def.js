/**
 * asn1def.js
 */

import asn from 'asn1.js';

///////////////////////////////////////////////////////////////////////////////////////////
/**
 * This is either one of subjectPublicKeyInfo, oneAsymmetricKey or encryptedPrivateKeyInfo in ASN.1 format.
 * @type {AsnObject}
 */
export const KeyStructure = asn.define('KeyStructure', function (){
  this.choice({
    subjectPublicKeyInfo: this.use(SubjectPublicKeyInfo),
    oneAsymmetricKey: this.use(OneAsymmetricKey),
    encryptedPrivateKeyInfo: this.use(EncryptedPrivateKeyInfo)
  });
});

/**
 * SubjectPublicKeyInfo specified in RFC 5280 {@link https://tools.ietf.org/html/rfc5280}.
 * @type {AsnObject}
 */
export const SubjectPublicKeyInfo = asn.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  );
});

///////////////////////////////////////////////////////////////////////////////////////////
/**
 * OneAsymmetricKey specified in RFC5958 {@link https://tools.ietf.org/html/rfc5958}.
 * (old version PrivateKeyInfo {@link https://tools.ietf.org/html/rfc5208}.)
 * @type {AsnObject}
 */
export const OneAsymmetricKey = asn.define('OneAsymmetricKey', function () {
  this.seq().obj(
    this.key('version').use(Version),
    this.key('privateKeyAlgorithm').use(AlgorithmIdentifier),
    this.key('privateKey').octstr(),
    this.key('attributes').implicit(0).optional().any(),
    this.key('publicKey').implicit(1).optional().bitstr()
  );
});
export const EncryptedPrivateKeyInfo = asn.define('EncryptedPrivateKeyInfo', function () {
  this.seq().obj(
    this.key('encryptionAlgorithm').use(AlgorithmIdentifier),
    this.key('encryptedData').octstr()
  );
});


///////////////////////////////////////////////////////////////////////////////////////////
/**
 * PBEParameter, parameter for password-based encryption, specified in RFC 8018 {@link https://tools.ietf.org/html/rfc8018}.
 * @type {AsnObject}
 */
export const PBEParameter = asn.define('PBEParameter', function(){
  this.seq().obj(
    this.key('salt').octstr(8),
    this.key('iterationCount').int()
  );
});

/**
 * PBES2Params, parameter for password-based encryption scheme 2, specified in RFC 8018 {@link https://tools.ietf.org/html/rfc8018}.
 * @type {AsnObject}
 */
export const PBES2Params = asn.define('PBES2Params', function(){
  this.seq().obj(
    this.key('keyDerivationFunc').use(AlgorithmIdentifier),
    this.key('encryptionScheme').use(AlgorithmIdentifier)
  );
});

///////////////////////////////////////////////////////////////////////////////////////////
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
/**
 * PBKDF2Params, parameter for PBKDF2, specified in RFC 8018 {@link https://tools.ietf.org/html/rfc8018}.
 * @type {AsnObject}
 */
export const PBKDF2Params = asn.define('PBKDF2Params', function(){
  this.seq().obj(
    this.key('salt').choice({
      'specified': this.octstr(),
      'otherSource': this.use(AlgorithmIdentifier)
    }),
    this.key('iterationCount').int(),
    this.key('keyLength').int().optional(),
    this.key('prf').use(AlgorithmIdentifier).def({
      algorithm: [1, 2, 840, 113549, 2, 7], // hmacWithSHA1
      parameters: Buffer.from([0x05, 0x00])
    })
  );
});

///////////////////////////////////////////////////////////////////////////////////////////
/**
 * PBES2ESParams specified in RFC 8018 {@link https://tools.ietf.org/html/rfc8018}.
 * @type {{'aes192-cbc': AsnObject, 'aes128-cbc': AsnObject, 'des-ede3-cbc': Object, 'aes256-cbc': AsnObject}}
 */
export const PBES2ESParams = {
  'des-ede3-cbc': asn.define('DesEde3CbcParams', function(){
    this.octstr();
  }),
  'aes128-cbc': asn.define('Aes128CbcParams', function(){
    this.octstr();
  }),
  'aes192-cbc': asn.define('Aes192CbcParams', function(){
    this.octstr();
  }),
  'aes256-cbc': asn.define('Aes256CbcParams', function(){
    this.octstr();
  })
};


////////////////////////////////////////////////////////////////////////////////////
/**
 * AlgorithmIdentifier given in RFC 5280 {@link https://tools.ietf.org/html/rfc5280}
 * @type AsnObject
 */
const AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional().any()
  );
});

/**
 * Version
 * @type {AsnObject}
 */
const Version = asn.define('Version', function () {
  this.int();
});
