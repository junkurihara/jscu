"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomAsciiString = getRandomAsciiString;
exports.getRandomBytes = getRandomBytes;

var util = _interopRequireWildcard(require("./util.js"));

/**
 * random.js
 */

/**
 * secure random 'ASCII' string generator based on getRandomBytes;
 * @param len
 * @return {string}
 */
function getRandomAsciiString(len) {
  var array = getRandomBytes(len);
  var finalString = ''; // Ascii code excluding control characters are in 0x20 -- 0x7e

  for (var i = 0; i < len; i++) {
    array[i] = array[i] % 0x5e + 0x20;
    finalString += String.fromCharCode(array[i]);
  }

  return finalString;
}
/**
 * secure random generator that returns uint 8 array filled with cryptographically secure random bytes
 * @param len
 * @return {Uint8Array}
 */


function getRandomBytes(len) {
  var webCrypto = util.getWebCryptoAll(); // web crypto api or ms crypto

  var nodeCrypto = util.getNodeCrypto(); // implementation on node.js

  var array;

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.getRandomValues === 'function') {
    array = new Uint8Array(len);
    webCrypto.getRandomValues(array); // for modern browsers or legacy ie 11
  } else if (typeof nodeCrypto !== 'undefined') {
    // for node
    array = new Uint8Array(nodeCrypto.randomBytes(len));
  } else {
    throw new Error('UnsupportedEnvironment');
  }

  return array;
}