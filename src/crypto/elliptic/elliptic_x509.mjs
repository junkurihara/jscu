

/////////////////////////////////////////////////////////////////////////////////////////
// SPKI PEM <=> X509 Certificate
// X509 specification is given in https://tools.ietf.org/html/rfc5280

import rfc5280 from 'asn1.js-rfc5280';
import asn from 'asn1.js';
import BufferMod from 'buffer';
import cryptoUtil from '../util/index.mjs';
import * as util from './elliptic_util.mjs';
import {binToJwk, decodeAsn1Signature, encodeAsn1Signature, JwkToBin} from './elliptic_keyconv.mjs';
import * as ell from './elliptic_npm';
import jseu from 'js-encoding-utils';

const BN = asn.bignum;
const Buffer = BufferMod.Buffer;


/**
 * convert jwk to X509 pem
 * @param publicJwk
 * @param privateJwk
 * @param options
 * @return {Promise<*>}
 */
export async function convertJwkToX509({publicJwk, privateJwk, options = {}}) {
  // default values
  if (typeof options.signature === 'undefined') options.signature = 'ecdsa-with-sha256';
  if (typeof options.days === 'undefined') options.days = 3650;
  if (typeof options.format === 'undefined') options.format = 'pem';
  if (typeof options.issuer === 'undefined') options.issuer = {organizationName: 'Self'};
  if (typeof options.subject === 'undefined') options.subject = {organizationName: 'Self'};

  ///////////////////////////////
  // elements of TBSCertificate
  ///////////////////////////////

  const version = 0; // default, TODO: other versions?

  // random serial numbers
  const rand = await cryptoUtil.random.getRandomBytes(20); // max 20 octets
  const serialNumber = new BN(rand);

  const signature = {algorithm: util.getSignatureOid(options.signature)};

  const issuer = {type: 'rdnSequence', value: setRDNSequence(options.issuer)};

  const current = (Date.now() / 1000) * 1000;
  const validity = {
    notBefore: {type: 'utcTime', value: current},
    notAfter: {type: 'utcTime', value: (current + options.days * 86400 * 1000)}
  };

  const subject = {type: 'rdnSequence', value: setRDNSequence(options.subject)};

  const subjectPublicKeyInfo = rfc5280.SubjectPublicKeyInfo.decode(await JwkToBin(publicJwk, 'public', publicJwk.crv), 'der');

  // elements of Certificate
  const tbsCertificate = {version, serialNumber, signature, issuer, validity, subject, subjectPublicKeyInfo};
  const signatureAlgorithm = tbsCertificate.signature; // This must be the same as tbsCertificate.signature field (as specified in RFC).

  // generate signature value
  const encodedTbsCertificate = rfc5280.TBSCertificate.encode(tbsCertificate, 'der');
  const algo = Object.assign(
    {hash: {name: util.getSignatureHash(options.signature)}},
    cryptoUtil.algo.getWebCryptoParamsFromJwk(privateJwk, 'sign')
  );
  const bareSig = await ell.sign(algo, privateJwk, encodedTbsCertificate);
  const signatureValue = {unused: 0, data: Buffer.from(await encodeAsn1Signature(bareSig, privateJwk.crv))};

  // construct Certificate
  const certBin = rfc5280.Certificate.encode({tbsCertificate, signatureAlgorithm, signature: signatureValue}, 'der');

  if (options.format === 'pem') {
    return await jseu.formatter.binToPem(certBin, 'certificate');
  }
  else if (options.format === 'der') {
    return certBin;
  }
  else {
    throw new Error('InvalidFormatSpecification');
  }
}

/**
 * conver X509 pem/der to jwk
 * @param certX509
 * @param format
 * @return {Promise<*>}
 */
export async function convertX509ToJwk({certX509, format}) {
  if (typeof format === 'undefined') format = 'pem';

  let x509bin;
  if (format === 'pem') x509bin = await jseu.formatter.pemToBin(certX509);
  else if (format === 'der') x509bin = certX509;
  else throw new Error('InvalidFormatSpecification');

  const binKeyBuffer = Buffer.from(x509bin); // This must be Buffer object to get decoded;

  const decoded = rfc5280.Certificate.decode(binKeyBuffer, 'der'); // decode binary x509-formatted public key to parsed object
  const binSpki = rfc5280.SubjectPublicKeyInfo.encode(decoded.tbsCertificate.subjectPublicKeyInfo, 'der');

  return await binToJwk(binSpki, 'public');
}

export async function parseX509forVerification({certX509, publicJWK, format}){
  if (typeof format === 'undefined') format = 'pem';

  let x509bin;
  if (format === 'pem') x509bin = await jseu.formatter.pemToBin(certX509);
  else if (format === 'der') x509bin = certX509;
  else throw new Error('InvalidFormatSpecification');

  const algo = cryptoUtil.algo.getWebCryptoParamsFromJwk(publicJWK, 'verify');

  const binKeyBuffer = Buffer.from(x509bin); // This must be Buffer object to get decoded;

  const decoded = rfc5280.Certificate.decode(binKeyBuffer, 'der'); // decode binary x509-formatted public key to parsed object
  const sigOid = decoded.signatureAlgorithm.algorithm;
  const filter = Object.keys(cryptoUtil.defaultParams.signatureAlgorithms).filter(
    (name) => cryptoUtil.defaultParams.signatureAlgorithms[name].oid.toString() === sigOid.toString()
  );
  if(filter.length <= 0) throw new Error('UnsupportedSignatureAlgorithm');
  const hash = cryptoUtil.defaultParams.signatureAlgorithms[filter[0]].hash;

  const binTBSCertificate = rfc5280.TBSCertificate.encode(decoded.tbsCertificate, 'der');
  const binSignature = decodeAsn1Signature(decoded.signature.data, algo.namedCurve);

  return {
    tbsCertificate: binTBSCertificate,
    signature: binSignature,
    hash: {name: hash}
  };
}

/**
 * set RDN sequence for issuer and subject fields
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