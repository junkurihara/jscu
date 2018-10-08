"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.encrypt=encrypt,exports.decrypt=decrypt;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),util=_interopRequireWildcard(require("./util.js")),nodeapi=_interopRequireWildcard(require("./nodeapi.js")),webapi=_interopRequireWildcard(require("./webapi.js")),_params=_interopRequireDefault(require("./params.js"));/**
 * aes.js
 */ /**
 * Check if the given algorithm spec is valid.
 * @param name
 * @param iv
 * @param tagLength
 */function assertAlgorithms(a){var b=Number.isInteger,c=a.name,d=a.iv,e=a.tagLength;if(0>Object.keys(_params.default.ciphers).indexOf(c))throw new Error("UnsupportedAlgorithm");if(_params.default.ciphers[c].ivLength){if(!(d instanceof Uint8Array))throw new Error("InvalidArguments");if(2>d.byteLength||14<d.byteLength)throw new Error("InvalidIVLength");if(_params.default.ciphers[c].staticIvLength&&_params.default.ciphers[c].ivLength!==d.byteLength)throw new Error("InvalidIVLength")}if(_params.default.ciphers[c].tagLength&&e){if(!b(e))throw new Error("InvalidArguments");if(4>e||16<e)throw new Error("InvalidTagLength")}}/**
 * Encrypt with AES
 * @param msg
 * @param key
 * @param name
 * @param iv
 * @param additionalData
 * @param tagLength
 * @return {Promise<Uint8Array>}
 */function encrypt(){return _encrypt.apply(this,arguments)}/**
 * Decrypt with AES
 * @param data
 * @param key
 * @param name
 * @param iv
 * @param additionalData
 * @param tagLength
 * @return {Promise<Uint8Array>}
 */function _encrypt(){return _encrypt=(0,_asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function a(b,c,d){var e,f,g,h,i,j,k,l,m,n;return _regenerator.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(e=d.name,f=void 0===e?"AES-GCM":e,g=d.iv,h=d.additionalData,i=void 0===h?new Uint8Array([]):h,j=d.tagLength,b instanceof Uint8Array&&c instanceof Uint8Array){a.next=3;break}throw new Error("InvalidArguments");case 3:return assertAlgorithms({name:f,iv:g,tagLength:j}),_params.default.ciphers[f].tagLength&&!j&&(j=_params.default.ciphers[f].tagLength),a.next=7,util.getWebCryptoAll();case 7:return k=a.sent,a.next=10,util.getNodeCrypto();case 10:if(l=a.sent,m=!0,"undefined"==typeof k||"function"!=typeof k.importKey||"function"!=typeof k.encrypt){a.next=18;break}return a.next=15,webapi.encrypt(b,c,{name:f,iv:g,additionalData:i,tagLength:j},k).catch(function(){m=!1});case 15:n=a.sent,a.next=19;break;case 18:if("undefined"!=typeof l)// for node
try{n=nodeapi.encrypt(b,c,{name:f,iv:g,additionalData:i,tagLength:j},l)}catch(a){m=!1}else m=!1;case 19:if(!1!==m){a.next=21;break}throw new Error("UnsupportedEnvironment");case 21:return a.abrupt("return",n);case 22:case"end":return a.stop();}},a,this)})),_encrypt.apply(this,arguments)}function decrypt(){return _decrypt.apply(this,arguments)}function _decrypt(){return _decrypt=(0,_asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function a(b,c,d){var e,f,g,h,i,j,k,l,m,n,o;return _regenerator.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(e=d.name,f=void 0===e?"AES-GCM":e,g=d.iv,h=d.additionalData,i=void 0===h?new Uint8Array([]):h,j=d.tagLength,b instanceof Uint8Array&&c instanceof Uint8Array){a.next=3;break}throw new Error("InvalidArguments");case 3:return assertAlgorithms({name:f,iv:g,tagLength:j}),_params.default.ciphers[f].tagLength&&!j&&(j=_params.default.ciphers[f].tagLength),a.next=7,util.getWebCryptoAll();case 7:return k=a.sent,a.next=10,util.getNodeCrypto();case 10:if(l=a.sent,m=!0,"undefined"==typeof k||"function"!=typeof k.importKey||"function"!=typeof k.encrypt){a.next=18;break}return a.next=15,webapi.decrypt(b,c,{name:f,iv:g,additionalData:i,tagLength:j},k).catch(function(a){m=!1,n=a.message});case 15:o=a.sent,a.next=19;break;case 18:if("undefined"!=typeof l)try{o=nodeapi.decrypt(b,c,{name:f,iv:g,additionalData:i,tagLength:j},l)}catch(a){m=!1,n=a.message}case 19:if(!1!==m){a.next=25;break}if(!n){a.next=24;break}throw new Error(n);case 24:throw new Error("UnsupportedEnvironment");case 25:return a.abrupt("return",o);case 26:case"end":return a.stop();}},a,this)})),_decrypt.apply(this,arguments)}