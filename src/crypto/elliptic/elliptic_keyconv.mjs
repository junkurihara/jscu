/**
 * elliptic_keyconv.mjs
 */


import elliptic from 'elliptic';
import rfc5280 from 'asn1.js-rfc5280';
import asn from 'asn1.js';
const BN = asn.bignum;

import BufferMod from 'buffer';
import helper from '../../helper/index.mjs';
import cryptoUtil from '../util/index.mjs';
import * as util from './elliptic_util.mjs';
import * as ell from './elliptic_npm.mjs';
const curveList = util.getCurveList();

const Ec = elliptic.ec;

const Buffer = BufferMod.Buffer;


export async function convertJwkToRawKey(jwkey, type) {
  if (type !== 'public' && type !== 'private') throw new Error('type must be public or private');

  let rawKey;
  if (type === 'public') {
    const bufX = await helper.encoder.decodeBase64Url(jwkey.x);
    const bufY = await helper.encoder.decodeBase64Url(jwkey.y);
    rawKey = new Uint8Array(bufX.length + bufY.length + 1);
    rawKey[0]=0x04;
    rawKey.set(bufX, 1);
    rawKey.set(bufY, bufX.length+1);
  }
  else {
    rawKey = await helper.encoder.decodeBase64Url(jwkey.d);
  }
  return rawKey;
}


export async function convertRawKeyToJwk(rawKeyObj, type, namedCurve) {
  if (type !== 'public' && type !== 'private') throw new Error('type must be public or private');
  if (Object.keys(curveList).indexOf(namedCurve) < 0) throw new Error('unsupported curve (alg)');

  const len = util.getPayloadSize(namedCurve);
  if (rawKeyObj.publicKey.length !== len*2+1) throw new Error('something wrong in public key length');

  const bufX = rawKeyObj.publicKey.slice(1, len+1);
  const bufY = rawKeyObj.publicKey.slice(len+1, len*2+1);
  const b64uX = await helper.encoder.encodeBase64Url(bufX);
  const b64uY = await helper.encoder.encodeBase64Url(bufY);

  const jwKey = { // https://www.rfc-editor.org/rfc/rfc7518.txt
    kty: 'EC', // or "RSA", "oct"
    crv: namedCurve,
    x: b64uX, // hex to base64url
    y: b64uY
    // ext: true
  };
  // if(type === 'public'){
  //   jwKey.key_ops = ['verify'];
  // }
  if(type === 'private') {
    jwKey.d = await helper.encoder.encodeBase64Url(rawKeyObj.privateKey);
    // jwKey.key_ops = ['sign'];
  }
  return jwKey;
}

export async function JwkToBin(jwkey, type, namedCurve){
  if(type !== 'public' && type !== 'private') throw new Error('type must be public or private');

  const rawKey = await convertJwkToRawKey(jwkey, type);
  const curve = util.getCurveName(namedCurve);

  // load elliptic for compacting key
  const ec = new Ec(curve);

  let returnKey;
  if(type === 'public'){
    const ecKey = ec.keyFromPublic(rawKey); // convert raw key to ec key object
    const publicKey = ecKey.getPublic('array'); // export as array

    // encode as DER ASN.1 in SubjectPublicKeyInfo (SPKI) format that is readable for WebCrypto API
    returnKey = SubjectPublicKeyInfo.encode({
      algorithm: algorithms[jwkey.crv],
      subjectPublicKey: {unused: 0, data: publicKey}
    }, 'der');
  }
  else {
    const ecKey = ec.keyFromPrivate(rawKey);
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

    hexKeyObj.publicKey = new Uint8Array(decoded.subjectPublicKey.data);
  }
  else{
    const decoded = PrivateKeyInfo.decode(binKeyBuffer, 'der'); // decode binary pkcs8-formatted key to parsed object
    // overwrite nested binary object as parsed object
    decoded.privateKeyAlgorithm.parameters = ECParameters.decode(decoded.privateKeyAlgorithm.parameters, 'der');
    // Work around for optional private key parameter field.
    try{ decoded.privateKey = ECPrivateKey.decode(decoded.privateKey, 'der'); }
    catch(e){ decoded.privateKey = ECPrivateKeyAlt.decode(decoded.privateKey, 'der'); }

    oid = decoded.privateKeyAlgorithm.parameters.value; // get object id

    hexKeyObj.publicKey = new Uint8Array(decoded.privateKey.publicKey.data);
    hexKeyObj.privateKey = new Uint8Array(decoded.privateKey.privateKey);
  }
  const filtered = Object.keys(curveList).filter((elem) => (curveList[elem].oid.toString() === oid.toString()));

  return await convertRawKeyToJwk(hexKeyObj, type, (filtered.length > 0) ? filtered[0] : oid);
}


export function decodeAsn1Signature(asn1sig, namedCurve){
  const asn1sigBuffer = Buffer.from(asn1sig); // This must be Buffer object to get decoded;
  const decoded = ECDSASignature.decode(asn1sigBuffer, 'der');
  const len = util.getPayloadSize(namedCurve);
  const r = new Uint8Array(decoded.r.toArray('be', len));
  const s = new Uint8Array(decoded.s.toArray('be', len));
  const signature = new Uint8Array(len*2);
  signature.set(r);
  signature.set(s, len);
  return signature;
}

export function encodeAsn1Signature(signature, namedCurve){
  const len = util.getPayloadSize(namedCurve);
  const r = signature.slice(0, len);
  const s = signature.slice(len, signature.length);
  const asn1sig = ECDSASignature.encode({
    r: new BN(r), s: new BN(s)
  }, 'der');
  return new Uint8Array(asn1sig);
}


/////////////////////////////////////////////////////////////////////////////////////////
// SPKI PEM <=> X509 Certificate
// https://tools.ietf.org/html/rfc5280
export async function convertJwkToX509 ({publicJwk, privateJwk, options = {}}){
  // default values
  if(typeof options.signature === 'undefined') options.signature = 'ecdsa-with-sha256';
  if(typeof options.days === 'undefined') options.days = 3650;

  // elements of TBSCertificate
  const version = 0; // default, TODO: other versions?

  const serialNumber = new BN(0); // TODO: generate serial num

  const signature = { algorithm: util.getSignatureOid(options.signature) };

  const issuer = { // TODO: set issuer
    type: 'rdnSequence',
    value: [[]],
  };

  const current = (Date.now()/1000) * 1000;
  const validity = {
    notBefore: { type: 'utcTime', value: current },
    notAfter: { type: 'utcTime', value: (current + options.days*86400*1000) }
  };

  const subject = { // TODO: set subject
    type: 'rdnSequence',
    value: [[]],
  };

  const subjectPublicKeyInfo = rfc5280.SubjectPublicKeyInfo.decode(await JwkToBin(publicJwk, 'public', publicJwk.crv), 'der');

  // elements of Certificate
  const tbsCertificate = { version, serialNumber, signature, issuer, validity, subject, subjectPublicKeyInfo };
  const signatureAlgorithm = tbsCertificate.signature; // This must be the same as tbsCertificate.signature field (as specified in RFC).

  // generate signature value
  const encodedTbsCertificate = rfc5280.TBSCertificate.encode(tbsCertificate, 'der');
  const algo = Object.assign(
    { hash: {name: util.getSignatureHash(options.signature)} },
    cryptoUtil.algo.getWebCryptoParamsFromJwk(privateJwk, 'sign')
  );
  const bareSig = await ell.sign(algo, privateJwk, encodedTbsCertificate);
  const signatureValue = { unused: 0, data: Buffer.from(await encodeAsn1Signature(bareSig, privateJwk.crv)) };

  // construct Certificate
  const certBin = rfc5280.Certificate.encode({ tbsCertificate, signatureAlgorithm, signature: signatureValue }, 'der');

  return await helper.formatter.binToPem(certBin, 'certificate');
}


// TODO: pem?
export async function convertX509ToJwk ({certX509Pem}){

  const x509bin = await helper.formatter.pemToBin(certX509Pem);
  const binKeyBuffer = Buffer.from(x509bin); // This must be Buffer object to get decoded;

  const decoded = rfc5280.Certificate.decode(binKeyBuffer, 'der'); // decode binary x509-formatted public key to parsed object
  const binSpki = rfc5280.SubjectPublicKeyInfo.encode(decoded.tbsCertificate.subjectPublicKeyInfo, 'der');

  return await binToJwk(binSpki, 'public');
}


/////////////////////////////////////////////////////////////////////////////////////////
// Originally written by Owen Smith https://github.com/omsmith
// Adapted on Feb 2018 from https://github.com/Brightspace/node-jwk-to-pem/

const ECDSASignature = asn.define('ECDSASignature', function() {
  this.seq().obj(
    this.key('r').int(),
    this.key('s').int()
  );
});



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
Object.keys(curveList).forEach((crv) => {
  parameters[crv] = ECParameters.encode({
    type: 'namedCurve',
    value: curveList[crv].oid
  }, 'der');
  algorithms[crv] = {
    algorithm:  [1, 2, 840, 10045, 2, 1],
    parameters: parameters[crv]
  };
});