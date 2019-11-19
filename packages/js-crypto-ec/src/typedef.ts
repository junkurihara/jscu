export type JsonWebKeyPair = {publicKey: JsonWebKey, privateKey: JsonWebKey};

export type CurveTypes = 'P-256' | 'P-384' | 'P-521' | 'P-256K';
export type HashTypes = 'SHA3-512'|'SHA3-384'|'SHA3-256'|'SHA3-224'|'SHA-256'|'SHA-384'|'SHA-512'|'SHA-1'|'MD5';
export type SignatureFormat = 'raw'|'der';
