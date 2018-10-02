/**
 * ec.js
 */

import params from './params.js';
import ec from 'js-crypto-ec/dist/index.js';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;

export async function getAsn1Signature(encodedTbsCertificate, privateJwk, signatureAlgorithm){
  const asn1sig = await ec.sign(
    encodedTbsCertificate,
    privateJwk,
    params.signatureAlgorithms[signatureAlgorithm].hash,
    'der'
  );
  return {unused: 0, data: Buffer.from(asn1sig)};
}