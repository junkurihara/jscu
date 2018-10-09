/**
 * util.js
 */

export function getWebCryptoAll () {
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.msCrypto) return window.msCrypto.subtle;
    if (window.crypto) return window.crypto.subtle;
  }
}

export function getNodeCrypto(){
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
}