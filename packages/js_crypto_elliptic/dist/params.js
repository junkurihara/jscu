"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * params.js
 */
var _default = {
  namedCurves: {
    'P-256': {
      indutnyName: 'p256',
      nodeName: 'prime256v1',
      payloadSize: 32
    },
    'P-384': {
      indutnyName: 'p384',
      nodeName: 'secp384r1',
      payloadSize: 48
    },
    'P-521': {
      indutnyName: 'p521',
      nodeName: 'secp521r1',
      payloadSize: 66
    },
    'P-256K': {
      indutnyName: 'secp256k1',
      nodeName: 'secp256k1',
      payloadSize: 32
    }
  },
  hashes: {
    'SHA-256': {
      nodeName: 'sha256'
    },
    //, hashSize: 32},
    'SHA-384': {
      nodeName: 'sha384'
    },
    //, hashSize: 48},
    'SHA-512': {
      nodeName: 'sha512'
    },
    //, hashSize: 64}
    'SHA-1': {
      nodeName: 'sha1'
    } //, hashSize: 20},

  }
};
exports.default = _default;