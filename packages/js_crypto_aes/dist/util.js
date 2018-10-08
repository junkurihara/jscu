"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getWebCryptoAll=getWebCryptoAll,exports.getNodeCrypto=getNodeCrypto;/**
 * util.js
 */function getWebCryptoAll(){if("undefined"!=typeof window)return window.msCrypto?window.msCrypto.subtle:window.crypto?window.crypto.subtle:void 0}function getNodeCrypto(){return"undefined"==typeof window?require("crypto"):void 0}