/**
 * index.js
 */

import * as rsa from './rsa';

export const generateKey = rsa.generateKey;
export const sign = rsa.sign;
export const verify = rsa.verify;
export const encrypt = rsa.encrypt;
export const decrypt = rsa.decrypt;

export default {generateKey, sign, verify, encrypt, decrypt};
