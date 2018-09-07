// TODO: convert SPKI PEM <=> X509 Certificate

/**
 * x509.mjs
 */

import helper from '../../helper/index.mjs';

import rfc5280 from 'asn1.js-rfc5280';
import BufferMod from 'buffer';
const Buffer = BufferMod.Buffer;

// https://tools.ietf.org/html/rfc5280
export async function convertJwkToX509 ({publicJwk, privateJwk}){
  // console.log(publicJwk);
  // console.log(privateJwk);

  return 'hello';
}

export async function convertX509ToJwk ({certX509Pem}){
  console.log(certX509Pem);

  const x509bin = await helper.formatter.pemToBin(certX509Pem);
  const binKeyBuffer = Buffer.from(x509bin); // This must be Buffer object to get decoded;

  const decoded = rfc5280.Certificate.decode(binKeyBuffer, 'der'); // decode binary x509-formatted public key to parsed object
  const spki = decoded.tbsCertificate.subjectPublicKeyInfo;
  console.log(decoded);
  console.log(spki);

  return 'howdy';
}
