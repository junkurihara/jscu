/**
 * asn1enc.js
 */

import {namedCurves} from './params';
import asn from 'asn1.js';
import * as BufferMod from 'buffer';
import {CurveTypes} from './typedef';
const Buffer = BufferMod.Buffer;
const BN = asn.bignum;

/**
 * Decode ASN.1 encoded signature byte array.
 * @param {Uint8Array} asn1sig - Byte array of ASN.1 encoded signature.
 * @param {String} namedCurve - Name of curve like 'P-256'.
 * @return {Uint8Array} - Decoded raw signature.
 */
export const decodeAsn1Signature = (asn1sig: Uint8Array, namedCurve: CurveTypes): Uint8Array => {
  const asn1sigBuffer = Buffer.from(asn1sig); // This must be Buffer object to get decoded;
  const decoded = ECDSASignature.decode(asn1sigBuffer, 'der');
  const len = namedCurves[namedCurve].payloadSize;
  const r = new Uint8Array(decoded.r.toArray('be', len));
  const s = new Uint8Array(decoded.s.toArray('be', len));
  const signature = new Uint8Array(len*2);
  signature.set(r);
  signature.set(s, len);
  return signature;
};

/**
 * Encode raw signature and obtain ASN.1-encoded signature.
 * @param {Uint8Array} signature - Byte array of raw signature.
 * @param {String} namedCurve - Name of curve like 'P-256'.
 * @return {Uint8Array} - Encoded ASN.1 signature.
 */
export const encodeAsn1Signature = (signature: Uint8Array, namedCurve: CurveTypes): Uint8Array => {
  const len = namedCurves[namedCurve].payloadSize;
  const r = signature.slice(0, len);
  const s = signature.slice(len, signature.length);
  const asn1sig = ECDSASignature.encode({
    r: new BN(r), s: new BN(s)
  }, 'der');
  return new Uint8Array(asn1sig);
};


/////////////////////////////////////////////////////////////////////////////////////////
// RFC5759 https://tools.ietf.org/html/rfc5759.html
const ECDSASignature = asn.define('ECDSASignature', function(this: any) {
  this.seq().obj(
    this.key('r').int(),
    this.key('s').int()
  );
});
