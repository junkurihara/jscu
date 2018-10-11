/**
 * rfc8081
 */

import params, {getAlgorithmFromOidStrict} from './params.js';
import {DesEde3CbcParams, PBEParameter, PBES2Params, PBKDF2Params, OneAsymmetricKey} from './asn1def.js';
import des from 'des.js';
import BufferMod from 'buffer';
import jseu from 'js-encoding-utils';
import jschash from 'js-crypto-hash/dist/index.js';
import jschmac from 'js-crypto-hmac/dist/index.js';
const Buffer = BufferMod.Buffer;

// TODO encrypt and encode
export async function encryptEncryptedPrivateKeyInfo(decoded, options){
  // options.encryptionAlgorithm.algorithm
  //
}

function encodeEncryptedPrivateKeyInfo(options){
  const encryptionAlgorithm = {};

  // encryptionAlgorithm.algorithm
  const encryptionAlgorithmOid = params.passwordBasedEncryptionSchemes[options.encryptionAlgorithm].oid;
  encryptionAlgorithm.algorithm = encryptionAlgorithmOid;

  ////////////////////////////////////////////////
  // encryptionAlgorithm.parameters
  if (options.encryptionAlgorithm === 'pbes2') {
    const pbes2Params = {
      keyDerivationFunc: {},
      encryptionScheme: {}
    }; // PBES2Params.decode(decoded.encryptionAlgorithm.parameters, 'der');

    ////////////////////////////////////////////////
    // keyDerivationFunc
    const kdfAlgorithmOid = params.keyDerivationFunctions[options.kdfAlgorithm].oid; // todo this should be default?
    pbes2Params.keyDerivationFunc.algorithm = kdfAlgorithmOid;

    if (options.kdfAlgorithm === 'pbkdf2') {
      const pbkdf2Params = PBKDF2Params.decode(pbes2Params.keyDerivationFunc.parameters, 'der');
      const pbkdf2Prf = getAlgorithmFromOidStrict(pbkdf2Params.prf.algorithm, params.pbkdf2Prfs);
      pbkdf2Params.prf.algorithm = pbkdf2Prf;

      pbes2Params.keyDerivationFunc.parameters = pbkdf2Params;
    }

    ////////////////////////////////////////////////
    //encryptionScheme
    const encryptionScheme = getAlgorithmFromOidStrict(pbes2Params.encryptionScheme.algorithm, params.encryptionSchemes);
    pbes2Params.encryptionScheme.algorithm = encryptionScheme;

    if(encryptionScheme === 'des-ede3-cbc'){
      pbes2Params.encryptionScheme.parameters = DesEde3CbcParams.decode(pbes2Params.encryptionScheme.parameters, 'der');
    } // TODO: Other Encryption Scheme

    decoded.encryptionAlgorithm.parameters = pbes2Params;
  }
  else {
    // pbes1
    decoded.encryptionAlgorithm.parameters = PBEParameter.decode(decoded.encryptionAlgorithm.parameters, 'der');
  }
}

///////////////////////////////////////////////////////////////////
export async function decryptEncryptedPrivateKeyInfo(decoded, passphrase){
  // decode
  decoded = decodeEncryptedPrivateKeyInfo(decoded);

  // decrypt
  if(decoded.encryptionAlgorithm.algorithm === 'pbes2') {
    decoded = await decryptPBES2(decoded, passphrase);
  }
  else decoded = await decryptPBES1(decoded, passphrase);

  return decoded;
}

function decodeEncryptedPrivateKeyInfo(decoded){
  // encryptionAlgorithm.algorithm
  const encryptionAlgorithm = getAlgorithmFromOidStrict(decoded.encryptionAlgorithm.algorithm, params.passwordBasedEncryptionSchemes);
  decoded.encryptionAlgorithm.algorithm = encryptionAlgorithm;

  ////////////////////////////////////////////////
  // encryptionAlgorithm.parameters
  if (encryptionAlgorithm === 'pbes2') {
    const pbes2Params = PBES2Params.decode(decoded.encryptionAlgorithm.parameters, 'der');

    ////////////////////////////////////////////////
    // keyDerivationFunc
    const kdfAlgorithm = getAlgorithmFromOidStrict(pbes2Params.keyDerivationFunc.algorithm, params.keyDerivationFunctions);
    pbes2Params.keyDerivationFunc.algorithm = kdfAlgorithm;

    if (kdfAlgorithm === 'pbkdf2') {
      const pbkdf2Params = PBKDF2Params.decode(pbes2Params.keyDerivationFunc.parameters, 'der');
      const pbkdf2Prf = getAlgorithmFromOidStrict(pbkdf2Params.prf.algorithm, params.pbkdf2Prfs);
      pbkdf2Params.prf.algorithm = pbkdf2Prf;

      pbes2Params.keyDerivationFunc.parameters = pbkdf2Params;
    }

    ////////////////////////////////////////////////
    //encryptionScheme
    const encryptionScheme = getAlgorithmFromOidStrict(pbes2Params.encryptionScheme.algorithm, params.encryptionSchemes);
    pbes2Params.encryptionScheme.algorithm = encryptionScheme;

    if(encryptionScheme === 'des-ede3-cbc'){
      pbes2Params.encryptionScheme.parameters = DesEde3CbcParams.decode(pbes2Params.encryptionScheme.parameters, 'der');
    } // TODO: Other Encryption Scheme

    decoded.encryptionAlgorithm.parameters = pbes2Params;
  }
  else {
    // pbes1
    decoded.encryptionAlgorithm.parameters = PBEParameter.decode(decoded.encryptionAlgorithm.parameters, 'der');
  }

  return decoded;
}

//////////////////////////////
// PBES2 RFC8081 Section 6.1.3
async function decryptPBES2(decoded, passphrase){
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
    key = await pbkdf2(pBuffer, salt, iterationCount, keyLength, params.pbkdf2Prfs[prf].hash);
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
  else throw new Error('UnsupportedEncryptionAlgorithm');

  return OneAsymmetricKey.decode(out, 'der');
}

async function pbkdf2(p, s, c, dkLen, hash) {
  // const crypto = require('crypto');
  // const key = crypto.pbkdf2Sync(p, s, c, dkLen, 'sha1');
  // console.log(key.toString('hex'));

  const hLen = params.hashes[hash].hashSize;

  const l = Math.ceil(dkLen/hLen);
  const r = dkLen - (l-1)*hLen;

  const funcF = async (i) => {
    const seed = new Uint8Array(s.length + 4);
    seed.set(s);
    seed.set(nwbo(i+1, 4), s.length);
    let u = await jschmac.compute(p, seed, hash);
    let outputF = new Uint8Array(u);
    for(let j = 1; j < c; j++){
      u = await jschmac.compute(p, u, hash);
      outputF = u.map( (elem, idx) => elem ^ outputF[idx]);
    }
    return {index: i, value: outputF};
  };
  const Tis = [];
  const DK = new Uint8Array(dkLen);
  for(let i = 0; i < l; i++) Tis.push(funcF(i));
  const TisResolved = await Promise.all(Tis);
  TisResolved.forEach( (elem) => {
    if (elem.index !== l - 1) DK.set(elem.value, elem.index*hLen);
    else DK.set(elem.value.slice(0, r), elem.index*hLen);
  });

  return DK;
}

function nwbo(num, len){
  const arr = new Uint8Array(len);

  for(let i=0; i<len; i++){
    arr[i] = 0xFF && (num >> ((len - i - 1)*8));
  }

  return arr;
}


//////////////////////////////
// PBES1 RFC8081 Section 6.1.2
async function decryptPBES1(decoded, passphrase){
  // pbkdf1
  const pBuffer = jseu.encoder.stringToArrayBuffer(passphrase);
  const salt = new Uint8Array(decoded.encryptionAlgorithm.parameters.salt);
  const hash = params.passwordBasedEncryptionSchemes[decoded.encryptionAlgorithm.algorithm].hash;
  const iterationCount = decoded.encryptionAlgorithm.parameters.iterationCount.toNumber();
  const keyIv = await pbkdf1(pBuffer, salt, iterationCount, 16, hash);
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
}

async function pbkdf1(p, s, c, dkLen, hash){
  if(dkLen > params.hashes[hash].hashSize) throw new Error('TooLongIntendedKeyLength');
  let seed = new Uint8Array(p.length + s.length);
  seed.set(p);
  seed.set(s, p.length);
  for(let i = 0; i < c; i++){
    seed = await jschash.compute(seed, hash);
  }
  return seed.slice(0, dkLen);
}
