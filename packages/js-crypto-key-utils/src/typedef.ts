
export type KeyFormat = 'jwk'|'pem'|'der'|'oct';
export type CurveTypes = 'P-256'|'P-384'|'P-521'|'P-256K';
export type HashTypes = 'SHA-256'|'SHA-384'|'SHA-512'|'SHA3-512'|'SHA3-384'|'SHA3-256'|'SHA3-224'|'SHA-1'|'MD5';
/**
 * @typedef {String} PEM - ASN.1 encoded key in PEM format.
 */
export type PEM = string;

/**
 * @typedef {Uint8Array} DER - ASN.1 encoded key in DER format.
 */
export type DER = Uint8Array;

/**
 * @typedef {Uint8Array} OctetEC - SEC1 Octet form EC key.
 */
export type OctetEC = Uint8Array|string;

/**
 * @typedef {Object} KeyExportOptions - Export options for Key Class.
 * @property {boolean} [outputPublic] - Derive public key from private key if true.
 * @property {boolean} [compact] - Generate compressed EC public key when format = 'der', 'pem' or 'oct', only for EC key if true.
 * @property {OctetFormat} [output='binary'] - Active only for OctetEC key. 'binary' or 'string'. Default value would be 'binary'.
 * @property {AsnEncryptOptionsWithPassphrase} [encryptParams] - Generate encrypted der/pem private key when format = 'der' or 'pem'.
 */
export type KeyExportOptions = {
  outputPublic?: boolean,
  compact?: boolean,
  output?: OctetFormat,
  encryptParams?: AsnEncryptOptionsWithPassphrase
};

/**
 * @typedef {Object} JwkExportOptionsInternal - Options for converters to JWK.
 * @property {String} [namedCurve] - Name of curve used for EC keys.
 * @property {boolean} [outputPublic] - Export public key even from private key if true.
 * @property {String} [passphrase] - Encrypt private key if this is given.
 */
export type JwkExportOptionsInternal = {
  namedCurve?: CurveTypes,
  outputPublic?: boolean,
  passphrase?: string
};

/**
 * @typedef {Object} AsnEncryptOptionsWithPassphrase - Encryption options for exported key in key Class.
 * @property {String} passphrase - (Re-)generate encrypted der/pem with the given passphrase
 * @property {String} [algorithm='pbes2'] - 'pbes2' (default), 'pbeWithMD5AndDES-CBC' or 'pbeWithSHA1AndDES'
 * @property {String} [prf='hmacWithSHA256] - 'hmacWithSHA256' (default), 'hmacWithSHA384', 'hmacWithSHA512' or 'hmacWithSHA1' when if algorithm = 'pbes2'.
 * @property {Number} [iterationCount = 2048] - Iteration count for PBKDF 1/2.
 * @property {String} [cipher='aes256-cbc'] - 'aes256-cbc' (default), 'aes128-cbc' or 'des-ede3-cbc'.
 */
export type AsnEncryptOptionsWithPassphrase = {
  passphrase: string,
  algorithm?: 'pbes2'|'pbeWithMD5AndDES-CBC'|'pbeWithSHA1AndDES',
  prf?: 'hmacWithSHA256'|'hmacWithSHA384'|'hmacWithSHA512'|'hmacWithSHA1',
  iterationCount?: number,
  cipher?: 'aes256-cbc'|'aes128-cbc'|'des-ede3-cbc';
};

/**
 * @typedef {Entity} AsnObject - asn1.js Entity object.
 */

/**
 * @typedef {'pem'|'der'} AsnFormat - Key format of ASN.1 encoded key object.
 */
export type AsnFormat = 'pem'|'der';


/**
 * @typedef {'string'|'binary'} OctetFormat - Representation of SEC1 Octet EC key.
 */
export type OctetFormat = 'string'|'binary';

/**
 * @typedef {'public'|'private'} PublicOrPrivate - Key type of public or private.
 */
export type PublicOrPrivate = 'public'|'private';

/**
 * @typedef {'binary'|'hex'|'base64'} JwkThumbprintFormat - Representation of JWK thumbprint.
 */
export type JwkThumbprintFormat = 'binary'|'hex'|'base64';

export type DecodedAsn1Key = { subjectPublicKey?: any, algorithm?: any, version?: any, privateKeyAlgorithm?: any, privateKey?: any };
