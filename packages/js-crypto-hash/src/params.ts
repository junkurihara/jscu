/**
 * params. js
 */

export type HashTypes =
  'SHA3-512'|'SHA3-384'|'SHA3-256'|'SHA3-224'|'SHA-256'|'SHA-384'|'SHA-512'|'SHA-1'|'MD5';

export type Sha3LenType = 224|256|384|512;

const params : {
  [index: string]: {
    [index: string] : {nodeName: string, hashSize: number}
  }
} = {
  hashes: {
    'SHA3-512': {nodeName: 'sha3-512', hashSize: 64},
    'SHA3-384': {nodeName: 'sha3-384', hashSize: 48},
    'SHA3-256': {nodeName: 'sha3-256', hashSize: 32},
    'SHA3-224': {nodeName: 'sha3-224', hashSize: 28},
    'SHA-256': {nodeName: 'sha256', hashSize: 32},
    'SHA-384': {nodeName: 'sha384', hashSize: 48},
    'SHA-512': {nodeName: 'sha512', hashSize: 64},
    'SHA-1': {nodeName: 'sha1', hashSize: 20}, // SHOULD NOT USE
    'MD5': {nodeName: 'md5', hashSize: 16} // SHOULD NOT USE
  },
};

export default params;
