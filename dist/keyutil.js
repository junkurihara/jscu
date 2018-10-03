"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "x509", {
  enumerable: true,
  get: function get() {
    return _index2.default;
  }
});
exports.jwk = void 0;

var _index = _interopRequireDefault(require("js-crypto-key-utils/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-x509-utils/dist/index.js"));

/**
 * keyutil.js
 */
var jwk = {};
exports.jwk = jwk;
jwk.to = _index.default.fromJwkTo;
jwk.from = _index.default.toJwkFrom;
jwk.getThumbrint = _index.default.getJwkThumbprint;