"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "fromJwk", {
  enumerable: true,
  get: function get() {
    return _x.fromJwk;
  }
});
Object.defineProperty(exports, "toJwk", {
  enumerable: true,
  get: function get() {
    return _x.toJwk;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function get() {
    return _x.parse;
  }
});
exports.default = void 0;

var _x = require("./x509.js");

/**
 * index.js
 */
var _default = {
  fromJwk: _x.fromJwk,
  toJwk: _x.toJwk,
  parse: _x.parse
};
exports.default = _default;