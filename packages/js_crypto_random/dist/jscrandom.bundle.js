(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("crypto"));
	else if(typeof define === 'function' && define.amd)
		define(["crypto"], factory);
	else if(typeof exports === 'object')
		exports["jscrandom"] = factory(require("crypto"));
	else
		root["jscrandom"] = factory(root["crypto"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_crypto__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/jun/ProjectJavaScript/js_crypto_random/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default, getRandomBytes, getRandomAsciiString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./random.js */ "./src/random.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRandomBytes", function() { return _random_js__WEBPACK_IMPORTED_MODULE_0__["getRandomBytes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRandomAsciiString", function() { return _random_js__WEBPACK_IMPORTED_MODULE_0__["getRandomAsciiString"]; });

/**
 * index.js
 */

/* harmony default export */ __webpack_exports__["default"] = ({
  getRandomBytes: _random_js__WEBPACK_IMPORTED_MODULE_0__["getRandomBytes"],
  getRandomAsciiString: _random_js__WEBPACK_IMPORTED_MODULE_0__["getRandomAsciiString"]
});


/***/ }),

/***/ "./src/random.js":
/*!***********************!*\
  !*** ./src/random.js ***!
  \***********************/
/*! exports provided: getRandomAsciiString, getRandomBytes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomAsciiString", function() { return getRandomAsciiString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomBytes", function() { return getRandomBytes; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/**
 * random.js
 */

/**
 * secure random 'ASCII' string generator based on getRandomBytes;
 * @param len
 * @return {string}
 */

function getRandomAsciiString(len) {
  var array = getRandomBytes(len);
  var finalString = ''; // Ascii code excluding control characters are in 0x20 -- 0x7e

  for (var i = 0; i < len; i++) {
    array[i] = array[i] % 0x5e + 0x20;
    finalString += String.fromCharCode(array[i]);
  }

  return finalString;
}
/**
 * secure random generator that returns uint 8 array filled with cryptographically secure random bytes
 * @param len
 * @return {Uint8Array}
 */

function getRandomBytes(len) {
  var webCrypto = _util_js__WEBPACK_IMPORTED_MODULE_0__["getWebCryptoAll"](); // web crypto api or ms crypto

  var nodeCrypto = _util_js__WEBPACK_IMPORTED_MODULE_0__["getNodeCrypto"](); // implementation on node.js

  var array;

  if (typeof webCrypto !== 'undefined' && typeof webCrypto.getRandomValues === 'function') {
    array = new Uint8Array(len);
    webCrypto.getRandomValues(array); // for modern browsers or legacy ie 11
  } else if (typeof nodeCrypto !== 'undefined') {
    // for node
    array = new Uint8Array(nodeCrypto.randomBytes(len));
  } else {
    throw new Error('UnsupportedEnvironment');
  }

  return array;
}

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: getWebCryptoAll, getNodeCrypto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWebCryptoAll", function() { return getWebCryptoAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNodeCrypto", function() { return getNodeCrypto; });
/**
 * util.js
 */
function getWebCryptoAll() {
  if (typeof window === 'undefined') return undefined;else {
    if (window.crypto) return window.crypto;else if (window.msCrypto) return window.msCrypto;
  }
}
function getNodeCrypto() {
  if (typeof window !== 'undefined') return undefined;else return __webpack_require__(/*! crypto */ "crypto");
}

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_crypto__;

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc2NyYW5kb20vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2pzY3JhbmRvbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc2NyYW5kb20vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vanNjcmFuZG9tLy4vc3JjL3JhbmRvbS5qcyIsIndlYnBhY2s6Ly9qc2NyYW5kb20vLi9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly9qc2NyYW5kb20vZXh0ZXJuYWwgXCJjcnlwdG9cIiJdLCJuYW1lcyI6WyJnZXRSYW5kb21CeXRlcyIsImdldFJhbmRvbUFzY2lpU3RyaW5nIiwibGVuIiwiYXJyYXkiLCJmaW5hbFN0cmluZyIsImkiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJ3ZWJDcnlwdG8iLCJ1dGlsIiwibm9kZUNyeXB0byIsImdldFJhbmRvbVZhbHVlcyIsIlVpbnQ4QXJyYXkiLCJyYW5kb21CeXRlcyIsIkVycm9yIiwiZ2V0V2ViQ3J5cHRvQWxsIiwid2luZG93IiwidW5kZWZpbmVkIiwiY3J5cHRvIiwibXNDcnlwdG8iLCJnZXROb2RlQ3J5cHRvIiwicmVxdWlyZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQUlBO0FBRWU7QUFBQ0EsZ0JBQWMsRUFBZEEseURBQUQ7QUFBaUJDLHNCQUFvQixFQUFwQkEsK0RBQW9CQTtBQUFyQyxDQUFmOzs7Ozs7Ozs7Ozs7O0FDTkE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FBSUE7QUFFQTs7Ozs7O0FBS08sU0FBU0Esb0JBQVQsQ0FBOEJDLEdBQTlCLEVBQW1DO0FBQ3hDLE1BQU1DLEtBQUssR0FBR0gsY0FBYyxDQUFDRSxHQUFELENBQTVCO0FBQ0EsTUFBSUUsV0FBVyxHQUFHLEVBQWxCLENBRndDLENBSXhDOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsR0FBcEIsRUFBeUJHLENBQUMsRUFBMUIsRUFBOEI7QUFDNUJGLFNBQUssQ0FBQ0UsQ0FBRCxDQUFMLEdBQVlGLEtBQUssQ0FBQ0UsQ0FBRCxDQUFMLEdBQVcsSUFBWixHQUFvQixJQUEvQjtBQUNBRCxlQUFXLElBQUlFLE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQkosS0FBSyxDQUFDRSxDQUFELENBQXpCLENBQWY7QUFDRDs7QUFFRCxTQUFPRCxXQUFQO0FBQ0Q7QUFHRDs7Ozs7O0FBS08sU0FBU0osY0FBVCxDQUF3QkUsR0FBeEIsRUFBNkI7QUFDbEMsTUFBTU0sU0FBUyxHQUFHQyx3REFBQSxFQUFsQixDQURrQyxDQUNROztBQUMxQyxNQUFNQyxVQUFVLEdBQUdELHNEQUFBLEVBQW5CLENBRmtDLENBRU87O0FBRXpDLE1BQUlOLEtBQUo7O0FBRUEsTUFBSSxPQUFPSyxTQUFQLEtBQXFCLFdBQXJCLElBQW9DLE9BQU9BLFNBQVMsQ0FBQ0csZUFBakIsS0FBcUMsVUFBN0UsRUFBeUY7QUFDdkZSLFNBQUssR0FBRyxJQUFJUyxVQUFKLENBQWVWLEdBQWYsQ0FBUjtBQUNBTSxhQUFTLENBQUNHLGVBQVYsQ0FBMEJSLEtBQTFCLEVBRnVGLENBRXJEO0FBQ25DLEdBSEQsTUFJSyxJQUFJLE9BQU9PLFVBQVAsS0FBc0IsV0FBMUIsRUFBd0M7QUFBRTtBQUM3Q1AsU0FBSyxHQUFHLElBQUlTLFVBQUosQ0FBZUYsVUFBVSxDQUFDRyxXQUFYLENBQXVCWCxHQUF2QixDQUFmLENBQVI7QUFDRCxHQUZJLE1BRUU7QUFDTCxVQUFNLElBQUlZLEtBQUosQ0FBVSx3QkFBVixDQUFOO0FBQ0Q7O0FBRUQsU0FBT1gsS0FBUDtBQUNELEM7Ozs7Ozs7Ozs7OztBQy9DRDtBQUFBO0FBQUE7QUFBQTs7O0FBSU8sU0FBU1ksZUFBVCxHQUE0QjtBQUNqQyxNQUFJLE9BQU9DLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUMsT0FBT0MsU0FBUCxDQUFuQyxLQUNLO0FBQ0gsUUFBSUQsTUFBTSxDQUFDRSxNQUFYLEVBQW1CLE9BQU9GLE1BQU0sQ0FBQ0UsTUFBZCxDQUFuQixLQUNLLElBQUlGLE1BQU0sQ0FBQ0csUUFBWCxFQUFxQixPQUFPSCxNQUFNLENBQUNHLFFBQWQ7QUFDM0I7QUFDRjtBQUVNLFNBQVNDLGFBQVQsR0FBd0I7QUFDN0IsTUFBRyxPQUFPSixNQUFQLEtBQWtCLFdBQXJCLEVBQWtDLE9BQU9DLFNBQVAsQ0FBbEMsS0FDSyxPQUFPSSxtQkFBTyxDQUFDLHNCQUFELENBQWQ7QUFDTixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2ZELG9EIiwiZmlsZSI6ImpzY3JhbmRvbS5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJjcnlwdG9cIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiY3J5cHRvXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImpzY3JhbmRvbVwiXSA9IGZhY3RvcnkocmVxdWlyZShcImNyeXB0b1wiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wianNjcmFuZG9tXCJdID0gZmFjdG9yeShyb290W1wiY3J5cHRvXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfY3J5cHRvX18pIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9Vc2Vycy9qdW4vUHJvamVjdEphdmFTY3JpcHQvanNfY3J5cHRvX3JhbmRvbS9kaXN0XCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8qKlxuICogaW5kZXguanNcbiAqL1xuXG5pbXBvcnQge2dldFJhbmRvbUJ5dGVzLCBnZXRSYW5kb21Bc2NpaVN0cmluZ30gZnJvbSAnLi9yYW5kb20uanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7Z2V0UmFuZG9tQnl0ZXMsIGdldFJhbmRvbUFzY2lpU3RyaW5nfTtcbmV4cG9ydCB7Z2V0UmFuZG9tQnl0ZXMsIGdldFJhbmRvbUFzY2lpU3RyaW5nfTsiLCIvKipcbiAqIHJhbmRvbS5qc1xuICovXG5cbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsLmpzJztcblxuLyoqXG4gKiBzZWN1cmUgcmFuZG9tICdBU0NJSScgc3RyaW5nIGdlbmVyYXRvciBiYXNlZCBvbiBnZXRSYW5kb21CeXRlcztcbiAqIEBwYXJhbSBsZW5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUFzY2lpU3RyaW5nKGxlbikge1xuICBjb25zdCBhcnJheSA9IGdldFJhbmRvbUJ5dGVzKGxlbik7XG4gIGxldCBmaW5hbFN0cmluZyA9ICcnO1xuXG4gIC8vIEFzY2lpIGNvZGUgZXhjbHVkaW5nIGNvbnRyb2wgY2hhcmFjdGVycyBhcmUgaW4gMHgyMCAtLSAweDdlXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhcnJheVtpXSA9IChhcnJheVtpXSAlIDB4NWUpICsgMHgyMDtcbiAgICBmaW5hbFN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGFycmF5W2ldKTtcbiAgfVxuXG4gIHJldHVybiBmaW5hbFN0cmluZztcbn1cblxuXG4vKipcbiAqIHNlY3VyZSByYW5kb20gZ2VuZXJhdG9yIHRoYXQgcmV0dXJucyB1aW50IDggYXJyYXkgZmlsbGVkIHdpdGggY3J5cHRvZ3JhcGhpY2FsbHkgc2VjdXJlIHJhbmRvbSBieXRlc1xuICogQHBhcmFtIGxlblxuICogQHJldHVybiB7VWludDhBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUJ5dGVzKGxlbikge1xuICBjb25zdCB3ZWJDcnlwdG8gPSB1dGlsLmdldFdlYkNyeXB0b0FsbCgpOyAvLyB3ZWIgY3J5cHRvIGFwaSBvciBtcyBjcnlwdG9cbiAgY29uc3Qgbm9kZUNyeXB0byA9IHV0aWwuZ2V0Tm9kZUNyeXB0bygpOyAvLyBpbXBsZW1lbnRhdGlvbiBvbiBub2RlLmpzXG5cbiAgbGV0IGFycmF5O1xuXG4gIGlmICh0eXBlb2Ygd2ViQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2ViQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkobGVuKTtcbiAgICB3ZWJDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycmF5KTsgLy8gZm9yIG1vZGVybiBicm93c2VycyBvciBsZWdhY3kgaWUgMTFcbiAgfVxuICBlbHNlIGlmICh0eXBlb2Ygbm9kZUNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgKSB7IC8vIGZvciBub2RlXG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShub2RlQ3J5cHRvLnJhbmRvbUJ5dGVzKGxlbikpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWRFbnZpcm9ubWVudCcpO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufSIsIi8qKlxuICogdXRpbC5qc1xuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRXZWJDcnlwdG9BbGwgKCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiB1bmRlZmluZWQ7XG4gIGVsc2Uge1xuICAgIGlmICh3aW5kb3cuY3J5cHRvKSByZXR1cm4gd2luZG93LmNyeXB0bztcbiAgICBlbHNlIGlmICh3aW5kb3cubXNDcnlwdG8pIHJldHVybiB3aW5kb3cubXNDcnlwdG87XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVDcnlwdG8oKXtcbiAgaWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiB1bmRlZmluZWQ7XG4gIGVsc2UgcmV0dXJuIHJlcXVpcmUoJ2NyeXB0bycpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2NyeXB0b19fOyJdLCJzb3VyY2VSb290IjoiIn0=