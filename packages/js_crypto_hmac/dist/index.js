"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "compute", {
  enumerable: true,
  get: function get() {
    return _hmac.compute;
  }
});
Object.defineProperty(exports, "verify", {
  enumerable: true,
  get: function get() {
    return _hmac.verify;
  }
});
exports.default = void 0;

var _hmac = require("./hmac.js");

/**
 * index.js
 */
var _default = {
  compute: _hmac.compute,
  verify: _hmac.verify
};
exports.default = _default;