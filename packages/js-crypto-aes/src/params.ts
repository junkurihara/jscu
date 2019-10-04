/**
 * params.js
 */

export type cipherTypes = 'AES-GCM'|'AES-CBC'|'AES-CTR'|'AES-KW';

// for encryption and decryption
export interface cipherOptions {
  name: cipherTypes,
  iv?: Uint8Array,
  additionalData?: Uint8Array,
  tagLength?: number
}

export interface cipherParams {
  nodePrefix: string,
  nodeSuffix: string,
  ivLength?: number,
  tagLength?: number,
  staticIvLength: boolean,
  defaultIv?: Uint8Array
}

const ciphers: {[index: string]: cipherParams} = {
  'AES-GCM': {
    nodePrefix: 'aes-',
    nodeSuffix: '-gcm',
    ivLength: 12,  // default value of iv length, 12 bytes is recommended for AES-GCM
    tagLength: 16,
    staticIvLength: true, // if true, IV length must be always ivLength.
  },
  'AES-CBC': {
    nodePrefix: 'aes-',
    nodeSuffix: '-cbc',
    ivLength: 16,
    staticIvLength: true,
  },
  'AES-CTR': {
    nodePrefix: 'aes-',
    nodeSuffix: '-ctr',
    ivLength: 12, // default value
    staticIvLength: false,
  }
};

const wrapKeys: {[index: string]: cipherParams} = {
  'AES-KW': {
    nodePrefix: 'id-aes',
    nodeSuffix: '-wrap',
    ivLength: 8,
    staticIvLength: true,
    defaultIv: new Uint8Array([0xA6, 0xA6, 0xA6, 0xA6, 0xA6, 0xA6, 0xA6, 0xA6])
  }
};

export default {ciphers, wrapKeys};
