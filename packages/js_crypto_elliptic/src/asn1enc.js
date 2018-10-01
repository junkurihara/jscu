/**
 * asn1enc.js
 */

import params from './params.js';
import asn from 'asn1.js';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;
const BN = asn.bignum;

export function decodeAsn1Signature(asn1sig, namedCurve){
  const asn1sigBuffer = Buffer.from(asn1sig); // This must be Buffer object to get decoded;
  const decoded = ECDSASignature.decode(asn1sigBuffer, 'der');
  const len = params.namedCurves[namedCurve].payloadSize;
  const r = new Uint8Array(decoded.r.toArray('be', len));
  const s = new Uint8Array(decoded.s.toArray('be', len));
  const signature = new Uint8Array(len*2);
  signature.set(r);
  signature.set(s, len);
  return signature;
}

export function encodeAsn1Signature(signature, namedCurve){
  const len = params.namedCurves[namedCurve].payloadSize;
  const r = signature.slice(0, len);
  const s = signature.slice(len, signature.length);
  const asn1sig = ECDSASignature.encode({
    r: new BN(r), s: new BN(s)
  }, 'der');
  return new Uint8Array(asn1sig);
}


/////////////////////////////////////////////////////////////////////////////////////////
const ECDSASignature = asn.define('ECDSASignature', function() {
  this.seq().obj(
    this.key('r').int(),
    this.key('s').int()
  );
});
