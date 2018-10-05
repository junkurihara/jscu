/**
 * params.js
 */

export default {
  ciphers: {
    'AES-GCM': {ivLength: 12}  // 12 bytes is recommended for AES-GCM
  },

  hashes: {
    'SHA-256': {hashSize: 32},
    'SHA-384': {hashSize: 48},
    'SHA-512': {hashSize: 64},
    'SHA-1': {hashSize: 20},
  },
};
