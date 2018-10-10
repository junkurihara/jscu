/**
 * params.js
 */

export default {
  // oid is referred to rfc5480 https://www.ietf.org/rfc/rfc5480.txt
  namedCurves: {
    'P-256': {indutnyName: 'p256', payloadSize: 32, oid: [1, 2, 840, 10045, 3, 1, 7]},
    'P-384': {indutnyName: 'p384', payloadSize: 48, oid: [1, 3, 132, 0, 34]},
    'P-521': {indutnyName: 'p521', payloadSize: 66, oid: [1, 3, 132, 0, 35]},
    'P-256K': {indutnyName: 'secp256k1', payloadSize: 32, oid: [1, 3, 132, 0, 10]},
  },

  // https://tools.ietf.org/html/rfc3279
  publicKeyAlgorithms: {
    'EC': {oid: [1, 2, 840, 10045, 2, 1]},
    'RSA': {oid: [1, 2, 840, 113549, 1, 1, 1]}
  },

  passwordBasedEncryptionSchemes: {
    // PBES1
    'pbeWithMD5AndDES-CBC': {oid: [1, 2, 840, 113549, 1, 5, 3 ]},
    'pbeWithSHA1AndDES-CBC': {oid: [1, 2, 840, 113549, 1, 5, 10 ]},

    // PBES2
    'pbes2': {oid:  [ 1, 2, 840, 113549, 1, 5, 13 ]}
  },

  keyDerivationFunctions: {
    'pbkdf2': {oid: [ 1, 2, 840, 113549, 1, 5, 12 ]}
  },

  pbkdf2Prfs: {
    'hmacWithSHA1': {oid: [1, 2, 840, 113549, 2, 7]},
    'hmacWithSHA256': {oid: [1, 2, 840, 113549, 2, 9]},
    'hmacWithSHA384': {oid: [1, 2, 840, 113549, 2, 10]},
    'hmacWithSHA512': {oid: [1, 2, 840, 113549, 2, 11]}
  },

  encryptionSchemes: {
    'des-ede3-cbc': {oid: [ 1, 2, 840, 113549, 3, 7 ]}
  }
};

export function getAlgorithmFromOid(oid, oidDict){
  return Object.keys(oidDict).filter( (k) => oidDict[k].oid.toString() === oid.toString());
}