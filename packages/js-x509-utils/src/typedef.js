/**
 * typedef.js
 */

/**
 * @typedef {'der'|'pem'} AsnFormat - 'der' or 'pem'
 */

/**
 * @typedef {Buffer|Uint8Array} DER - ASN.1 DER.
 */

/**
 * @typedef {String} PEM - ASN.1 PEM.
 */

/**
 * @typedef {Object} X509EncodingOptions - Options to generate X.509 public key certificate.
 * @property {String} [signature='ecdsa-with-sha256'] - Signature algorithm like 'ecdsa-with-sha256'.
 * @property {Number} [days=3650] - The number of days to expire.
 * @property {X509Issuer} issuer - Object specifying the issuer of the certificate.
 * @property {X509Subject} subject - Object specifying subject of the certificate.
 * @property {RSAPSSObject} [pssParams={}] - RSASSA-PSS parameters.
 */

/**
 * @typedef {Object} X509Issuer - An object specifying the X.509 issuer.
 * @property {String} [organizationName='Self'] - Name of issuer organization.
 */

/**
 * @typedef {Object} X509Subject - An object specifying the X.509 subject.
 * @property {String} [organizationName='Self'] - Name of subject organization.
 */

/**
 * @typedef {Object} RSAPSSObject - RSASSA-PSS ASN.1 encoding object.
 * @property {Number} [saltLength=20] - RSA-PSS param. Length of salt in octet.
 * @property {String} [hash='SHA-1'] - RSA-PSS param. Name of hash algorithm like 'SHA-256'
 * @property {boolean} [explicit=false] - RSA-PSS param. True if it is explicit.
 */