/**
 * params.js
 */

export default {
// oid is referred to rfc7427 https://tools.ietf.org/html/rfc7427
  signatureAlgorithms: {
    'ecdsa-with-sha256': {oid: [1, 2, 840, 10045, 4, 3, 2], hash: 'SHA-256'},
    'ecdsa-with-sha384': {oid: [1, 2, 840, 10045, 4, 3, 3], hash: 'SHA-384'},
    'ecdsa-with-sha512': {oid: [1, 2, 840, 10045, 4, 3, 4], hash: 'SHA-512'}
  }
};
