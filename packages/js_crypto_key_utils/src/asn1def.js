/**
 * asn1def.js
 */

import asn from 'asn1.js';

///////////////////////////////////////////////////////////////////////////////////////////
// https://tools.ietf.org/html/rfc5280
export const SubjectPublicKeyInfo = asn.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  );
});

///////////////////////////////////////////////////////////////////////////////////////////
// ( old version PrivateKeyInfo https://tools.ietf.org/html/rfc5208 )
// RFC5958 https://tools.ietf.org/html/rfc5958
export const PrivateKeyStructure = asn.define('PrivateKeyStructure', function (){
  this.choice({
    oneAsymmetricKey: this.use(OneAsymmetricKey),
    encryptedPrivateKeyInfo: this.use(EncryptedPrivateKeyInfo)
  });
});
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
// https://tools.ietf.org/html/rfc8018
export const PBEParameter = asn.define('PBEParameter', function(){
  this.seq().obj(
    this.key('salt').octstr(8),
    this.key('iterationCount').int()
  );
});

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
      paramters: Buffer.from([0x05, 0x00])
    })
  );
});

///////////////////////////////////////////////////////////////////////////////////////////
export const DesEde3CbcParams = asn.define('DesEde3CbcParams', function(){
  this.octstr();
});


////////////////////////////////////////////////////////////////////////////////////
// https://tools.ietf.org/html/rfc5280
const AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional().any()
  );
});

const Version = asn.define('Version', function () {
  this.int();
});
