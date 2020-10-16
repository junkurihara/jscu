/**
 * ec.js
 */

import * as params from './params';
import ec from 'js-crypto-ec';
import * as BufferMod from 'buffer';
import {SignatureType} from './typedef';
const BufferR = BufferMod.Buffer;

/**
 * Sign encoded tbsCertificate with given signature algorithm under the JWK private key.
 * @param {Uint8Array} encodedTbsCertificate - TBS Certificate encoded to Uint8Array.
 * @param {JsonWebKey} privateJwk - Private key object in JWK format.
 * @param {String} signatureAlgorithm - Signature algorithm name like 'ecdsa-with-sha256'.
 * @returns {Promise<{data: BufferR, unused: Number}>} - ASN.1 encoded signature.
 */
export const getAsn1Signature = async (
  encodedTbsCertificate: Uint8Array,
  privateJwk: JsonWebKey,
  signatureAlgorithm: SignatureType
): Promise<{ unused: 0, data: Buffer }> => {
  const asn1sig = await ec.sign(
    encodedTbsCertificate,
    privateJwk,
    params.signatureAlgorithms[signatureAlgorithm].hash,
    'der'
  );
  return {unused: 0, data: BufferR.from(asn1sig)};
};
