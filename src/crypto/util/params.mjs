/**
 * params.mjs
 */

import pino from 'pino';

export default {
  logOptions: {
    level: 'info',
    prettyPrint: true,
    serializers: {err: pino.stdSerializers.err},
    browser: {asObject: true}
  },

  keyParams: {
    keyType: 'EC',
    namedCurve: 'P-256'
  },

  webCryptoKeyParamsEC: { // just for key generation for ECDH and ECDSA
    algo: {
      name: 'ECDSA',
      hash: { name: 'SHA-256' } // hash is used for signing and verification. never used for key generation.
    },
    extractable: true, // to export private key as PEM
    keyUsage: ['sign', 'verify']
  },

  hashes: {
    'SHA-256': {name: 'sha256', hashSize: 32},
    'SHA-384': {name: 'sha384', hashSize: 48},
    'SHA-512': {name: 'sha512', hashSize: 64}
  },

  ciphers: {
    'AES-GCM': {prefix: 'aes', suffix: 'gcm', ivLength: 12, tagLength: 16}  // 12 bytes is recommended for AES-GCM
  }
};
