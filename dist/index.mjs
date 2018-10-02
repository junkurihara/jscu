"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crypto = exports.default = void 0;

var crypto = _interopRequireDefault(require("./crypto/index.mjs"));

exports.crypto = crypto;

/**
 * util.mjs
 */
var _default = {
  crypto: crypto
}; // workaround

exports.default = _default;