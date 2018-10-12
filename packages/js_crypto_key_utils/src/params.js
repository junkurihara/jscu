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
    'pbeWithMD5AndDES-CBC': {oid: [1, 2, 840, 113549, 1, 5, 3 ], hash: 'MD5', encrypt: 'DES-CBC'},
    'pbeWithSHA1AndDES-CBC': {oid: [1, 2, 840, 113549, 1, 5, 10 ], hash: 'SHA-1', encrypt: 'DES-CBC'},

    // PBES2
    'pbes2': {oid:  [ 1, 2, 840, 113549, 1, 5, 13 ]}
  },

  keyDerivationFunctions: {
    'pbkdf2': {oid: [ 1, 2, 840, 113549, 1, 5, 12 ], defaultSaltLen: 8}
  },

  pbkdf2Prfs: {
    'hmacWithSHA1': {oid: [1, 2, 840, 113549, 2, 7], hash: 'SHA-1'},
    'hmacWithSHA256': {oid: [1, 2, 840, 113549, 2, 9], hash: 'SHA-256'},
    'hmacWithSHA384': {oid: [1, 2, 840, 113549, 2, 10], hash: 'SHA-384'},
    'hmacWithSHA512': {oid: [1, 2, 840, 113549, 2, 11], hash: 'SHA-512'}
  },

  encryptionSchemes: {
    'des-ede3-cbc': {oid: [ 1, 2, 840, 113549, 3, 7 ], keyLength: 24, ivLength: 8},
    // 'aes128-cbc': {oid: [ 2, 16, 840, 1, 101, 3, 4, 1, 2 ], keyLength: 16, ivLength: 16} // todo
  },

  hashes: {
    'SHA-256': {hashSize: 32},
    'SHA-384': {hashSize: 48},
    'SHA-512': {hashSize: 64},
    'SHA-1': {hashSize: 20}, // SHOULD NOT USE
    'MD5': {hashSize: 16} // SHOULD NOT USE
  }
};

export function getAlgorithmFromOid(oid, oidDict){
  return Object.keys(oidDict).filter( (k) => oidDict[k].oid.toString() === oid.toString());
}

export const getAlgorithmFromOidStrict = (oid, dict) => {
  const array = getAlgorithmFromOid(oid, dict);
  if (array.length === 0) throw new Error('UnsupportedAlgorithm');
  return array[0];
};