"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * params.js
 */
var _default = {
  // oid is referred to
  // rfc7427 https://tools.ietf.org/html/rfc7427
  // http://www.umich.edu/~x509/ssleay/asn1-oids.html
  signatureAlgorithms: {
    // ECDSA
    'ecdsa-with-sha256': {
      oid: [1, 2, 840, 10045, 4, 3, 2],
      hash: 'SHA-256'
    },
    'ecdsa-with-sha384': {
      oid: [1, 2, 840, 10045, 4, 3, 3],
      hash: 'SHA-384'
    },
    'ecdsa-with-sha512': {
      oid: [1, 2, 840, 10045, 4, 3, 4],
      hash: 'SHA-512'
    },
    'ecdsa-with-sha1': {
      oid: [1, 2, 840, 10045, 4, 3, 1],
      hash: 'SHA-1'
    },
    // RSASSA-PKCS1-v1_5
    'sha256WithRSAEncryption': {
      oid: [1, 2, 840, 113549, 1, 1, 11],
      hash: 'SHA-256'
    },
    'sha384WithRSAEncryption': {
      oid: [1, 2, 840, 113549, 1, 1, 12],
      hash: 'SHA-384'
    },
    'sha512WithRSAEncryption': {
      oid: [1, 2, 840, 113549, 1, 1, 13],
      hash: 'SHA-512'
    },
    'sha1WithRSAEncryption': {
      oid: [1, 2, 840, 113549, 1, 1, 5],
      hash: 'SHA-1'
    },
    // RSA-PSS
    'rsassaPss': {
      oid: [1, 2, 840, 113549, 1, 1, 10]
    } // default params are sha-1...

  },
  maskGeneratorFunctions: {
    'MGF1': {
      oid: [1, 2, 840, 113549, 1, 1, 8]
    }
  },
  hashes: {
    'SHA-1': {
      oid: [1, 3, 14, 3, 2, 26]
    },
    'SHA-256': {
      oid: [2, 16, 840, 1, 101, 3, 4, 2, 1]
    },
    'SHA-384': {
      oid: [2, 16, 840, 1, 101, 3, 4, 2, 2]
    },
    'SHA-512': {
      oid: [2, 16, 840, 1, 101, 3, 4, 2, 3]
    }
  },
  ans1null: [0x05, 0x00]
};
exports.default = _default;