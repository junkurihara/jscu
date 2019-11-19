/**
 * oaep.js
 */
import * as params from './params';
import jschash from 'js-crypto-hash';
import random from 'js-crypto-random';
import {HashTypes} from './typedef';


// RFC3447 https://tools.ietf.org/html/rfc3447
/*
      # Encryption
      a. If the length of L is greater than the input limitation for the
         hash function (2^61 - 1 octets for SHA-1), output "label too
         long" and stop.

      b. If mLen > k - 2hLen - 2, output "message too long" and stop.

      # Decryption
      a. If the length of L is greater than the input limitation for the
         hash function (2^61 - 1 octets for SHA-1), output "decryption
         error" and stop.

      b. If the length of the ciphertext C is not k octets, output
         "decryption error" and stop.

      c. If k < 2hLen + 2, output "decryption error" and stop.
 */

type OaepParams =  {k: number, label: Uint8Array, hash: HashTypes, mLen: number, cLen: number}
/**
 * Check OAEP length
 * @param {String} mode - 'encrypt' or 'decrypt'
 * @param {Number} k - Octet length of modulus length, i.e., n.
 * @param {Uint8Array} label - OAEP label.
 * @param {String} hash - Name of hash function.
 * @param {Number} mLen - Octet length of message to be encrypted.
 * @param {Number} cLen - the length of ciphertext
 * @throws {Error} - Throws if LabelTooLong, MessageTooLong, DecryptionError or InvalidMode.
 */
export const checkLength = (
  mode: 'encrypt'|'decrypt', {k, label, hash, mLen, cLen}: OaepParams) => {
  if (mode === 'encrypt') {
    if (label.length > (1 << params.hashes[hash].maxInput) - 1) throw new Error('LabelTooLong');
    if (mLen > k - 2 * params.hashes[hash].hashSize - 2) throw new Error('MessageTooLong');
  }
  else if (mode === 'decrypt') {
    if (label.length > (1 << params.hashes[hash].maxInput) - 1) throw new Error('DecryptionError');
    if (cLen !== k || k < 2 * params.hashes[hash].hashSize + 2) throw new Error('DecryptionError');
  }
  else throw new Error('InvalidMode');
};


/*
      a. If the label L is not provided, let L be the empty string. Let
         lHash = Hash(L), an octet string of length hLen (see the note
         below).

      b. Generate an octet string PS consisting of k - mLen - 2hLen - 2
         zero octets.  The length of PS may be zero.

      c. Concatenate lHash, PS, a single octet with hexadecimal value
         0x01, and the message M to form a data block DB of length k -
         hLen - 1 octets as

            DB = lHash || PS || 0x01 || M.

      d. Generate a random octet string seed of length hLen.

      e. Let dbMask = MGF(seed, k - hLen - 1).

      f. Let maskedDB = DB \xor dbMask.

      g. Let seedMask = MGF(maskedDB, hLen).

      h. Let maskedSeed = seed \xor seedMask.

      i. Concatenate a single octet with hexadecimal value 0x00,
         maskedSeed, and maskedDB to form an encoded message EM of
         length k octets as

            EM = 0x00 || maskedSeed || maskedDB.
 */
/**
 * OAEP Encoder
 * @param {Uint8Array} msg - Message.
 * @param {Uint8Array} label - Label.
 * @param {Number} k - Octet length of modulus length, i.e., n.
 * @param {String} hash - Name of hash function.
 * @return {Promise<Uint8Array>} - OAEP encoded message.
 */
export const emeOaepEncode = async (
  msg: Uint8Array,
  label: Uint8Array,
  k: number, hash: HashTypes='SHA-256'
): Promise<Uint8Array> => {
  const hashSize = params.hashes[hash].hashSize;

  let ps = new Uint8Array(k - msg.length - (2*hashSize) - 2);
  ps = ps.map( () => 0x00);

  const lHash = await jschash.compute(label, hash);

  const db = new Uint8Array(k - hashSize - 1);
  db.set(lHash);
  db.set(ps, hashSize);
  db.set(new Uint8Array([0x01]), k- msg.length - hashSize - 2);
  db.set(msg, k - msg.length - hashSize - 1);

  const seed = await random.getRandomBytes(hashSize);

  const dbMask = await mgf1(seed, k - hashSize - 1, hash);

  const maskedDb = db.map( (elem, idx) => 0xFF & (elem ^ dbMask[idx]));

  const seedMask = await mgf1(maskedDb, hashSize, hash);

  const maskedSeed = seed.map( (elem, idx) => 0xFF & (elem ^ seedMask[idx]));

  const em = new Uint8Array(k);
  em.set(new Uint8Array([0x00]));
  em.set(maskedSeed, 1);
  em.set(maskedDb, hashSize + 1);

  return em;
};


/*
      a. If the label L is not provided, let L be the empty string. Let
         lHash = Hash(L), an octet string of length hLen (see the note
         in Section 7.1.1).

      b. Separate the encoded message EM into a single octet Y, an octet
         string maskedSeed of length hLen, and an octet string maskedDB
         of length k - hLen - 1 as

            EM = Y || maskedSeed || maskedDB.

      c. Let seedMask = MGF(maskedDB, hLen).

      d. Let seed = maskedSeed \xor seedMask.

      e. Let dbMask = MGF(seed, k - hLen - 1).

      f. Let DB = maskedDB \xor dbMask.

      g. Separate DB into an octet string lHash' of length hLen, a
         (possibly empty) padding string PS consisting of octets with
         hexadecimal value 0x00, and a message M as

            DB = lHash' || PS || 0x01 || M.

         If there is no octet with hexadecimal value 0x01 to separate PS
         from M, if lHash does not equal lHash', or if Y is nonzero,
         output "decryption error" and stop.  (See the note below.)
 */

/**
 * OAEP Decoder
 * @param {Uint8Array} em - OAEP encoded message.
 * @param {Uint8Array} label - Label.
 * @param {Number} k - Octet length of modulus length, i.e., n.
 * @param {String} hash - Name of hash function.
 * @return {Promise<Uint8Array>} - OAEP decoded message.
 * @throws {Error} - Throws if DecryptionError.
 */
export const emeOaepDecode = async (
  em: Uint8Array,
  label: Uint8Array,
  k: number,
  hash: HashTypes='SHA-256'
): Promise<Uint8Array> => {
  const hashSize = params.hashes[hash].hashSize;

  const lHash = await jschash.compute(label, hash); // must be equal to lHashPrime

  const y = em[0]; // must be zero
  if (y !== 0x00) throw new Error('DecryptionError');

  const maskedSeed = em.slice(1, hashSize+1);
  const maskedDb = em.slice(hashSize+1, em.length);

  const seedMask = await mgf1(maskedDb, hashSize, hash);
  const seed = maskedSeed.map( (elem, idx) => 0xFF & (elem ^ seedMask[idx]));

  const dbMask = await mgf1(seed, k-hashSize-1, hash);
  const db = maskedDb.map( (elem, idx) => 0xFF & (elem ^ dbMask[idx]));

  const lHashPrime = db.slice(0, hashSize);

  if(lHashPrime.toString() !== lHash.toString()) throw new Error('DecryptionError');

  let offset: number = 0;
  for(let i = hashSize; i < db.length; i++){
    if(db[i] !== 0x00){
      offset = i;
      break;
    }
  }
  const separator = db[offset];
  if(separator !== 0x01) throw new Error('DecryptionError');

  return db.slice(offset+1, db.length);
};


/**
 * Mask generation function 1 (MGF1)
 * @param {Uint8Array} seed - Seed.
 * @param {Number} len - Length of mask.
 * @param {String} [hash='SHA-256'] - Name of hash algorithm.
 * @return {Promise<Uint8Array>}: Generated mask.
 */
const mgf1 = async (
  seed: Uint8Array,
  len: number,
  hash: HashTypes = 'SHA-256'
): Promise<Uint8Array> => {
  const hashSize = params.hashes[hash].hashSize;
  const blockLen = Math.ceil(len/ hashSize);

  const t = new Uint8Array(blockLen*hashSize);

  for(let i = 0; i < blockLen; i++) {
    const c = i2osp(i, 4);
    const x = new Uint8Array(seed.length + 4);
    x.set(seed);
    x.set(c, seed.length);
    const y = await jschash.compute(x, hash);
    t.set(y, i * hashSize);
  }
  return t.slice(0, len);
};

/**
 * I2OSP function
 * @param {Number} x - Number to be encoded to byte array in network byte order.
 * @param {Number} len - Length of byte array
 * @return {Uint8Array} - Encoded number.
 */
const i2osp = (
  x: number,
  len: number
): Uint8Array => {
  const r = new Uint8Array(len);
  // @ts-ignore
  r.forEach( (elem, idx) => {
    const y = 0xFF & (x >> (idx*8));
    r[len - idx - 1] = y;
  });
  return r;
};
