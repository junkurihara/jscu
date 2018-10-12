"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "encrypt", {
  enumerable: true,
  get: function get() {
    return _aes.encrypt;
  }
});
Object.defineProperty(exports, "decrypt", {
  enumerable: true,
  get: function get() {
    return _aes.decrypt;
  }
});
exports.default = void 0;

var _aes = require("./aes.js");

/**
 * index.js
 */
var _default = {
  encrypt: _aes.encrypt,
  decrypt: _aes.decrypt
};
exports.default = _default;