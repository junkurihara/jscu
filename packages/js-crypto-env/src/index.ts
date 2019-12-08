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

/**
 * Get native crypto lib name.
 * @return {name: 'msCrypto'|'webCrypto'|'nodeCrypto'|undefined, crypto?: any}
 */
const getCrypto = (): {name: 'msCrypto'|'webCrypto'|'nodeCrypto'|undefined, crypto?: any} => {
  const webCrypto = getWebCrypto();
  const nodeCrypto = getNodeCrypto();
  const msCrypto = getMsCrypto();

  if (typeof nodeCrypto !== 'undefined') return {name: 'nodeCrypto', crypto: nodeCrypto};
  else if(typeof webCrypto !== 'undefined' && typeof msCrypto === 'undefined') return {name: 'webCrypto', crypto: webCrypto};
  else if (typeof msCrypto !== 'undefined') return {name: 'msCrypto', crypto: msCrypto};
  else return {name: undefined};
};

export default {getNodeCrypto, getWebCrypto, getMsCrypto, getWebCryptoAll, getRootWebCryptoAll, getCrypto};
export {getNodeCrypto, getWebCrypto, getMsCrypto, getWebCryptoAll, getRootWebCryptoAll, getCrypto};
