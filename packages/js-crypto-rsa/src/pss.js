/**
 * pss.js
 */

import params from './params.js';

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
export function checkLength(mode, {k, hash, saltLength}){
  if(mode === 'sign'){
    if (k > (1 << params.hashes[hash].maxInput) - 1) throw new Error('Inconsistent');
    if (k < params.hashes[hash].hashSize + saltLength + 2 || saltLength < 0) throw new Error('EncodingError');
  }
  else if (mode === 'verify') {
    if (k > (1 << params.hashes[hash].maxInput) - 1) throw new Error('Inconsistent');
    if (k < params.hashes[hash].hashSize + saltLength + 2 || saltLength < 0) throw new Error('Inconsistent');
  }
  else throw new Error('InvalidMode');
}