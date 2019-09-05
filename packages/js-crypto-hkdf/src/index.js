/**
 * index.js
 */

import {compute} from './hkdf.js';
import {nistConcatKdf} from './nist-concat-kdf';

export default {compute, nistConcatKdf};
export {compute, nistConcatKdf};
