/**
 * params.ts
 */

export const namedCurves: {
  [index: string]: { nodeName: string, indutnyName: string, payloadSize: number }
} = {
  'P-256': {indutnyName: 'p256', nodeName: 'prime256v1', payloadSize: 32},
  'P-384': {indutnyName: 'p384', nodeName: 'secp384r1', payloadSize: 48},
  'P-521': {indutnyName: 'p521', nodeName: 'secp521r1', payloadSize: 66},
  'P-256K': {indutnyName: 'secp256k1', nodeName: 'secp256k1', payloadSize: 32},
};

export const hashes: {
  [index: string]: { nodeName: string }
} = {
  'SHA-256': {nodeName: 'sha256'}, //, hashSize: 32},
  'SHA-384': {nodeName: 'sha384'}, //, hashSize: 48},
  'SHA-512': {nodeName: 'sha512'}, //, hashSize: 64}
  'SHA-1': {nodeName: 'sha1'}, //, hashSize: 20},
};
