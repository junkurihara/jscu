"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "generateKey", {
  enumerable: true,
  get: function get() {
    return _rsa.generateKey;
  }
});
Object.defineProperty(exports, "sign", {
  enumerable: true,
  get: function get() {
    return _rsa.sign;
  }
});
Object.defineProperty(exports, "verify", {
  enumerable: true,
  get: function get() {
    return _rsa.verify;
  }
});
Object.defineProperty(exports, "encrypt", {
  enumerable: true,
  get: function get() {
    return _rsa.encrypt;
  }
});
Object.defineProperty(exports, "decrypt", {
  enumerable: true,
  get: function get() {
    return _rsa.decrypt;
  }
});
exports.default = void 0;

var _rsa = require("./rsa.js");

/**
 * index.js
 */
var _default = {
  generateKey: _rsa.generateKey,
  sign: _rsa.sign,
  verify: _rsa.verify,
  encrypt: _rsa.encrypt,
  decrypt: _rsa.decrypt
};
exports.default = _default;