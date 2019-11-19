/**
 * params.ts
 */

// oid is referred to rfc5480 https://www.ietf.org/rfc/rfc5480.txt
export const namedCurves: {
  [index: string]: {indutnyName: string, payloadSize: number, oid: number[]}
} = {
  'P-256': {indutnyName: 'p256', payloadSize: 32, oid: [1, 2, 840, 10045, 3, 1, 7]},
  'P-384': {indutnyName: 'p384', payloadSize: 48, oid: [1, 3, 132, 0, 34]},
  'P-521': {indutnyName: 'p521', payloadSize: 66, oid: [1, 3, 132, 0, 35]},
  'P-256K': {indutnyName: 'secp256k1', payloadSize: 32, oid: [1, 3, 132, 0, 10]},
};

// https://tools.ietf.org/html/rfc3279
export const publicKeyAlgorithms: {
  [index: string]: {oid: number[]}
} = {
  'EC': {oid: [1, 2, 840, 10045, 2, 1]},
  'RSA': {oid: [1, 2, 840, 113549, 1, 1, 1]}
};

export const passwordBasedEncryptionSchemes: {
  [index: string]: {oid: number[], hash?: string, encrypt?: string}
} = {
  // PBES1
  'pbeWithMD5AndDES-CBC': {oid: [1, 2, 840, 113549, 1, 5, 3 ], hash: 'MD5', encrypt: 'DES-CBC'},
  'pbeWithSHA1AndDES-CBC': {oid: [1, 2, 840, 113549, 1, 5, 10 ], hash: 'SHA-1', encrypt: 'DES-CBC'},

  // PBES2
  'pbes2': {oid:  [ 1, 2, 840, 113549, 1, 5, 13 ]}
};

export const keyDerivationFunctions: {
  [index: string]: {oid: number[], defaultSaltLen: number}
} = {
  'pbkdf2': {oid: [ 1, 2, 840, 113549, 1, 5, 12 ], defaultSaltLen: 8}
};

export const pbkdf2Prfs: {
  [index: string]: {oid: number[], hash: string}
} = {
  'hmacWithSHA1': {oid: [1, 2, 840, 113549, 2, 7], hash: 'SHA-1'},
  'hmacWithSHA256': {oid: [1, 2, 840, 113549, 2, 9], hash: 'SHA-256'},
  'hmacWithSHA384': {oid: [1, 2, 840, 113549, 2, 10], hash: 'SHA-384'},
  'hmacWithSHA512': {oid: [1, 2, 840, 113549, 2, 11], hash: 'SHA-512'}
};

export const encryptionSchemes: {
  [index: string]: {oid: number[], keyLength: number, ivLength: number}
} = {
  'des-ede3-cbc': {oid: [ 1, 2, 840, 113549, 3, 7 ], keyLength: 24, ivLength: 8},
  'aes128-cbc': {oid: [ 2, 16, 840, 1, 101, 3, 4, 1, 2 ], keyLength: 16, ivLength: 16},
  'aes192-cbc': {oid: [ 2, 16, 840, 1, 101, 3, 4, 1, 22 ], keyLength: 24, ivLength: 16},
  'aes256-cbc': {oid: [ 2, 16, 840, 1, 101, 3, 4, 1, 42 ], keyLength: 32, ivLength: 16}
};

export const hashes: {
  [index: string]: {hashSize: number}
} = {
  'SHA-256': {hashSize: 32},
  'SHA-384': {hashSize: 48},
  'SHA-512': {hashSize: 64},
  'SHA-1': {hashSize: 20}, // SHOULD NOT USE
  'MD5': {hashSize: 16} // SHOULD NOT USE
};


/**
 * Get algorithm name from ObjectIdentifier array loosely.
 * @param {Array<number>} oid - ObjectIdentifier.
 * @param {Object} oidDict - Dictionary of ObjectIdentifier.
 * @return {Array} - Array of ObjectIdentifier array.
 */
export function getAlgorithmFromOid(oid: Array<number>, oidDict: any){
  return Object.keys(oidDict).filter( (k) => oidDict[k].oid.toString() === oid.toString());
}

/**
 * Get algorithm name from ObjectIdentifier array strictly.
 * @param {Array<number>} oid - ObjectIdentifier.
 * @param {Object} dict - Dictionary of ObjectIdentifier.
 * @return {Array} - Exactly one ObjectIdentifier.
 * @throws {Error} - Throws if UnsupportedAlgorithm.
 */
export const getAlgorithmFromOidStrict = (oid: Array<number>, dict: any) => {
  const array = getAlgorithmFromOid(oid, dict);
  if (array.length === 0) throw new Error('UnsupportedAlgorithm');
  return array[0];
};
