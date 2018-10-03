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
exports.pkc = exports.keyUtil = exports.default = void 0;

var _index = _interopRequireDefault(require("js-crypto-aes/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

var _index3 = _interopRequireDefault(require("js-crypto-hash/dist/index.js"));

var _index4 = _interopRequireDefault(require("js-crypto-hmac/dist/index.js"));

var _index5 = _interopRequireDefault(require("js-crypto-hkdf/dist/index.js"));

var keyUtil = _interopRequireWildcard(require("./keyutil.js"));

exports.keyUtil = keyUtil;

var pkc = _interopRequireWildcard(require("./pkc.js"));

exports.pkc = pkc;

/**
 * index.js
 * Structure of API
 * --- keyUtil (key utilities for EC and RSA public keys)
 *  |    |-- jwk
 *  |    |    |-- to
 *  |    |    |-- from
 *  |    |    |-- getThumbprint
 *  |    |-- x509 // TODO RSA
 *  |         |-- toJwk
 *  |         |-- fromJwk
 *  |         |-- parse (verify)
 *  |
 *  |-- pkc (public key crypto, EC and RSA) // TODO: RSA and encrypt/decrypt with ECDH standard procedure
 *  |    |-- generateKey
 *  |    |-- encrypt
 *  |    |-- decrypt
 *  |    |-- sign
 *  |    |-- verify
 *  |
 *  |-- aes
 *  |-- random
 *  |-- hash
 *  |-- hmac
 *  |-- hkdf
 */
var _default = {
  keyUtil: keyUtil,
  pkc: pkc,
  aes: _index.default,
  random: _index2.default,
  hash: _index3.default,
  hmac: _index4.default,
  hkdf: _index5.default
};
exports.default = _default;