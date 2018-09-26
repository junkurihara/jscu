/**
 * random.js
 */

import * as util from './util.js';

/**
 * secure random 'ASCII' string generator based on getRandomBytes;
 * @param len
 * @return {Promise<string>}
 */
export async function getRandomAsciiString(len) {
  const array = await getRandomBytes(len);
  let finalString = '';

  // Ascii code excluding control characters are in 0x20 -- 0x7e
  for (let i = 0; i < len; i++) {
    array[i] = (array[i] % 0x5e) + 0x20;
    finalString += String.fromCharCode(array[i]);
  }

  return finalString;
}


/**
 * secure random generator that returns uint 8 array filled with cryptographically secure random bytes
 * @param len
 * @return {Promise<Uint8Array>}
 */
export async function getRandomBytes(len) {
  const webCrypto = util.getWebCryptoAll(); // web crypto api or ms crypto
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let array = new Uint8Array(len);

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.getRandomValues === 'function') {
    webCrypto.getRandomValues(array); // for modern browsers or legacy ie 11
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    array = new Uint8Array(nodeCrypto.randomBytes(len));
  } else {
    throw new Error('UnsupportedEnvironment');
  }

  return array;
}