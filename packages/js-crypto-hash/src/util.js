/**
 * util.js
 */

/**
 * Retrieve WebCryptoAPI object, i.e., window.crypto.subtle
 * @return {undefined|Object}
 */
export function getWebCrypto () {
  if (typeof window === 'undefined') return undefined;
  if (window.crypto) return window.crypto.subtle;
}

/**
 * Retrieve Node.js crypto object, i.e., require('crypto')
 * @return {undefined|Object}
 */
export function getNodeCrypto(){
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
}

/**
 * Retrieve MsCryptoObject, i.e., window.msCrypto.subtle
 * @return {undefined|Object}
 */
export function getMsCrypto(){
  if (typeof window === 'undefined') return undefined;
  if (window.crypto) return undefined;
  if (window.msCrypto) return window.msCrypto.subtle;
}
