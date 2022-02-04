/**
 * index.js
 **/
/**
 * Obtain require(crypto) in Node.js environment.
 * @return {undefined|Object} - Node.js crypto object
 */
const getNodeCrypto = () : undefined|any => {
  if (typeof window !== 'undefined' && window.crypto) {
    return undefined;
  } else if (typeof window === 'undefined' && typeof crypto !== 'undefined') {
    return undefined;
  }
  else return require('crypto');
};

/**
 * Obtain window.crypto.subtle object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
const getWebCrypto = () : undefined|any => {
  if (typeof window !== 'undefined' && window.crypto) { // standard window.crypto
    return window.crypto.subtle;
  } else if (typeof window === 'undefined' && typeof crypto !== 'undefined'){ // case of service worker
    // eslint-disable-next-line no-undef
    return crypto.subtle;
  }
  return undefined;
};


/**
 * Obtain window.crypto object in browser environments.
 * @return {undefined|Object} - WebCrypto API object
 */
const getRootWebCrypto = () : undefined|any => {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  } else if (typeof window === 'undefined' && typeof crypto !== 'undefined'){
    // eslint-disable-next-line no-undef
    return crypto;
  }
  return undefined;
};

/**
 * Get native crypto lib name.
 * @return {name: 'webCrypto'|'nodeCrypto'|undefined, crypto?: any}
 */
const getCrypto = (): {name: 'webCrypto'|'nodeCrypto'|undefined, crypto?: any} => {
  const webCrypto = getWebCrypto();
  const nodeCrypto = getNodeCrypto();

  if (typeof nodeCrypto !== 'undefined') return {name: 'nodeCrypto', crypto: nodeCrypto};
  else if(typeof webCrypto !== 'undefined') return {name: 'webCrypto', crypto: webCrypto};
  else return {name: undefined};
};

export default {getNodeCrypto, getWebCrypto, getRootWebCrypto, getCrypto};
export {getNodeCrypto, getWebCrypto, getRootWebCrypto, getCrypto};
