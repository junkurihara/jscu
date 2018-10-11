"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * params. js
 */
var _default = {
  hashes: {
    'SHA-256': {
      nodeName: 'sha256',
      hashSize: 32,
      blockSize: 64
    },
    'SHA-384': {
      nodeName: 'sha384',
      hashSize: 48,
      blockSize: 128
    },
    'SHA-512': {
      nodeName: 'sha512',
      hashSize: 64,
      blockSize: 128
    },
    'SHA-1': {
      nodeName: 'sha1',
      hashSize: 20,
      blockSize: 64
    },
    'MD5': {
      nodeName: 'md5',
      hashSize: 16,
      blockSize: 64
    }
  }
};
exports.default = _default;