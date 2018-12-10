/**
 * @typedef {String} PEM - ASN.1 encoded key in PEM format.
 */

/**
 * @typedef {Uint8Array|Buffer} DER - ASN.1 encoded key in DER format.
 */

/**
 * @typedef {Uint8Array|Buffer|String} OctetEC - SEC1 Octet form EC key.
 */

/**
 * @typedef {Object} KeyExportOptions - Export options for Key Class.
 * @property {boolean} [outputPublic] - Derive public key from private key if true.
 * @property {boolean} [compact] - Generate compressed EC public key when format = 'der', 'pem' or 'oct', only for EC key if true.
 * @property {OctetFormat} [output='binary'] - Active only for OctetEC key. 'binary' or 'string'. Default value would be 'binary'.
 * @property {AsnEncryptOptionsWithPassphrase} [encryptParams] - Generate encrypted der/pem private key when format = 'der' or 'pem'.
 */

/**
 * @typedef {Object} JwkExportOptionsInternal - Options for converters to JWK.
 * @property {String} [namedCurve] - Name of curve used for EC keys.
 * @property {boolean} [outputPublic] - Export public key even from private key if true.
 * @property {String} [passphrase] - Encrypt private key if this is given.
 */

/**
 * @typedef {Object} AsnEncryptOptionsWithPassphrase - Encryption options for exported key in key Class.
 * @property {String} passphrase - (Re-)generate encrypted der/pem with the given passphrase
 * @property {String} [algorithm='pbes2'] - 'pbes2' (default), 'pbeWithMD5AndDES-CBC' or 'pbeWithSHA1AndDES'
 * @property {String} [prf='hmacWithSHA256] - 'hmacWithSHA256' (default), 'hmacWithSHA384', 'hmacWithSHA512' or 'hmacWithSHA1' when if algorithm = 'pbes2'.
 * @property {Number} [iterationCount = 2048] - Iteration count for PBKDF 1/2.
 * @property {String} [cipher='aes256-cbc'] - 'aes256-cbc' (default), 'aes128-cbc' or 'des-ede3-cbc'.
 */

/**
 * @typedef {Entity} AsnObject - asn1.js Entity object.
 */

/**
 * @typedef {'pem'|'der'} AsnFormat - Key format of ASN.1 encoded key object.
 */


/**
 * @typedef {'string'|'binary'} OctetFormat - Representation of SEC1 Octet EC key.
 */

/**
 * @typedef {'public'|'private'} PublicOrPrivate - Key type of public or private.
 */

/**
 * @typedef {'binary'|'hex'|'base64'} JwkThumbpirntFormat - Representation of JWK thumbprint.
 */