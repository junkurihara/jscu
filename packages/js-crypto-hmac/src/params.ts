/**
 * params. ts
 */

export type HashTypes =
  'SHA3-512'|'SHA3-384'|'SHA3-256'|'SHA3-224'|'SHA-256'|'SHA-384'|'SHA-512'|'SHA-1'|'MD5';

const params : {
  [index: string]: {
    [index: string]: { nodeName: string, hashSize: number, blockSize: number }
  }
} = {
  hashes: {
    'SHA3-512': {nodeName: 'sha3-512', hashSize: 64, blockSize: 72},
    'SHA3-384': {nodeName: 'sha3-384', hashSize: 48, blockSize: 104},
    'SHA3-256': {nodeName: 'sha3-256', hashSize: 32, blockSize: 136},
    'SHA3-224': {nodeName: 'sha3-224', hashSize: 28, blockSize: 144},
    'SHA-256': {nodeName: 'sha256', hashSize: 32, blockSize: 64},
    'SHA-384': {nodeName: 'sha384', hashSize: 48, blockSize: 128},
    'SHA-512': {nodeName: 'sha512', hashSize: 64, blockSize: 128},
    'SHA-1': {nodeName: 'sha1', hashSize: 20, blockSize: 64},
    'MD5': {nodeName: 'md5', hashSize: 16, blockSize: 64}
  },
};

export default params;
