/**
 * util.js
 */

export function getWebCryptoAll () {
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.crypto) return window.crypto;
    else if (window.msCrypto) return window.msCrypto;
  }
}

export function getNodeCrypto(){
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
}
