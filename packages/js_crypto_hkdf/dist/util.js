"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getWebCrypto=getWebCrypto;/**
 * util.js
 */function getWebCrypto(){if("undefined"!=typeof window)return window.crypto?window.crypto.subtle:void 0}