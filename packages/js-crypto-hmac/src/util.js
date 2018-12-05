/**
 * util.js
 */

/**
 * Obtain window.crypto.subtle or window.msCrypto.subtle object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
export function getWebCryptoAll () {
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.msCrypto) return window.msCrypto.subtle;
    else if (window.crypto) return window.crypto.subtle;
  }
}

/**
 * Obtain require(crypto) in Node.js environment.
 * @return {undefined|Object} - Node.js crypto object
 */
export function getNodeCrypto(){
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
}
