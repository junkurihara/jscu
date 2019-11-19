/**
 * index.js
 */

import * as aes from './aes';

export const encrypt = aes.encrypt;
export const decrypt = aes.decrypt;
export const wrapKey = aes.wrapKey;
export const unwrapKey = aes.unwrapKey;

export default {encrypt, decrypt, wrapKey, unwrapKey};
