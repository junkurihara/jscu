/**
 * index
 */

import * as ec from './ec';

export const generateKey = ec.generateKey;
export const sign = ec.sign;
export const verify = ec.verify;
export const deriveSecret = ec.deriveSecret;

export default {generateKey, sign, verify, deriveSecret};
