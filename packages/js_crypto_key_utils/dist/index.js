"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "fromJwkTo", {
  enumerable: true,
  get: function get() {
    return _converter.fromJwkTo;
  }
});
Object.defineProperty(exports, "toJwkFrom", {
  enumerable: true,
  get: function get() {
    return _converter.toJwkFrom;
  }
});
Object.defineProperty(exports, "getJwkThumbprint", {
  enumerable: true,
  get: function get() {
    return _thumbprint.getJwkThumbprint;
  }
});
exports.default = void 0;

var _converter = require("./converter.js");

var _thumbprint = require("./thumbprint.js");

/**
 * index.js
 */
var _default = {
  fromJwkTo: _converter.fromJwkTo,
  toJwkFrom: _converter.toJwkFrom,
  getJwkThumbprint: _thumbprint.getJwkThumbprint
};
exports.default = _default;