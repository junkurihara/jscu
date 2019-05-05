/**
 * index.js
 **/
/**
 * Obtain require(crypto) in Node.js environment.
 * @return {undefined|Object} - Node.js crypto object
 */
const getNodeCrypto = () => {
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
};

/**
 * Obtain window.crypto.subtle object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
const getWebCrypto = () => {
  if (typeof window === 'undefined') return undefined;
  if (window.crypto) return window.crypto.subtle;
};

/**
 * Obtain window.crypto.subtle or window.msCrypto.subtle object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
const getWebCryptoAll = () => {
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.msCrypto) return window.msCrypto.subtle;
    if (window.crypto) return window.crypto.subtle;
  }
};

/**
 * Obtain window.crypto or window.msCrypto object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
const getRootWebCryptoAll = () => {
  if (typeof window === 'undefined') return undefined;
  else {
    if (window.msCrypto) return window.msCrypto;
    if (window.crypto) return window.crypto;
  }
};

/**
 * Retrieve MsCryptoObject, i.e., window.msCrypto.subtle
 * @return {undefined|Object}
 */
const getMsCrypto = () => {
  if (typeof window === 'undefined') return undefined;
  if (window.crypto) return undefined;
  if (window.msCrypto) return window.msCrypto.subtle;
};

export default {getNodeCrypto, getWebCrypto, getMsCrypto, getWebCryptoAll, getRootWebCryptoAll};
export {getNodeCrypto, getWebCrypto, getMsCrypto, getWebCryptoAll, getRootWebCryptoAll};
