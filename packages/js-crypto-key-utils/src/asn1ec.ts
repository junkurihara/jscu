/**
 * asn1ec.js
 */

import asn from 'asn1.js';

import * as params from './params';
import {fromJwk as octKeyFromJwk, toJwk as octKeyToJwk} from './octenc';
import {CurveTypes, DecodedAsn1Key, PublicOrPrivate} from './typedef';


/**
 * Convert JWK to parsed ASN.1 EC key object
 * @param {JsonWebKey} jwk - A key object in JWK format.
 * @param {PublicOrPrivate} type - 'public' or 'private'
 * @param {boolean} [compact=false] - *Only for EC public keys*, the compact form of public key is given as ASN.1 object if true.
 * @return {Object} - Parsed ASN.1 object.
 */
export const fromJWK = (
  jwk: JsonWebKey,
  type: PublicOrPrivate,
  compact: boolean = false
): DecodedAsn1Key => {
  const octetPublicKey = <Uint8Array>octKeyFromJwk(jwk, {outputFormat: 'binary', outputPublic: true, compact});

  const publicKeyAlgorithmOid = params.publicKeyAlgorithms['EC'].oid;
  const publicKey = {unused: 0, data: Array.from(octetPublicKey)};//Buffer.from(octkeyObj.publicKey)};
  const parameters = ECParameters.encode({ type: 'namedCurve', value: params.namedCurves[<string>jwk.crv].oid }, 'der');
  const algorithm = { algorithm: publicKeyAlgorithmOid, parameters };

  const decoded: DecodedAsn1Key = {};
  if(type === 'public'){ // SPKI
    decoded.subjectPublicKey = publicKey;
    decoded.algorithm = algorithm;
  }
  else if (type === 'private') { // PKCS8
    const octetPrivateKey = <Uint8Array>octKeyFromJwk(jwk, {outputFormat: 'binary', outputPublic: false, compact});
    decoded.version = 0; // no public key presents for v2 (0)
    decoded.privateKeyAlgorithm = algorithm;
    decoded.privateKey = ECPrivateKey.encode({
      version: 1,
      privateKey: Array.from(octetPrivateKey), //Buffer.from(octkeyObj.privateKey),
      parameters,
      publicKey
    }, 'der');
  }
  return decoded;
};


/**
 * Convert parsed ASN.1 EC key object to JWK.
 * @param {Object} decoded - Parsed ASN.1 EC key object.
 * @param {PublicOrPrivate} type - 'public' or 'private'
 * @return {JsonWebKey} - Converted key objects in JWK format.
 * @throws {Error} - Throws if UnsupportedCurve.
 */
export const toJWK = (
  decoded: DecodedAsn1Key,
  type: PublicOrPrivate
): JsonWebKey => {
  if (type === 'public'){ // SPKI
    decoded.algorithm.parameters = ECParameters.decode(decoded.algorithm.parameters, 'der'); // overwrite nested binary object as parsed object
    const octPubKey = new Uint8Array(decoded.subjectPublicKey.data); // convert oct key to jwk
    const namedCurves = params.getAlgorithmFromOid(decoded.algorithm.parameters.value, params.namedCurves);

    return octKeyToJwk(octPubKey, <CurveTypes>namedCurves[0], {outputPublic: true});
  }
  else { // type === 'private', PKCS8
    decoded.privateKeyAlgorithm.parameters = ECParameters.decode(decoded.privateKeyAlgorithm.parameters, 'der');
    // Work around for optional private key parameter field.
    try{ decoded.privateKey = ECPrivateKey.decode(decoded.privateKey, 'der'); }
    catch(e){ decoded.privateKey = ECPrivateKeyAlt.decode(decoded.privateKey, 'der'); }

    const octPrivKey = new Uint8Array(decoded.privateKey.privateKey);

    const namedCurves = params.getAlgorithmFromOid(decoded.privateKeyAlgorithm.parameters.value, params.namedCurves);
    if(namedCurves.length < 1) throw new Error('UnsupportedCurve');

    return octKeyToJwk(octPrivKey, <CurveTypes>namedCurves[0], {outputPublic: false});
  }
};

/////////////////////////
/**
 * ECParameters specified in RFC 5480 {@link https://tools.ietf.org/html/rfc5480}.
 * @type {AsnObject}
 */
const ECParameters = asn.define('ECParameters', function() {
  // @ts-ignore
  this.choice({
    // @ts-ignore
    namedCurve: this.objid()
  });
});

/**
 * ECPrivateKey specified in RFC 5915 {@link https://tools.ietf.org/html/rfc5915}.
 * @type {AsnObject}
 */
const ECPrivateKey = asn.define('ECPrivateKey', function() {
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('version').int(),
    // @ts-ignore
    this.key('privateKey').octstr(),
    // @ts-ignore
    this.key('parameters').explicit(0).optional().any(), // rfc suggested that this must be implemented
    // @ts-ignore
    this.key('publicKey').explicit(1).optional().bitstr() // rfc suggested that this must be implemented
  );
});

/**
 * ECPrivateKey Alternative for an work around...
 * @type {AsnObject}
 */
const ECPrivateKeyAlt = asn.define('ECPrivateKey', function() {
  // @ts-ignore
  this.seq().obj(
    // @ts-ignore
    this.key('version').int(),
    // @ts-ignore
    this.key('privateKey').octstr(),
    // this.key('parameters').explicit(0).optional().any(), // rfc suggested that this must be implemented
    // @ts-ignore
    this.key('publicKey').explicit(1).optional().bitstr() // rfc suggested that this must be implemented
  );
});
