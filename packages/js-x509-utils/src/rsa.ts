/**
 * rsa.js
 */

import * as params from './params';
import * as util from './util';
import rsa from 'js-crypto-rsa';
import asn from 'asn1.js';
const BN = asn.bignum;
import rfc5280 from 'asn1.js-rfc5280';
import * as BufferMod from 'buffer';
import {DER, HashTypes, RsaPssOptions, SignatureType} from './typedef';
const BufferR = BufferMod.Buffer;

/**
 * Sign TBSCertificate under the issuer's RSA private key in JWK format.
 * @param {Uint8Array} encodedTbsCertificate - Message body to be signed.
 * @param {JsonWebKey} privateJwk - A RSA signing key in JWK format.
 * @param {String} algorithm - Name of signing algorithm like 'sha256WithRSAEncryption'.
 * @param {RSAPSSObject} [pssParams] - Effective only for RSASSA-PSS.
 * @returns {Promise<{data: Buffer, unused: number}>} - ASN.1 parsed signature object.
 */
export const getSignature = async (
  encodedTbsCertificate: Uint8Array,
  privateJwk: JsonWebKey,
  algorithm: SignatureType,
  pssParams: RsaPssOptions
): Promise<{ unused: 0, data: Buffer }> => {
  let signature;
  if(algorithm === 'rsassaPss'){
    signature = await rsa.sign( encodedTbsCertificate, privateJwk, pssParams.hash, { name: 'RSA-PSS', saltLength: pssParams.saltLength });
  }
  else {
    signature = await rsa.sign( encodedTbsCertificate, privateJwk, params.signatureAlgorithms[algorithm].hash, { name: 'RSASSA-PKCS1-v1_5' });
  }
  return {unused: 0, data: BufferR.from(signature)};
};

/**
 * Encode RSA-PSS parsed params to ASN.1 Uint8Array binary
 * @param {RSAPSSObject} options - RSA-PSS params as a parsed object.
 * @returns {DER} - Encoded RSA-PSS object.
 */
export const encodeRsassaPssParams = (
  options: RsaPssOptions
): DER => {
  if (options.hash === 'SHA-1' && options.saltLength === 20 && options.explicit === false) return BufferR.from([0x30, 0x00]);
  else {
    const pssParams = {
      hashAlgorithm: {
        algorithm: params.hashes[<HashTypes>options.hash].oid,
        parameters: BufferR.from(params.ans1null)
      },
      maskGenAlgorithm: {
        algorithm: params.maskGeneratorFunctions.MGF1.oid, // only MGF1 is available
        parameters: rfc5280.AlgorithmIdentifier.encode({
          algorithm: params.hashes[<HashTypes>options.hash].oid,
          parameters: BufferR.from(params.ans1null)
        }, 'der')
      },
      saltLength: new BN(options.saltLength),
      trailerField: new BN(1) // default
    };

    return RSASSAPSSParams.encode(pssParams, 'der');
  }
};


/**
 * Parse encoded RSA-PSS parameters represented in Uint8Array.
 * @param {Buffer|Uint8Array} pssParams - Extracted RSA-PSS parameter byte sequence.
 * @returns {{hashForMgf: string, saltLength: number, mgf: string, hash: string}}
 * @throws {Error} - Throws if InvalidCertificateFormat.
 */
export const decodeRsassaPssParams = (
  pssParams: Buffer|Uint8Array
): {hash: HashTypes, mgf: string, hashForMgf: string, saltLength: number} => {
  let returnParams;
  if((new Uint8Array(pssParams)).toString() !== (new Uint8Array([0x30, 0x00]).toString())){
    // non empty params
    const decodedParams = RSASSAPSSParams.decode(pssParams, 'der');
    decodedParams.maskGenAlgorithm.parameters
      = rfc5280.AlgorithmIdentifier.decode(decodedParams.maskGenAlgorithm.parameters, 'der');
    decodedParams.saltLength = decodedParams.saltLength.toNumber();
    decodedParams.trailerField = decodedParams.trailerField.toNumber();

    const hash = util.getKeyFromOid(decodedParams.hashAlgorithm.algorithm, params.hashes);
    const mgf = util.getKeyFromOid(decodedParams.maskGenAlgorithm.algorithm, params.maskGeneratorFunctions);
    const hashForMgf = util.getKeyFromOid(decodedParams.maskGenAlgorithm.parameters.algorithm, params.hashes);
    if(hash.length === 0 || mgf.length === 0 || hashForMgf.length === 0) throw new Error('InvalidCertificateFormat');

    returnParams = {hash: <HashTypes>hash[0], mgf: mgf[0], hashForMgf: hashForMgf[0], saltLength: decodedParams.saltLength};
  }
  else {
    // if empty, defaults are SHA-1 for Sign and MGF1 with SHA-1, using salt of length 20
    returnParams = {hash: <HashTypes>'SHA-1', mgf: 'MGF1', hashForMgf: 'SHA-1', saltLength: 20};
  }

  return returnParams;
};

/////////////////////////////////////////////////////////////////////////////////////////
// RFC4055 https://tools.ietf.org/html/rfc4055
// RFC7427 https://tools.ietf.org/html/rfc7427
// RSASSA-PSS-params  ::=  SEQUENCE  {
//          hashAlgorithm      [0] HashAlgorithm DEFAULT
//                                    sha1Identifier,
//          maskGenAlgorithm   [1] MaskGenAlgorithm DEFAULT
//                                    mgf1SHA1Identifier,
//          saltLength         [2] INTEGER DEFAULT 20,
//          trailerField       [3] INTEGER DEFAULT 1  }
const RSASSAPSSParams = asn.define('rsassaPssParams', function () {
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('hashAlgorithm').explicit(0).use(rfc5280.AlgorithmIdentifier),
    // @ts-ignore
    this.key('maskGenAlgorithm').explicit(1).use(rfc5280.AlgorithmIdentifier),
    // @ts-ignore
    this.key('saltLength').explicit(2).int(),
    // @ts-ignore
    this.key('trailerField').explicit(3).int()
  );
});
