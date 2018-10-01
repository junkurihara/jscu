/**
 * index.js
 */

import {generateKey, sign, verify, deriveSecret} from './ec.js';

export default {generateKey, sign, verify, deriveSharedSecret: deriveSecret};
export {generateKey, sign, verify, deriveSecret};