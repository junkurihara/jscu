/**
 * elliptic_keyconv.mjs
 */


import elliptic from 'elliptic';
const Ec = elliptic.ec;

import asn from 'asn1.js';

import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;

import helper from '../../helper/index.mjs';
import * as util from './elliptic_util.mjs';
import * as params from './elliptic_params.mjs';

export async function JwkToBin(jwkey, type, namedCurve){
  if(type !== 'public' && type !== 'private') throw new Error('type must be public or private');

  const rawHexKey = await util.convertJwkToRawHexKey(jwkey, type);
  const curve = util.getCurveName(namedCurve);

  // load elliptic for compacting key
  const ec = new Ec(curve);

  let returnKey;
  if(type === 'public'){
    const ecKey = ec.keyFromPublic(rawHexKey, 'hex'); // convert raw hex key to ec key object
    const publicKey = ecKey.getPublic('array'); // export as array

    // encode as DER ASN.1 in SubjectPublicKeyInfo (SPKI) format that is readable for WebCrypto API
    returnKey = SubjectPublicKeyInfo.encode({
      algorithm: algorithms[jwkey.crv],
      subjectPublicKey: {unused: 0, data: publicKey}
    }, 'der');
  }
  else {
    const ecKey = ec.keyFromPrivate(rawHexKey, 'hex');
    const publicKey = ecKey.getPublic('array'); // export as array
    const privateKey = ecKey.getPrivate().toArray(); // export as array
    // encode as DER ASN.1 in PrivateKeyInfo of PKCS#8 format that is readable for WebCrypto API
    returnKey = PrivateKeyInfo.encode({
      version: 0,
      privateKeyAlgorithm: algorithms[jwkey.crv],
      privateKey: ECPrivateKey.encode({
        version: 1,
        privateKey,
        parameters: parameters[jwkey.crv], // this is optional but rfc suggested this must be implemented
        publicKey: {unused: 0, data: publicKey}
      }, 'der')
    }, 'der');
  }

  return returnKey;
}


export async function binToJwk(binKey, type){
  if(type !== 'public' && type !== 'private') throw new Error('type must be public or private');

  const binKeyBuffer = Buffer.from(binKey); // This must be Buffer object to get decoded;
  let oid;
  const hexKeyObj = {};
  if(type === 'public') {
    const decoded = SubjectPublicKeyInfo.decode(binKeyBuffer, 'der'); // decode binary spki-formatted key to parsed object
    decoded.algorithm.parameters = ECParameters.decode(decoded.algorithm.parameters, 'der'); // overwrite nested binary object as parsed object
    oid = decoded.algorithm.parameters.value; // get object id

    hexKeyObj.publicKey = helper.formatter.arrayBufferToHexString(decoded.subjectPublicKey.data);
  }
  else{
    const decoded = PrivateKeyInfo.decode(binKeyBuffer, 'der'); // decode binary pkcs8-formatted key to parsed object
    // overwrite nested binary object as parsed object
    decoded.privateKeyAlgorithm.parameters = ECParameters.decode(decoded.privateKeyAlgorithm.parameters, 'der');
    // Work around for optional private key parameter field.
    try{ decoded.privateKey = ECPrivateKey.decode(decoded.privateKey, 'der'); }
    catch(e){ decoded.privateKey = ECPrivateKeyAlt.decode(decoded.privateKey, 'der'); }

    oid = decoded.privateKeyAlgorithm.parameters.value; // get object id

    hexKeyObj.publicKey = helper.formatter.arrayBufferToHexString(decoded.privateKey.publicKey.data);
    hexKeyObj.privateKey = helper.formatter.arrayBufferToHexString(decoded.privateKey.privateKey);

  }
  const filtered = Object.keys(params.curveList).filter((elem) => (params.curveList[elem].oid.toString() === oid.toString()));

  return await util.convertRawHexKeyToJwk(hexKeyObj, type, (filtered.length > 0) ? filtered[0] : oid);
}

/////////////////////////////////////////////////////////////////////////////////////////
// Originally written by Owen Smith https://github.com/omsmith
// Adapted on Feb 2018 from https://github.com/Brightspace/node-jwk-to-pem/

/* eslint-disable no-invalid-this */
const ECParameters = asn.define('ECParameters', function() {
  this.choice({
    namedCurve: this.objid()
  });
});

const Version = asn.define('Version', function() {
  this.int();
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

// https://tools.ietf.org/html/rfc5208
const PrivateKeyInfo = asn.define('PrivateKeyInfo', function() {
  this.seq().obj(
    this.key('version').use(Version),
    this.key('privateKeyAlgorithm').use(AlgorithmIdentifier),
    this.key('privateKey').octstr(),
    this.key('attributes').optional().any()
  );
});

//https://tools.ietf.org/html/rfc5480
const AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function() {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional().any()
  );
});
const SubjectPublicKeyInfo = asn.define('SubjectPublicKeyInfo', function() {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  );
});

const parameters = {};
const algorithms = {};
Object.keys(params.curveList).forEach((crv) => {
  parameters[crv] = ECParameters.encode({
    type: 'namedCurve',
    value: params.curveList[crv].oid
  }, 'der');
  algorithms[crv] = {
    algorithm:  [1, 2, 840, 10045, 2, 1],
    parameters: parameters[crv]
  };
});