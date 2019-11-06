export type ModulusLength = 1024|2048|3072|4096
export type JsonWebKeyPair = {publicKey: JsonWebKey, privateKey: JsonWebKey};

/**
 * @typedef {Object} RSASignAlgorithm - Object to specify algorithm parameters for RSA sign and verify functions.
 * @property {String} [name='RSA-PSS'] - 'RSA-PSS' or  'RSASSA-PKCS1-v1_5'.
 * @property {Number} [saltLength] - For RSA-PSS, this must be specified.
 */
