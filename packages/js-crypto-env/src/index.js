/**
 * index.js
 **/
export default {getNodeCrypto, getWebCrypto, getMsCrypto, getWebCryptoAll, getRootWebCryptoAll};
export {getNodeCrypto, getWebCrypto, getMsCrypto, getWebCryptoAll, getRootWebCryptoAll};
/**
 * Obtain require(crypto) in Node.js environment.
 * @return {undefined|Object} - Node.js crypto object
 */
function getNodeCrypto(){
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
}

/**
 * Obtain window.crypto.subtle object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
function getWebCrypto () {
  if (typeof window === 'undefined') return undefined;
  if (window.crypto) return window.crypto.subtle;
}

/**
 * Obtain window.crypto.subtle or window.msCrypto.subtle object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
function getWebCryptoAll () {
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.msCrypto) return window.msCrypto.subtle;
    if (window.crypto) return window.crypto.subtle;
  }
}

/**
 * Obtain window.crypto or window.msCrypto object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
function getRootWebCryptoAll () {
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.msCrypto) return window.msCrypto;
    if (window.crypto) return window.crypto;
  }
}



/**
 * Retrieve MsCryptoObject, i.e., window.msCrypto.subtle
 * @return {undefined|Object}
 */
function getMsCrypto(){
  if (typeof window === 'undefined') return undefined;
  if (window.crypto) return undefined;
  if (window.msCrypto) return window.msCrypto.subtle;
}
