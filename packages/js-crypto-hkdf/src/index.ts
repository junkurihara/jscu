/**
 * index.js
 */

import * as hkdf from './hkdf';
import * as nist from './nist-concat-kdf';

export const compute = hkdf.compute;
export const nistConcatKdf = nist.nistConcatKdf;

export default {compute, nistConcatKdf};
