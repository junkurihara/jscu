/**
 * random.js
 */

import * as util from 'js-crypto-env';

/**
 * Secure random string generator based on getRandomBytes,
 * which is composed of uppercase or lowercase alphanumeric characters;
 * @param {Number} len - Length of string.
 * @return {String} - Generated random ASCII string.
 */
export const getRandomString = (len) => {
  const array = getRandomBytes(len);
  const types = getRandomBytes(len); // indicating alphanumeric, upper, lower
  let finalString = '';

  // Ascii code
  // 1-0: 0x30 -- 0x39, 10 chars
  // A-Z: 0x41 -- 0x5a,
  // a-z: 0x61 -- 0x7a
  for (let i = 0; i < len; i++) {
    types[i] = (types[i] % 3);
    array[i] = (types[i] === 0) ?
      (array[i] % 10) + 0x30 :
      (array[i] % 26) + ((types[i] === 1) ? 0x41 : 0x61);
    finalString += String.fromCharCode(array[i]);
  }

  return finalString;
};

/**
 * Secure random 'ASCII' string generator based on getRandomBytes;
 * @param {Number} len - Length of ASCII string.
 * @return {String} - Generated random ASCII string.
 */
export const getRandomAsciiString = (len) => {
  const array = getRandomBytes(len);
  let finalString = '';

  // Ascii code excluding control characters are in 0x20 -- 0x7e
  for (let i = 0; i < len; i++) {
    array[i] = (array[i] % 0x5e) + 0x20;
    finalString += String.fromCharCode(array[i]);
  }

  return finalString;
};


/**
 * Secure random generator that returns a byte array filled with cryptographically secure random bytes
 * @param {Number} len - Byte length of random sequence.
 * @return {Uint8Array} - Generated random sequence.
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const getRandomBytes = (len) => {
  const webCrypto = util.getRootWebCryptoAll(); // web crypto api or ms crypto
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  let array;

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.getRandomValues === 'function') {
    array = new Uint8Array(len);
    webCrypto.getRandomValues(array); // for modern browsers or legacy ie 11
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    array = new Uint8Array(nodeCrypto.randomBytes(len));
  } else {
    throw new Error('UnsupportedEnvironment');
  }

  return array;
};
