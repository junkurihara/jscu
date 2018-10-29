"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebCrypto = getWebCrypto;

/**
 * util.js
 */
function getWebCrypto() {
  if (typeof window === 'undefined') return undefined;else {
    if (window.crypto) return window.crypto.subtle;
  }
}