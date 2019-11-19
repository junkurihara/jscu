export type ModulusLength = 1024|2048|3072|4096;
export type JsonWebKeyPair = {publicKey: JsonWebKey, privateKey: JsonWebKey};
export type HashTypes = 'SHA3-512'|'SHA3-384'|'SHA3-256'|'SHA3-224'|'SHA-256'|'SHA-384'|'SHA-512'|'SHA-1'|'MD5';

/**
 * @typedef {Object} RSASignAlgorithm - Object to specify algorithm parameters for RSA sign and verify functions.
 * @property {String} [name='RSA-PSS'] - 'RSA-PSS' or  'RSASSA-PKCS1-v1_5'.
 * @property {Number} [saltLength] - For RSA-PSS, this must be specified.
 */
export type RSASignAlgorithm = {name: 'RSA-PSS'|'RSASSA-PKCS1-v1_5', saltLength?: number|undefined}
