/**
 * ec.js
 */

import params from './params.js';
import ec from 'js-crypto-ec';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;

/**
 * Sign encoded tbsCertificate with given signature algorithm under the JWK private key.
 * @param {Uint8Array} encodedTbsCertificate - TBS Certificate encoded to Uint8Array.
 * @param {JsonWebKey} privateJwk - Private key object in JWK format.
 * @param {String} signatureAlgorithm - Signature algorithm name like 'ecdsa-with-sha256'.
 * @returns {Promise<{data: Buffer, unused: Number}>} - ASN.1 encoded signature.
 */
export async function getAsn1Signature(encodedTbsCertificate, privateJwk, signatureAlgorithm){
  const asn1sig = await ec.sign(
    encodedTbsCertificate,
    privateJwk,
    params.signatureAlgorithms[signatureAlgorithm].hash,
    'der'
  );
  return {unused: 0, data: Buffer.from(asn1sig)};
}