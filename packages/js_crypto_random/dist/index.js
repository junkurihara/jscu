"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getRandomBytes", {
  enumerable: true,
  get: function get() {
    return _random.getRandomBytes;
  }
});
Object.defineProperty(exports, "getRandomAsciiString", {
  enumerable: true,
  get: function get() {
    return _random.getRandomAsciiString;
  }
});
exports.default = void 0;

var _random = require("./random.js");

/**
 * index.js
 */
var _default = {
  getRandomBytes: _random.getRandomBytes,
  getRandomAsciiString: _random.getRandomAsciiString
};
exports.default = _default;