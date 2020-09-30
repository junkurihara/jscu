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
export const getRandomString = (len: number): string => {
  const array: Uint8Array = getRandomBytes(len);
  const types: Uint8Array = getRandomBytes(len); // indicating alphanumeric, upper, lower
  let finalString: string = '';

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
export const getRandomAsciiString = (len: number) : string => {
  const array: Uint8Array = getRandomBytes(len);
  let finalString: string = '';

  // Ascii code excluding control characters are in 0x20 -- 0x7e
  for (let i = 0; i < len; i++) {
    array[i] = (array[i] % 0x5e) + 0x20;
    finalString += String.fromCharCode(array[i]);
  }

  return finalString;
};

/**
 * Secure random string generator based on getRandomBytes,
 * which is composed of givin character candidates;
 * @param {Number} len - Length of string.
 * @param {String} candidates - Candidates string to sample randomly.
 * @return {String} - Generated random string.
 */
export const getRandomSampledString = (len: number, candidates: string) => {
  const candidateLen = candidates.length;
  if (candidateLen === 0) return '';
  const array = getRandomBytes(len);
  let finalString: string = '';

  for (let i = 0; i < len; i++) {
    finalString += candidates[array[i] % candidateLen];
  }

  return finalString;
};


/**
 * Secure random generator that returns a byte array filled with cryptographically secure random bytes
 * @param {Number} len - Byte length of random sequence.
 * @return {Uint8Array} - Generated random sequence.
 * @throws {Error} - Throws if UnsupportedEnvironment.
 */
export const getRandomBytes = (len: number) : Uint8Array => {
  const webCrypto = util.getRootWebCrypto(); // web crypto api
  const nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.getRandomValues === 'function') {
    const array = new Uint8Array(len);
    webCrypto.getRandomValues(array); // for modern browsers
    return array;
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    return new Uint8Array(nodeCrypto.randomBytes(len));
  } else {
    throw new Error('UnsupportedEnvironment');
  }
};
