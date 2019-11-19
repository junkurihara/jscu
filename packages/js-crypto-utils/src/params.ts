/**
 * params.js
 */

export const ciphers: {
  [index: string]: {ivLength?: number}
} = {
  'AES-GCM': {ivLength: 12},  // 12 bytes is recommended for AES-GCM
  'AES-CTR': {ivLength: 12},  // 12 bytes is recommended for AES-CTR
  'AES-CBC': {ivLength: 16},  // 16 bytes is recommended for AES-CBC
  'AES-KW': {}
};


export const hashes: {
  [index: string]: {hashSize: number}
} = {
  'SHA3-512': {hashSize: 64},
  'SHA3-384': {hashSize: 48},
  'SHA3-256': {hashSize: 32},
  'SHA3-224': {hashSize: 28},
  'SHA-256': {hashSize: 32},
  'SHA-384': {hashSize: 48},
  'SHA-512': {hashSize: 64},
  'SHA-1': {hashSize: 20},
};
