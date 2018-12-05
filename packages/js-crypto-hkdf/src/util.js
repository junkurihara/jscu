/**
 * util.js
 */

/**
 * Retrive WebCryptoAPI object, i.e., window.crypto.subtle
 * @return {undefined|Object}
 */
export function getWebCrypto () {
  if (typeof window === 'undefined') return undefined;
  if (window.crypto) return window.crypto.subtle;
}