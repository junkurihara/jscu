"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getWebCrypto=getWebCrypto,exports.getNodeCrypto=getNodeCrypto;/**
 * util.js
 */function getWebCrypto(){if("undefined"!=typeof window)return window.crypto?window.crypto.subtle:void 0}function getNodeCrypto(){return"undefined"==typeof window?require("crypto"):void 0}// TODO: MSCrypto is unsupported at this point
// export function getMsCrypto(){
//   if (typeof window === 'undefined') return undefined;
//   else {
//     if (window.crypto) return undefined;
//     if (window.msCrypto) return window.msCrypto.subtle;
//   }
// }