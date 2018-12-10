/**
 * @typedef {Object} RSASignAlgorithm - Object to specify algorithm parameters for RSA sign and verify functions.
 * @property {String} [name='RSA-PSS'] - 'RSA-PSS' or  'RSASSA-PKCS1-v1_5'.
 * @property {Number} [saltLength] - For RSA-PSS, this must be specified.
 */