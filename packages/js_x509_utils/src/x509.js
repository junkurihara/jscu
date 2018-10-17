/**
 * x509.js
 */

import params from './params.js';
import * as rsa from './rsa.js';
import * as ecdsa from './ec.js';
import BN from 'bn.js';
import rfc5280 from 'asn1.js-rfc5280';
import jseu from 'js-encoding-utils';
import random from 'js-crypto-random/dist/index.js';
import {Key} from 'js-crypto-key-utils/dist/index.js';

import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;

/**
 * Convert jwk to X509 pem
 * @param publicJwk
 * @param privateJwk
 * @param format
 * @param options
 * @return {Promise<*>}
 */
export async function fromJwk(publicJwk, privateJwk, format = 'pem', options = {}) {
  // default values
  if (typeof options.signature === 'undefined') options.signature = 'ecdsa-with-sha256';
  if (typeof options.days === 'undefined') options.days = 3650;
  if (typeof options.issuer === 'undefined') options.issuer = {organizationName: 'Self'};
  if (typeof options.subject === 'undefined') options.subject = {organizationName: 'Self'};

  // default params for RSA-PSS
  if (typeof options.saltLength === 'undefined' && options.signature === 'rsassaPss') options.saltLength = 20;
  if (typeof options.hash === 'undefined' && options.signature === 'rsassaPss') options.hash = 'SHA-1';
  if (typeof options.explicit === 'undefined' && options.signature === 'rsassaPss') options.explicit = true;

  ///////////////////////////////
  // elements of TBSCertificate
  ///////////////////////////////

  const version = 0; // default, TODO: other versions?

  // random serial numbers
  const rand = await random.getRandomBytes(20); // max 20 octets
  const serialNumber = new BN(rand);

  // TODO: throw exception if private jwk keytype doesn't match signatureAlgorithm
  const signature = { algorithm: params.signatureAlgorithms[options.signature].oid };
  if (options.signature === 'rsassaPss') {
    signature.parameters = rsa.encodeRsassaPssParams(options);
  } else signature.parameters = Buffer.from(params.ans1null);

  const issuer = {type: 'rdnSequence', value: setRDNSequence(options.issuer)};

  const current = (Date.now() / 1000) * 1000;
  const validity = {
    notBefore: {type: 'utcTime', value: current},
    notAfter: {type: 'utcTime', value: (current + options.days * 86400 * 1000)}
  };

  const subject = {type: 'rdnSequence', value: setRDNSequence(options.subject)};

  const publicObj = new Key('jwk', publicJwk);
  const spkiDer = Buffer.from(await publicObj.export('der', {compact: false, outputPublic: true})); // {compact: false} is active only for ecc keys
  const subjectPublicKeyInfo = rfc5280.SubjectPublicKeyInfo.decode(spkiDer, 'der');

  // elements of Certificate
  const tbsCertificate = {version, serialNumber, signature, issuer, validity, subject, subjectPublicKeyInfo};
  const signatureAlgorithm = tbsCertificate.signature; // This must be the same as tbsCertificate.signature field (as specified in RFC).

  // generate signature value
  const encodedTbsCertificate = rfc5280.TBSCertificate.encode(tbsCertificate, 'der');
  let signatureValue;
  if (privateJwk.kty === 'EC'){
    signatureValue = await ecdsa.getAsn1Signature(encodedTbsCertificate, privateJwk, options.signature);
  } else if (privateJwk.kty === 'RSA') {
    signatureValue = await rsa.getSignature(
      encodedTbsCertificate, privateJwk, options.signature, options.hash, options.saltLength
    );
  } else throw new Error ('UnsupportedKeyType');

  // construct Certificate
  const certBin = rfc5280.Certificate.encode({tbsCertificate, signatureAlgorithm, signature: signatureValue}, 'der');

  if (format === 'pem') {
    return jseu.formatter.binToPem(certBin, 'certificate');
  }
  else if (format === 'der') {
    return certBin;
  }
  else {
    throw new Error('InvalidFormatSpecification');
  }
}

/**
 * Convert X.509 certificate to JWK
 * @param certX509
 * @param format
 * @return {Promise<void>}
 */
export async function toJwk(certX509, format = 'pem'){
  let x509bin;
  if (format === 'pem') x509bin = jseu.formatter.pemToBin(certX509);
  else if (format === 'der') x509bin = certX509;
  else throw new Error('InvalidFormatSpecification');

  const binKeyBuffer = Buffer.from(x509bin); // This must be Buffer object to get decoded;

  const decoded = rfc5280.Certificate.decode(binKeyBuffer, 'der'); // decode binary x509-formatted public key to parsed object
  const binSpki = rfc5280.SubjectPublicKeyInfo.encode(decoded.tbsCertificate.subjectPublicKeyInfo, 'der');
  const publicObj = new Key('der', binSpki);
  return await publicObj.export('jwk', {outputPublic: true});
}


/**
 * Parse X.509 certificate and return DER-encoded TBSCertificate and DER encoded signature
 * @param certX509
 * @param format
 * @return {{tbsCertificate: *, signatureValue: *, signatureAlgorithm: *}}
 */
export function parse(certX509, format = 'pem'){

  let x509bin;
  if (format === 'pem') x509bin = jseu.formatter.pemToBin(certX509);
  else if (format === 'der') x509bin = certX509;
  else throw new Error('InvalidFormatSpecification');

  const binKeyBuffer = Buffer.from(x509bin); // This must be Buffer object to get decoded;

  const decoded = rfc5280.Certificate.decode(binKeyBuffer, 'der'); // decode binary x509-formatted public key to parsed object
  const sigOid = decoded.signatureAlgorithm.algorithm;
  const sigParam = decoded.signatureAlgorithm.parameters;

  const filter = Object.keys(params.signatureAlgorithms).filter(
    (name) => params.signatureAlgorithms[name].oid.toString() === sigOid.toString()
  );
  if(filter.length <= 0) throw new Error('UnsupportedSignatureAlgorithm');
  const signatureAlgorithm = {algorithm: filter[0]};

  if (filter[0] === 'rsassaPss') signatureAlgorithm.parameters = rsa.decodeRsassaPssParams(sigParam);
  else signatureAlgorithm.parameters = { hash: params.signatureAlgorithms[signatureAlgorithm.algorithm].hash };

  const binTBSCertificate = rfc5280.TBSCertificate.encode(decoded.tbsCertificate, 'der');

  return {
    tbsCertificate: new Uint8Array(binTBSCertificate),
    signatureValue: new Uint8Array(decoded.signature.data),
    signatureAlgorithm
  };
}



/**
 * Set RDN sequence for issuer and subject fields
 * @param options
 * @return {{type: *, value: *}[][]}
 */
function setRDNSequence(options) {
  const encodedArray = Object.keys(options).map((k) => {
    if (Object.keys(attributeTypeOIDMap).indexOf(k) < 0) throw new Error('InvalidOptionSpecification');

    const type = attributeTypeOIDMap[k];
    let value;
    if (['dnQualifier, countryName, serialNumber'].indexOf(k) >= 0) {
      if (k === 'countryName' && options[k].length !== 2) throw new Error('InvalidCountryNameCode');
      value = rfc5280.DirectoryString.encode({type: 'printableString', value: options[k]}, 'der');
    }
    else value = rfc5280.DirectoryString.encode({type: 'utf8String', value: options[k]}, 'der');

    return {type, value};
  });

  return [encodedArray];
}

// https://tools.ietf.org/html/rfc5280#appendix-A
const attributeTypeOIDMap = {
  // X509name DirectoryName
  name: [2, 5, 4, 41],
  surname: [2, 5, 4, 4],
  givenName: [2, 5, 4, 42],
  initials: [2, 5, 4, 43],
  generationQualifier: [2, 5, 4, 44],

  commonName: [2, 5, 4, 3], // DirectoryName
  localityName: [2, 5, 4, 7], // DirectoryName
  stateOrProvinceName: [2, 5, 4, 8], // DirectoryName
  organizationName: [2, 5, 4, 10], // DirectoryName
  organizationalUnitName: [2, 5, 4, 11], // DirectoryName
  title: [2, 5, 4, 12], // DirectoryName

  dnQualifier: [2, 5, 4, 46], // PrintableString
  countryName: [2, 5, 4, 6], // PrintableString(2)
  serialNumber: [2, 5, 4, 5], // PrintableString

  pseudonym: [2, 5, 4, 65], // DirectoryName

  domainComponent: [0, 9, 2342, 19200300, 100, 1, 25], // IA5String https://tools.ietf.org/html/rfc4519
};