"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkLength = checkLength;

var _params = _interopRequireDefault(require("./params.js"));

/**
 * pss.js
 */
// RFC3447 https://tools.ietf.org/html/rfc3447

/*
       # Sign
       - If the length of M is greater than the input limitation for the
       hash function (2^61 - 1 octets for SHA-1), output "message too
       long" and stop.

       - If emLen < hLen + sLen + 2, output "encoding error" and stop.

       # Verify
       - If the length of M is greater than the input limitation for the
       hash function (2^61 - 1 octets for SHA-1), output "inconsistent"
       and stop.

       - If emLen < hLen + sLen + 2, output "inconsistent" and stop.
 */
// emLen = Math.ceil((modBits(=k) - 1)/8), e.g., Math.ceil(2047/8) = 256, that is exactly equal to k)
function checkLength(mode, _ref) {
  var k = _ref.k,
      hash = _ref.hash,
      saltLength = _ref.saltLength;

  if (mode === 'sign') {
    if (k > (1 << _params.default.hashes[hash].maxInput) - 1) throw new Error('Inconsistent');
    if (k < _params.default.hashes[hash].hashSize + saltLength + 2 || saltLength < 0) throw new Error('EncodingError');
  } else if (mode === 'verify') {
    if (k > (1 << _params.default.hashes[hash].maxInput) - 1) throw new Error('Inconsistent');
    if (k < _params.default.hashes[hash].hashSize + saltLength + 2 || saltLength < 0) throw new Error('Inconsistent');
  } else throw new Error('InvalidMode');
}