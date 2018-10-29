"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "compute", {
  enumerable: true,
  get: function get() {
    return _hkdf.compute;
  }
});
exports.default = void 0;

var _hkdf = require("./hkdf.js");

/**
 * index.js
 */
var _default = {
  compute: _hkdf.compute
};
exports.default = _default;