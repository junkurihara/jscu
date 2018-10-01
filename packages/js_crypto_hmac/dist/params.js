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
      hashSize: 32
    },
    'SHA-384': {
      nodeName: 'sha384',
      hashSize: 48
    },
    'SHA-512': {
      nodeName: 'sha512',
      hashSize: 64
    }
  }
};
exports.default = _default;