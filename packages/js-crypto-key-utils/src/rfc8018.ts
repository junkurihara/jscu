/**
 * rfc8081
 */

import * as params from './params';
import {PBES2ESParams, PBEParameter, PBES2Params, PBKDF2Params, OneAsymmetricKey, EncryptedPrivateKeyInfo} from './asn1def';
import des from 'des.js';
import * as BufferMod from 'buffer';
import asn from 'asn1.js';
import jseu from 'js-encoding-utils';
import pbkdf from 'js-crypto-pbkdf';
import jscaes from 'js-crypto-aes';
import jscrandom from 'js-crypto-random';
import {AsnEncryptOptionsWithPassphrase, DER} from './typedef';
const Buffer = BufferMod.Buffer;
const BN = asn.bignum;

///////////////////////////////////////////////////////////////////
/**
 * Generate EncryptedPrivateKeyInfo ASN.1 object.
 * @param {DER} binKey - Binary key in DER format.
 * @param {AsnEncryptOptionsWithPassphrase} [options={passphrase: ''}] - Encryption options for ASN.1 private key.
 * @return {Promise<DER>} - Encrypted private key in DER.
 */
export const encryptEncryptedPrivateKeyInfo = async (
  binKey: DER,
  options: AsnEncryptOptionsWithPassphrase = {passphrase:''}
): Promise<DER> => {
  // default params
  if(typeof options.algorithm === 'undefined') options.algorithm = 'pbes2';
  if(typeof options.iterationCount === 'undefined') options.iterationCount = 2048;


  if (options.algorithm === 'pbes2') {
    if(typeof options.cipher === 'undefined') options.cipher = 'aes256-cbc';
    if(typeof options.prf === 'undefined') options.prf = 'hmacWithSHA256';
    const kdfAlgorithm = 'pbkdf2'; // TODO: currently only pbkdf2 is available

    const encryptedPBES2 = await encryptPBES2(binKey, options.passphrase, kdfAlgorithm, options.prf, options.iterationCount, options.cipher);
    return encodePBES2(encryptedPBES2);
  }
  else {
    const encryptedPBES1 = await encryptPBES1(binKey, options.passphrase, options.algorithm, options.iterationCount);
    encryptedPBES1.encryptionAlgorithm.algorithm = <any>params.passwordBasedEncryptionSchemes[encryptedPBES1.encryptionAlgorithm.algorithm].oid; // work around
    encryptedPBES1.encryptionAlgorithm.parameters = PBEParameter.encode(encryptedPBES1.encryptionAlgorithm.parameters, 'der');
    return EncryptedPrivateKeyInfo.encode(encryptedPBES1, 'der');
  }
};

/**
 * Decrypt EncryptedPrivateKeyInfo
 * @param {Object} epki - Parsed encrypted
 * @param {String} passphrase - Passphrase to decyrpt the object.
 * @return {Promise<Object>} - Decrypted object.
 */
export const decryptEncryptedPrivateKeyInfo = async (
  epki: {encryptionAlgorithm: any, encryptedData: any},
  passphrase: string
) => {
  const decoded: {[index: string]: any} = {}; // work around

  // encryptionAlgorithm.algorithm
  decoded.encryptionAlgorithm = {
    algorithm: params.getAlgorithmFromOidStrict(epki.encryptionAlgorithm.algorithm, params.passwordBasedEncryptionSchemes)
  };
  if (decoded.encryptionAlgorithm.algorithm === 'pbes2') {
    decoded.encryptionAlgorithm.parameters = decodePBES2(epki.encryptionAlgorithm.parameters);
  }
  else {
    decoded.encryptionAlgorithm.parameters = PBEParameter.decode(epki.encryptionAlgorithm.parameters, 'der');
  }

  decoded.encryptedData = epki.encryptedData;

  // decrypt
  if(decoded.encryptionAlgorithm.algorithm === 'pbes2') {
    return await decryptPBES2(<any>decoded, passphrase); // work around
  }
  else return await decryptPBES1(decoded, passphrase);
};

//////////////////////////////
const encodePBES2 = (
  decoded: {encryptionAlgorithm: any, encryptedData: any} // work around
) => {
  const epki: {[index: string]: any} = { encryptionAlgorithm: {} }; // work around

  // algorithm
  epki.encryptionAlgorithm.algorithm = params.passwordBasedEncryptionSchemes[decoded.encryptionAlgorithm.algorithm].oid;

  // kdf
  const kdf = decoded.encryptionAlgorithm.parameters.keyDerivationFunc;
  if(kdf.algorithm === 'pbkdf2') {
    kdf.parameters.prf.algorithm = params.pbkdf2Prfs[kdf.parameters.prf.algorithm].oid;
    kdf.parameters = PBKDF2Params.encode(kdf.parameters, 'der');
  } else throw new Error('UnsupportedKDF');
  kdf.algorithm = params.keyDerivationFunctions[kdf.algorithm].oid;

  // encryptionScheme
  const eS = decoded.encryptionAlgorithm.parameters.encryptionScheme;
  if(Object.keys(PBES2ESParams).indexOf(eS.algorithm) >= 0){
    eS.parameters = PBES2ESParams[eS.algorithm].encode(eS.parameters, 'der');
  } else throw new Error('UnsupportedCipher');
  eS.algorithm = params.encryptionSchemes[eS.algorithm].oid;

  // params
  epki.encryptionAlgorithm.parameters = PBES2Params.encode({ keyDerivationFunc: kdf, encryptionScheme: eS }, 'der');

  // encoded data
  epki.encryptedData = decoded.encryptedData;
  return EncryptedPrivateKeyInfo.encode(epki, 'der');
};

const decodePBES2 = (rawParams: any) => { // work around
  const pbes2Params = PBES2Params.decode(rawParams, 'der');

  // keyDerivationFunc
  const kdfAlgorithm = params.getAlgorithmFromOidStrict(pbes2Params.keyDerivationFunc.algorithm, params.keyDerivationFunctions);

  let iterationCount;
  let salt;
  let prf;
  if (kdfAlgorithm === 'pbkdf2') {
    const pbkdf2Params = PBKDF2Params.decode(pbes2Params.keyDerivationFunc.parameters, 'der');
    prf = {
      algorithm: params.getAlgorithmFromOidStrict(pbkdf2Params.prf.algorithm, params.pbkdf2Prfs),
      parameters: pbkdf2Params.prf.parameters
    };
    iterationCount = pbkdf2Params.iterationCount;
    salt = {type: pbkdf2Params.salt.type, value: pbkdf2Params.salt.value};
  } else throw new Error('UnsupportedKDF');

  //encryptionScheme
  const encryptionScheme = params.getAlgorithmFromOidStrict(pbes2Params.encryptionScheme.algorithm, params.encryptionSchemes);
  let encryptionParams;
  if(Object.keys(PBES2ESParams).indexOf(encryptionScheme) >= 0){
    encryptionParams = PBES2ESParams[encryptionScheme].decode(pbes2Params.encryptionScheme.parameters, 'der');
  } else throw new Error('UnsupportedCipher'); // TODO: Other Encryption Scheme

  return {
    keyDerivationFunc: {
      algorithm: kdfAlgorithm,
      parameters: { salt, iterationCount, prf }
    },
    encryptionScheme: {
      algorithm: encryptionScheme,
      parameters: encryptionParams
    }
  };
};


//////////////////////
// PBES2 RFC8018 Section 6.2.1
const encryptPBES2 = async (
  binKey: any,
  passphrase: string,
  kdfAlgorithm: string,
  prf: string,
  iterationCount: number,
  cipher: string
) => {
  // kdf
  const pBuffer = jseu.encoder.stringToArrayBuffer(passphrase);
  const salt = await jscrandom.getRandomBytes(
    params.keyDerivationFunctions[kdfAlgorithm].defaultSaltLen
  ); // TODO: currently only salt length of 8 is available
  const keyLength = params.encryptionSchemes[cipher].keyLength; // get keyLength

  let key;
  if (kdfAlgorithm === 'pbkdf2') {
    key = await pbkdf.pbkdf2(pBuffer, salt, iterationCount, keyLength, <any>params.pbkdf2Prfs[prf].hash); // work around
  } else throw new Error('UnsupportedKDF');

  // encrypt
  let iv;
  let encryptedData;
  if (cipher === 'des-ede3-cbc') { // TODO other encryption schemes
    iv = Buffer.from(await jscrandom.getRandomBytes(params.encryptionSchemes[cipher].ivLength));
    const CBC = des.CBC.instantiate(des.EDE);
    const ct = CBC.create({ type: 'encrypt', key: Buffer.from(key), iv });
    encryptedData = Buffer.from(ct.update(binKey).concat(ct.final()));
  }
  else if (cipher === 'aes128-cbc' || cipher === 'aes192-cbc' || cipher === 'aes256-cbc'){
    iv = await jscrandom.getRandomBytes(params.encryptionSchemes[cipher].ivLength);
    encryptedData = Buffer.from( await jscaes.encrypt(
      new Uint8Array(binKey), key, {name: 'AES-CBC', iv}
    ));
    iv = Buffer.from(iv);
  } else throw new Error('UnsupportedCipher');

  // structure
  return {
    encryptedData,
    encryptionAlgorithm: {
      algorithm: 'pbes2',
      parameters: {
        keyDerivationFunc: {
          algorithm: kdfAlgorithm,
          parameters: {
            salt: {type: 'specified', value: Buffer.from(salt)},
            iterationCount: new BN(iterationCount),
            prf: {algorithm: prf, parameters: Buffer.from([0x05, 0x00])}
          }
        },
        encryptionScheme: { algorithm: cipher, parameters: iv }
      }
    }
  };
};

//////////////////////////////
// PBES2 RFC8018 Section 6.2.2
const decryptPBES2 = async (
  decoded: {encryptionAlgorithm: any, encryptedData: any},
  passphrase: string
) => {
  const kdf = decoded.encryptionAlgorithm.parameters.keyDerivationFunc;
  const eS = decoded.encryptionAlgorithm.parameters.encryptionScheme;

  // pbkdf2
  const keyLength = params.encryptionSchemes[eS.algorithm].keyLength; // get keyLength
  let key;
  if(kdf.algorithm === 'pbkdf2') {
    const pBuffer = jseu.encoder.stringToArrayBuffer(passphrase);
    if (kdf.parameters.salt.type !== 'specified') throw new Error('UnsupportedSaltSource');
    const salt = new Uint8Array(kdf.parameters.salt.value);
    const iterationCount = kdf.parameters.iterationCount.toNumber();
    const prf = kdf.parameters.prf.algorithm;
    key = await pbkdf.pbkdf2(pBuffer, salt, iterationCount, keyLength, <any>params.pbkdf2Prfs[prf].hash);
  }
  else throw new Error('UnsupportedKDF');

  // decryption
  // TODO other encryption schemes
  let out;
  if(eS.algorithm === 'des-ede3-cbc'){
    const iv = eS.parameters;
    const CBC = des.CBC.instantiate(des.EDE);
    const pt = CBC.create({ type: 'decrypt', key, iv });
    out = Buffer.from(pt.update(decoded.encryptedData).concat(pt.final()));
  }
  else if (eS.algorithm === 'aes128-cbc' || eS.algorithm === 'aes192-cbc'|| eS.algorithm === 'aes256-cbc'){
    const iv = new Uint8Array(eS.parameters);
    out = Buffer.from( await jscaes.decrypt(
      new Uint8Array(decoded.encryptedData), key, {name: 'AES-CBC', iv}
    ));
  } else throw new Error('UnsupportedEncryptionAlgorithm');

  return OneAsymmetricKey.decode(out, 'der');
};

//////////////////////////////
// PBES1 RFC8018 Section 6.1.1
const encryptPBES1 = async (
  binKey: any,
  passphrase: string,
  algorithm: string,
  iterationCount: number
) => {
  // pbkdf1
  const pBuffer = jseu.encoder.stringToArrayBuffer(passphrase);
  const salt = await jscrandom.getRandomBytes(8); // defined as 8 octet
  const hash = params.passwordBasedEncryptionSchemes[algorithm].hash;
  const keyIv = await pbkdf.pbkdf1(pBuffer, salt, iterationCount, 16, <any>hash);
  const key = keyIv.slice(0, 8);
  const iv = keyIv.slice(8, 16);

  // decryption
  const encrypt = params.passwordBasedEncryptionSchemes[algorithm].encrypt;
  let out;
  // TODO: Other Encryption Scheme
  if(encrypt === 'DES-CBC') {
    const CBC = des.CBC.instantiate(des.DES);
    const ct = CBC.create({type: 'encrypt', key, iv});
    out = Buffer.from(ct.update(binKey).concat(ct.final()));
  }
  else throw new Error('UnsupportedEncryptionAlgorithm');

  return {
    encryptionAlgorithm: {
      algorithm,
      parameters: {
        salt: Buffer.from(salt),
        iterationCount: new BN(iterationCount)
      }
    },
    encryptedData: out
  };
};

//////////////////////////////
// PBES1 RFC8018 Section 6.1.2
const decryptPBES1 = async (
  decoded: any,
  passphrase: string
) => {
  // pbkdf1
  const pBuffer = jseu.encoder.stringToArrayBuffer(passphrase);
  const salt = new Uint8Array(decoded.encryptionAlgorithm.parameters.salt);
  const hash = params.passwordBasedEncryptionSchemes[decoded.encryptionAlgorithm.algorithm].hash;
  const iterationCount = decoded.encryptionAlgorithm.parameters.iterationCount.toNumber();
  const keyIv = await pbkdf.pbkdf1(pBuffer, salt, iterationCount, 16, <any>hash);
  const key = keyIv.slice(0, 8);
  const iv = keyIv.slice(8, 16);

  // decryption
  const encrypt = params.passwordBasedEncryptionSchemes[decoded.encryptionAlgorithm.algorithm].encrypt;
  let out;
  // TODO: Other Encryption Scheme
  if(encrypt === 'DES-CBC') {
    const CBC = des.CBC.instantiate(des.DES);
    const ct = CBC.create({type: 'decrypt', key, iv});
    out = Buffer.from(ct.update(decoded.encryptedData).concat(ct.final()));
  }
  else throw new Error('UnsupportedEncryptionAlgorithm');

  return OneAsymmetricKey.decode(out, 'der');
};
