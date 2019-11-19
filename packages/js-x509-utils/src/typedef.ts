/**
 * typedef.ts
 */

export type HashTypes = 'SHA-1'|'SHA-256'|'SHA-384'|'SHA-512';
export type SignatureType =
  'ecdsa-with-sha256'|'ecdsa-with-sha384'|'ecdsa-with-sha512'|'ecdsa-with-sha1'|
  'sha256WithRSAEncryption'|'sha384WithRSAEncryption'|'sha512WithRSAEncryption'|'sha1WithRSAEncryption'|
  'rsassaPss';

/**
 * @typedef {'der'|'pem'} AsnFormat - 'der' or 'pem'
 */
export type AsnFormat = 'der'|'pem';

/**
 * @typedef {Buffer|Uint8Array} DER - ASN.1 DER.
 */
export type DER = Buffer|Uint8Array;

/**
 * @typedef {String} PEM - ASN.1 PEM.
 */
export type PEM = string;

/**
 * @typedef {Object} X509EncodingOptions - Options to generate X.509 public key certificate.
 * @property {String} [signature='ecdsa-with-sha256'] - Signature algorithm like 'ecdsa-with-sha256'.
 * @property {Number} [days=3650] - The number of days to expire.
 * @property {X509Issuer} issuer - Object specifying the issuer of the certificate.
 * @property {X509Subject} subject - Object specifying subject of the certificate.
 * @property {RsaPssOptions} [pssParams={}] - RSASSA-PSS parameters.
 */
export type X509EncodingOptions = {
  signature?: SignatureType,
  days?: number,
  issuer?: X509Issuer,
  subject?: X509Subject,
  pssParams?: RsaPssOptions
}


/**
 * @typedef {Object} X509Issuer - An object specifying the X.509 issuer.
 * @property {String} [organizationName='Self'] - Name of issuer organization.
 */
export type X509Issuer = {
  organizationName?: string
}

/**
 * @typedef {Object} X509Subject - An object specifying the X.509 subject.
 * @property {String} [organizationName='Self'] - Name of subject organization.
 */
export type X509Subject = {
  organizationName?: string
}

/**
 * @typedef {Object} RsaPssOptions - RSASSA-PSS ASN.1 encoding object.
 * @property {Number} [saltLength=20] - RSA-PSS param. Length of salt in octet.
 * @property {String} [hash='SHA-1'] - RSA-PSS param. Name of hash algorithm like 'SHA-256'
 * @property {boolean} [explicit=false] - RSA-PSS param. True if it is explicit.
 */
export type RsaPssOptions = {
  saltLength?: number,
  hash?: HashTypes,
  explicit?: boolean
}
