/**
 * util.js
 */

export function getWebCrypto () {
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.crypto) return window.crypto.subtle;
  }
}

export function getNodeCrypto(){
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
}

export function getMsCrypto(){
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.crypto) return undefined;
    if (window.msCrypto) return window.msCrypto.subtle;
  }
}
