/**
 * default_params.mjs
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
    algo: {
      name: 'ECDSA',
      namedCurve: 'P-256',
      hash: { name: 'SHA-256' } // hash is used for signing and verification. never used for key generation.
    },
    extractable: true, // to export private key as PEM
    keyUsage: ['sign', 'verify']
  },
};
