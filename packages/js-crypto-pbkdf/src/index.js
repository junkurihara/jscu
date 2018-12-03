/**
 * index.js
 */
import {pbkdf2, pbkdf1} from './pbkdf.js';

export default {pbkdf2, pbkdf1}; // both export and export default needs to be declared for compatibility on node and browser.
export {pbkdf2, pbkdf1};