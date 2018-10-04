/**
 * params.js
 */

export default {
  // maxInput: 2^maxInput - 1 octets
  hashes: {
    'SHA-256': {nodeName: 'sha256', hashSize: 32, maxInput: 61},
    'SHA-384': {nodeName: 'sha384', hashSize: 48, maxInput: 125},
    'SHA-512': {nodeName: 'sha512', hashSize: 64, maxInput: 125}
  },
};