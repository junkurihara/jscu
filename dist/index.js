"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "aes", {
  enumerable: true,
  get: function get() {
    return _index.default;
  }
});
Object.defineProperty(exports, "random", {
  enumerable: true,
  get: function get() {
    return _index2.default;
  }
});
Object.defineProperty(exports, "hash", {
  enumerable: true,
  get: function get() {
    return _index3.default;
  }
});
Object.defineProperty(exports, "hmac", {
  enumerable: true,
  get: function get() {
    return _index4.default;
  }
});
Object.defineProperty(exports, "hkdf", {
  enumerable: true,
  get: function get() {
    return _index5.default;
  }
});
Object.defineProperty(exports, "x509", {
  enumerable: true,
  get: function get() {
    return _index6.default;
  }
});
Object.defineProperty(exports, "pbkdf", {
  enumerable: true,
  get: function get() {
    return _index7.default;
  }
});
Object.defineProperty(exports, "Key", {
  enumerable: true,
  get: function get() {
    return _index8.Key;
  }
});
exports.pkc = exports.default = void 0;

var _index = _interopRequireDefault(require("js-crypto-aes/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

var _index3 = _interopRequireDefault(require("js-crypto-hash/dist/index.js"));

var _index4 = _interopRequireDefault(require("js-crypto-hmac/dist/index.js"));

var _index5 = _interopRequireDefault(require("js-crypto-hkdf/dist/index.js"));

var _index6 = _interopRequireDefault(require("js-x509-utils/dist/index.js"));

var _index7 = _interopRequireDefault(require("js-crypto-pbkdf/dist/index.js"));

var _index8 = require("js-crypto-key-utils/dist/index.js");

var pkc = _interopRequireWildcard(require("./pkc.js"));

exports.pkc = pkc;

/**
 * index.js
 * Structure of API
 * ---- Key (Key object with methods handling EC and RSA public keys)
 *  |
 *  |-- pkc (public key crypto, EC and RSA) // TODO: Encrypt/decrypt with ECDH standardized procedure
 *  |    |-- generateKey
 *  |    |-- encrypt
 *  |    |-- decrypt
 *  |    |-- sign
 *  |    |-- verify
 *  |
 *  |-- x509 // TODO verify self-signed certificate in single line
 *  |    |-- toJwk
 *  |    |-- fromJwk
 *  |    |-- parse (verify)
 *  |
 *  |-- aes
 *  |-- random
 *  |-- hash
 *  |-- hmac
 *  |-- hkdf
 *  |-- pbkdf
 */
var _default = {
  Key: _index8.Key,
  pkc: pkc,
  x509: _index6.default,
  aes: _index.default,
  random: _index2.default,
  hash: _index3.default,
  hmac: _index4.default,
  hkdf: _index5.default,
  pbkdf: _index7.default
};
exports.default = _default;