/**
 * util.js
 */

import jseu from 'js-encoding-utils';
import {PrivateKeyStructure} from './asn1def.js';

/**
 * Check if the given key is encrypted
 * @param key
 * @param format : pem or der
 * @return {boolean}
 */
export function isEncryptedPrivateKey(key, format='pem'){
  try {
    // Peel the pem strings
    const binKey = (format === 'pem') ? jseu.formatter.pemToBin(key, 'private') : key;

    const decoded = PrivateKeyStructure.decode(Buffer.from(binKey), 'der');
    if (decoded.type === 'encryptedPrivateKeyInfo') return true;
    else if (decoded.type === 'oneAsymmetricKey') return false;
  }
  catch(e) { throw new Error('FaildToCheck'); }
}