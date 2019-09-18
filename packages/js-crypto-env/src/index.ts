/**
 * index.js
 **/
/**
 * Obtain require(crypto) in Node.js environment.
 * @return {undefined|Object} - Node.js crypto object
 */
const getNodeCrypto = () : undefined|any => {
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
};

/**
 * Obtain window.crypto.subtle object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
const getWebCrypto = () : undefined|any => {
  if (typeof window !== 'undefined' && window.crypto) return window.crypto.subtle;
  return undefined;
};

/**
 * Obtain window.crypto.subtle or window.msCrypto.subtle object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
const getWebCryptoAll = () : undefined|any => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (window.msCrypto) return window.msCrypto.subtle;
    if (window.crypto) return window.crypto.subtle;
  }
  return undefined;
};

/**
 * Obtain window.crypto or window.msCrypto object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
const getRootWebCryptoAll = () : undefined|any => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (window.msCrypto) return window.msCrypto;
    if (window.crypto) return window.crypto;
  }
  return undefined;
};

/**
 * Retrieve MsCryptoObject, i.e., window.msCrypto.subtle
 * @return {undefined|Object}
 */
const getMsCrypto = () : undefined|any => {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.msCrypto) return window.msCrypto.subtle;
  return undefined;
};

export default {getNodeCrypto, getWebCrypto, getMsCrypto, getWebCryptoAll, getRootWebCryptoAll};
export {getNodeCrypto, getWebCrypto, getMsCrypto, getWebCryptoAll, getRootWebCryptoAll};
