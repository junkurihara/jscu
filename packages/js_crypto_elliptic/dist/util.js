"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebCrypto = getWebCrypto;
exports.getNodeCrypto = getNodeCrypto;

/**
 * util.js
 */
function getWebCrypto() {
  if (typeof window === 'undefined') return undefined;else {
    if (window.crypto) return window.crypto.subtle;
  }
}

function getNodeCrypto() {
  if (typeof window !== 'undefined') return undefined;else return require('crypto');
}