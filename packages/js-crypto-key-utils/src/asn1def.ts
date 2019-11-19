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
  // @ts-ignore
  this.choice({
    // @ts-ignore
    subjectPublicKeyInfo: this.use(SubjectPublicKeyInfo),
    // @ts-ignore
    oneAsymmetricKey: this.use(OneAsymmetricKey),
    // @ts-ignore
    encryptedPrivateKeyInfo: this.use(EncryptedPrivateKeyInfo)
  });
});

/**
 * SubjectPublicKeyInfo specified in RFC 5280 {@link https://tools.ietf.org/html/rfc5280}.
 * @type {AsnObject}
 */
export const SubjectPublicKeyInfo = asn.define('SubjectPublicKeyInfo', function () {
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('algorithm').use(AlgorithmIdentifier),
    // @ts-ignore
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
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('version').use(Version),
    // @ts-ignore
    this.key('privateKeyAlgorithm').use(AlgorithmIdentifier),
    // @ts-ignore
    this.key('privateKey').octstr(),
    // @ts-ignore
    this.key('attributes').implicit(0).optional().any(),
    // @ts-ignore
    this.key('publicKey').implicit(1).optional().bitstr()
  );
});
/**
 * EncryptedPrivateKeyInfo specified in RFC5958 {@link https://tools.ietf.org/html/rfc5958}.
 * @type {AsnObject}
 */
export const EncryptedPrivateKeyInfo = asn.define('EncryptedPrivateKeyInfo', function () {
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('encryptionAlgorithm').use(AlgorithmIdentifier),
    // @ts-ignore
    this.key('encryptedData').octstr()
  );
});


///////////////////////////////////////////////////////////////////////////////////////////
/**
 * PBEParameter, parameter for password-based encryption, specified in RFC 8018 {@link https://tools.ietf.org/html/rfc8018}.
 * @type {AsnObject}
 */
export const PBEParameter = asn.define('PBEParameter', function(){
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('salt').octstr(8),
    // @ts-ignore
    this.key('iterationCount').int()
  );
});

/**
 * PBES2Params, parameter for password-based encryption scheme 2, specified in RFC 8018 {@link https://tools.ietf.org/html/rfc8018}.
 * @type {AsnObject}
 */
export const PBES2Params = asn.define('PBES2Params', function(){
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('keyDerivationFunc').use(AlgorithmIdentifier),
    // @ts-ignore
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
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('salt').choice({
      // @ts-ignore
      'specified': this.octstr(),
      // @ts-ignore
      'otherSource': this.use(AlgorithmIdentifier)
    }),
    // @ts-ignore
    this.key('iterationCount').int(),
    // @ts-ignore
    this.key('keyLength').int().optional(),
    // @ts-ignore
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
export const PBES2ESParams: {[index: string]: any} = {
  'des-ede3-cbc': asn.define('DesEde3CbcParams', function(){
    // @ts-ignore
    this.octstr();
  }),
  'aes128-cbc': asn.define('Aes128CbcParams', function(){
    // @ts-ignore
    this.octstr();
  }),
  'aes192-cbc': asn.define('Aes192CbcParams', function(){
    // @ts-ignore
    this.octstr();
  }),
  'aes256-cbc': asn.define('Aes256CbcParams', function(){
    // @ts-ignore
    this.octstr();
  })
};


////////////////////////////////////////////////////////////////////////////////////
/**
 * AlgorithmIdentifier given in RFC 5280 {@link https://tools.ietf.org/html/rfc5280}
 * @type AsnObject
 */
const AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function () {
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('algorithm').objid(),
    // @ts-ignore
    this.key('parameters').optional().any()
  );
});

/**
 * Version
 * @type {AsnObject}
 */
const Version = asn.define('Version', function () {
  // @ts-ignore
  this.int();
});
