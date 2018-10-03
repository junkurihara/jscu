"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crypto = exports.default = void 0;

var crypto = _interopRequireWildcard(require("./crypto/index.js"));

exports.crypto = crypto;

/**
 * util.mjs
 */
var _default = {
  crypto: crypto
}; // workaround

exports.default = _default;