"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEncryptedPrivateKey = isEncryptedPrivateKey;

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _asn1def = require("./asn1def.js");

/**
 * util.js
 */

/**
 * Check if the given key is encrypted
 * @param key
 * @param format : pem or der
 * @return {boolean}
 */
function isEncryptedPrivateKey(key) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'pem';

  try {
    // Peel the pem strings
    var binKey = format === 'pem' ? _jsEncodingUtils.default.formatter.pemToBin(key, 'private') : key;

    var decoded = _asn1def.PrivateKeyStructure.decode(Buffer.from(binKey), 'der');

    if (decoded.type === 'encryptedPrivateKeyInfo') return true;else if (decoded.type === 'oneAsymmetricKey') return false;
  } catch (e) {
    throw new Error('FaildToCheck');
  }
}