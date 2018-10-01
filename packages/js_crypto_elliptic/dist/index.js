"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "generateKey", {
  enumerable: true,
  get: function get() {
    return _ec.generateKey;
  }
});
Object.defineProperty(exports, "sign", {
  enumerable: true,
  get: function get() {
    return _ec.sign;
  }
});
Object.defineProperty(exports, "verify", {
  enumerable: true,
  get: function get() {
    return _ec.verify;
  }
});
Object.defineProperty(exports, "deriveSecret", {
  enumerable: true,
  get: function get() {
    return _ec.deriveSecret;
  }
});
exports.default = void 0;

var _ec = require("./ec.js");

/**
 * index.js
 */
var _default = {
  generateKey: _ec.generateKey,
  sign: _ec.sign,
  verify: _ec.verify,
  deriveSecret: _ec.deriveSecret
};
exports.default = _default;