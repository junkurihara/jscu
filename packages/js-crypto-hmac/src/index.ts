/**
 * index.js
 */

import * as hmac from './hmac';

export const compute = hmac.compute;
export const verify = hmac.verify;

export default {compute, verify};
