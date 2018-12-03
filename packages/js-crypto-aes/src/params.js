/**
 * params.js
 */

export default {
  ciphers: {
    'AES-GCM': {
      nodePrefix: 'aes',
      nodeSuffix: 'gcm',
      ivLength: 12,  // default value of iv length, 12 bytes is recommended for AES-GCM
      tagLength: 16,
      staticIvLength: true // if true, IV length must be always ivLength.
    },
    'AES-CBC': {
      nodePrefix: 'aes',
      nodeSuffix: 'cbc',
      ivLength: 16,
      staticIvLength: true
    }
  }
};