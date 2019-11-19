/**
 * index.js
 */
import * as pbkdf from './pbkdf';

export const pbkdf2 = pbkdf.pbkdf2;
export const pbkdf1 = pbkdf.pbkdf1;

export default {pbkdf2, pbkdf1}; // both export and export default needs to be declared for compatibility on node and browser.
