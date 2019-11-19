/**
 * typedef.js
 */

export type KeyTypes = 'EC'|'RSA';
export type CurveTypes = 'P-256' | 'P-384' | 'P-521' | 'P-256K';
export type ModulusLength = 1024|2048|3072|4096;
export type KeyPair = {publicKey: any, privateKey: any}; // TODO rewrite after typescripting jsckeyutils
export type HashTypes = 'SHA3-512'|'SHA3-384'|'SHA3-256'|'SHA3-224'|'SHA-256'|'SHA-384'|'SHA-512'|'SHA-1'|'MD5';
/**
 * @typedef {Object} ECKeyGenerationOption - Options for EC key generation.
 * @property {String} [namedCurve='P-256'] - Name of elliptic curve like 'P-256'.
 */
export type ECKeyGenerationOption = {
  namedCurve: CurveTypes,
}
/**
 * @typedef {Object} RSAKeyGenerationOption - Options for RSA key generation.
 * @property {Number} [modulusLength=2048] - Modulus length in bit.
 * @property {Uint8Array} [publicExponent=new Uint8Array([0x01, 0x00, 0x01])] - Public exponent.
 */
export type RSAKeyGenerationOption = {
  modulusLength: ModulusLength,
  publicExponent?: Uint8Array
};

export type KeyGenOptions = RSAKeyGenerationOption|ECKeyGenerationOption;

/**
 * @typedef {Object} ECSigningOption - Options for EC key signing.
 * @property {'raw'|'der'} format - EC Signature format in DER or Raw.
 */
export type ECSigningOption = {
  format: 'raw'|'der'
};

/**
 * @typedef {Object} RSASigningOption - Options for RSA key signing.
 * @property {'RSA-PSS'|'RSASSA-PKCS1-v1_5'} [name='RSA-PSS'] - 'RSA-PSS' or  'RSASSA-PKCS1-v1_5'.
 * @property {Number} [saltLength] - For RSA-PSS, this must be specified.
 */
export type RSASigningOption = {
  name: 'RSA-PSS'|'RSASSA-PKCS1-v1_5',
  saltLength?: number
};

export type SigningOption = ECSigningOption|RSASigningOption|undefined;

/**
 * @typedef {Object} PKCCiphertextObject - Ciphertext of public key encryption.
 * @property {Uint8Array} data - Encrypted message body.
 * @property {Uint8Array} [salt] - Active only for ECDH+AES
 * @property {Uint8Array} [iv] - Active only for ECDH+AES
 */
export type PKCCiphertextObject = {
  data: Uint8Array,
  salt?: Uint8Array,
  iv?: Uint8Array
};

/**
 * @typedef {Object} ECEncryptionOptions - Options for ECDH+AES encryption.
 * @property {Key} privateKey - Private Key Object for ECDH.
 * @property {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'
 * @property {String} [encrypt='AES-GCM'] - Name of encryption algorithm like AES-GCM after ECDH.
 * @property {Number} [keyLength=32] - Key length for AES in octet.
 * @property {Uint8Array|null} [iv=null] - Initial vector for AES-GCM.
 * @property {String} [info=''] - Info for AES-GCM.
 */
export type ECEncryptionOption = {
  privateKey: any,
  hash?: HashTypes,
  encrypt?: 'AES-GCM'|'AES-KW',
  keyLength?: number,
  info?: string
};

/**
 * @typedef {Object} RSAEncryptionOption - Options for RSA-OAEP encryption.
 * @property {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'
 * @property {Uint8Array} [label=new Uint8Array([])] - RSA-OAEP label.
 */
export type RSAEncryptionOption = {
  hash?: HashTypes,
  label?: Uint8Array
};

export type EncryptionOption = ECEncryptionOption|RSAEncryptionOption|undefined;

/**
 * @typedef {Object} ECDecryptionOptions - Options for ECDH+AES decryption.
 * @property {Key} publicKey - Public Key Object for ECDH.
 * @property {String} [hash='SHA-256'] - Name of hash algorithm like 'SHA-256'
 * @property {String} [encrypt='AES-GCM'] - Name of encryption algorithm like AES-GCM after ECDH.
 * @property {Number} [keyLength=32] - Key length for AES in octet.
 * @property {Uint8Array|null} [iv=null] - Initial vector for AES-GCM.
 * @property {String} [info=''] - Info for AES-GCM.
 */
export type ECDecryptionOption = {
  publicKey: any,
  hash?: HashTypes,
  encrypt?: 'AES-GCM'|'AES-KW',
  keyLength?: number,
  iv?: Uint8Array,
  salt?: Uint8Array,
  info?: string
};

export type DecryptionOption = ECDecryptionOption|RSAEncryptionOption|undefined;
