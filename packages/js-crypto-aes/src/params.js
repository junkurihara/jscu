/**
 * params.js
 */

export default {
  // encryption parameters
  ciphers: {
    'AES-GCM': {
      nodePrefix: 'aes-',
      nodeSuffix: '-gcm',
      ivLength: 12,  // default value of iv length, 12 bytes is recommended for AES-GCM
      tagLength: 16,
      staticIvLength: true // if true, IV length must be always ivLength.
    },
    'AES-CBC': {
      nodePrefix: 'aes-',
      nodeSuffix: '-cbc',
      ivLength: 16,
      staticIvLength: true
    },
    'AES-CTR': {
      nodePrefix: 'aes-',
      nodeSuffix: '-ctr',
      ivLength: 12, // default value
      staticIvLength: false
    }
  },

  // key wrapping parameters
  wrapKeys: {
    'AES-KW': {
      nodePrefix: 'id-aes',
      nodeSuffix: '-wrap',
      ivLength: 8,
      staticIvLength: true,
      defaultIV: new Uint8Array([0xA6, 0xA6, 0xA6, 0xA6, 0xA6, 0xA6, 0xA6, 0xA6])
    }
  }
};
