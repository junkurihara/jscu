/**
 * keyutil.js
 */


import keyutil from 'js-crypto-key-utils/dist/index.js';
import x509 from 'js-x509-utils/dist/index.js';

const jwk = {};
jwk.to = keyutil.fromJwkTo;
jwk.from = keyutil.toJwkFrom;
jwk.getThumbrint = keyutil.getJwkThumbprint;

export {jwk, x509};