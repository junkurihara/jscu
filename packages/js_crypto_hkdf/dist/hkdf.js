"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.compute=compute;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_params=_interopRequireDefault(require("./params.js")),util=_interopRequireWildcard(require("./util.js")),_index=_interopRequireDefault(require("js-crypto-random/dist/index.js")),_index2=_interopRequireDefault(require("js-crypto-hmac/dist/index.js"));/**
 * hkdf.js
 */ /**
 * Hash-based Key Derivation Function computing from given master secret and salt.
 * If salt is not given, salt would be automatically generated inside.
 * Specification: https://tools.ietf.org/html/rfc5869
 * @param master
 * @param hash
 * @param length
 * @param info
 * @param salt
 * @return {Promise<{key: *, salt: *}>}
 */function compute(){return _compute.apply(this,arguments)}/**
 * Naive implementation of RFC5869 in PureJavaScript
 * @param master
 * @param salt
 * @param hash
 * @param info
 * @param length
 * @return {Promise<Uint8Array>}
 */function _compute(){return _compute=(0,_asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function a(b){var c,d,e,f,g,h,i,j=arguments;return _regenerator.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(c=1<j.length&&void 0!==j[1]?j[1]:"SHA-256",d=2<j.length&&void 0!==j[2]?j[2]:32,e=3<j.length&&void 0!==j[3]?j[3]:"",f=4<j.length&&void 0!==j[4]?j[4]:null,e||(e=""),g=util.getWebCrypto(),f){a.next=10;break}return a.next=9,_index.default.getRandomBytes(d);case 9:f=a.sent;case 10:if("undefined"==typeof g||"function"!=typeof g.importKey||"function"!=typeof g.deriveBits){a.next=28;break}return a.prev=11,a.next=14,g.subtle.importKey("raw",b,{name:"HKDF"},!1,["deriveKey","deriveBits"]);case 14:return i=a.sent,a.next=17,g.subtle.deriveBits({name:"HKDF",salt:f,info:new Uint8Array(e),hash:c},i,8*d);case 17:h=a.sent,h=new Uint8Array(h),a.next=26;break;case 21:return a.prev=21,a.t0=a["catch"](11),a.next=25,rfc5869(b,f,c,e,d);case 25:h=a.sent;case 26:a.next=31;break;case 28:return a.next=30,rfc5869(b,f,c,e,d);case 30:h=a.sent;case 31:return a.abrupt("return",{key:h,salt:f});case 32:case"end":return a.stop();}},a,this,[[11,21]])})),_compute.apply(this,arguments)}function rfc5869(){return _rfc.apply(this,arguments)}function _rfc(){return _rfc=(0,_asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function a(b,c,d,e,f){var g,h,j,k,l,m,n;return _regenerator.default.wrap(function(a){var i=Math.ceil;for(;;)switch(a.prev=a.next){case 0:return g=_params.default.hashes[d].hashSize,a.next=3,_index2.default.compute(c,b,d);case 3:h=a.sent,j=new Uint8Array([]),k=new Uint8Array(i(f/g)*g),l=new Uint8Array(e),m=0;case 8:if(!(m<i(f/g))){a.next=20;break}return n=new Uint8Array(j.length+l.length+1),n.set(j),n.set(l,j.length),n.set(new Uint8Array([m+1]),j.length+l.length),a.next=15,_index2.default.compute(h,n,d);case 15:j=a.sent,k.set(j,g*m);case 17:m++,a.next=8;break;case 20:return a.abrupt("return",k.slice(0,f));case 21:case"end":return a.stop();}},a,this)})),_rfc.apply(this,arguments)}