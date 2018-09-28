/**
 * asn1ec.js
 */

import asn from 'asn1.js';

import params, {getAlgorithmFromOid} from './params.js';
import {octKeyObjToJwk, octKeyObjFromJwk} from './octenc.js';

/**
 * Convert JWK to parsed ASN.1 EC key object
 * @param jwk
 * @param type
 * @param compact
 * @return {object}
 */
export function fromJWK(jwk, type, compact=false){
  if (Object.keys(params.namedCurves).indexOf(jwk.crv) < 0) throw new Error('UnsupportedCurve');
  const octkeyObj = octKeyObjFromJwk(jwk, type, compact);

  const publicKeyAlgorithmOid = params.publicKeyAlgorithms['EC'].oid;
  const publicKey = {unused: 0, data: Array.from(octkeyObj.publicKey)};//Buffer.from(octkeyObj.publicKey)};
  const parameters = ECParameters.encode({ type: 'namedCurve', value: params.namedCurves[jwk.crv].oid }, 'der');
  const algorithm = { algorithm: publicKeyAlgorithmOid, parameters };

  const decoded = {};
  if(type === 'public'){ // SPKI
    decoded.subjectPublicKey = publicKey;
    decoded.algorithm = algorithm;
  }
  else if (type === 'private') { // PKCS8
    decoded.version = 0;
    decoded.privateKeyAlgorithm = algorithm;
    decoded.privateKey = ECPrivateKey.encode({
      version: 1,
      privateKey: Array.from(octkeyObj.privateKey), //Buffer.from(octkeyObj.privateKey),
      parameters,
      publicKey
    }, 'der');
  }
  return decoded;
}


/**
 * Convert parsed ASN.1 EC key object to JWK
 * @param decoded
 * @param type
 * @return {{kty, crv, x, y}}
 */
export function toJWK(decoded, type){
  if (type === 'public'){ // SPKI
    decoded.algorithm.parameters = ECParameters.decode(decoded.algorithm.parameters, 'der'); // overwrite nested binary object as parsed object
    const octPubKey = new Uint8Array(decoded.subjectPublicKey.data); // convert oct key to jwk
    const namedCurves = getAlgorithmFromOid(decoded.algorithm.parameters.value, params.namedCurves);
    if(namedCurves.length < 1) throw new Error('UnsupportedCurve');

    return octKeyObjToJwk({publicKey: octPubKey}, type, namedCurves[0]);
  }
  else if (type === 'private'){ // PKCS8
    decoded.privateKeyAlgorithm.parameters = ECParameters.decode(decoded.privateKeyAlgorithm.parameters, 'der');
    // Work around for optional private key parameter field.
    try{ decoded.privateKey = ECPrivateKey.decode(decoded.privateKey, 'der'); }
    catch(e){ decoded.privateKey = ECPrivateKeyAlt.decode(decoded.privateKey, 'der'); }

    const octPubKey = new Uint8Array(decoded.privateKey.publicKey.data);
    const octPrivKey = new Uint8Array(decoded.privateKey.privateKey);

    const namedCurves = getAlgorithmFromOid(decoded.privateKeyAlgorithm.parameters.value, params.namedCurves);
    if(namedCurves.length < 1) throw new Error('UnsupportedCurve');

    return octKeyObjToJwk({publicKey: octPubKey, privateKey: octPrivKey}, type, namedCurves[0]);
  }
}

/////////////////////////
// https://tools.ietf.org/html/rfc5480
const ECParameters = asn.define('ECParameters', function() {
  this.choice({
    namedCurve: this.objid()
  });
});

// https://tools.ietf.org/html/rfc5915
const ECPrivateKey = asn.define('ECPrivateKey', function() {
  this.seq().obj(
    this.key('version').int(),
    this.key('privateKey').octstr(),
    this.key('parameters').explicit(0).optional().any(), // rfc suggested that this must be implemented
    this.key('publicKey').explicit(1).optional().bitstr() // rfc suggested that this must be implemented
  );
});

const ECPrivateKeyAlt = asn.define('ECPrivateKey', function() {
  this.seq().obj(
    this.key('version').int(),
    this.key('privateKey').octstr(),
    // this.key('parameters').explicit(0).optional().any(), // rfc suggested that this must be implemented
    this.key('publicKey').explicit(1).optional().bitstr() // rfc suggested that this must be implemented
  );
});