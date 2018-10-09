"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebCryptoAll = getWebCryptoAll;
exports.getNodeCrypto = getNodeCrypto;

/**
 * util.js
 */
function getWebCryptoAll() {
  if (typeof window === 'undefined') return undefined;else {
    if (window.msCrypto) return window.msCrypto.subtle;
    if (window.crypto) return window.crypto.subtle;
  }
}

function getNodeCrypto() {
  if (typeof window !== 'undefined') return undefined;else return require('crypto');
}