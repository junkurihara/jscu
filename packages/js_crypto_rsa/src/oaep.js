/**
 * oaep.js
 */
import params from './params.js';
import jschash from 'js-crypto-hash/dist/index.js';
import random from 'js-crypto-random/dist/index.js';


// RFC3447 https://tools.ietf.org/html/rfc3447
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
import jseu from 'js-encoding-utils';
export async function emeOaepEncode(msg, label, k, hash='SHA-256'){
  const hashSize = params.hashes[hash].hashSize;

  let ps = new Uint8Array(k - msg.length - (2*hashSize) - 2);
  ps = ps.map( (elem) => 0x00);

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
}


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

export async function emeOaepDecode(em, label, k, hash='SHA-256'){
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

  let offset;
  for(let i = hashSize; i < db.length; i++){
    if(db[i] !== 0x00){
      offset = i;
      break;
    }
  }
  const separator = db[offset];
  if(separator !== 0x01) throw new Error('DecryptionError');

  return db.slice(offset+1, db.length);
}


/**
 * mask generation function 1 (MGF1)
 * @param seed
 * @param len
 * @param hash
 * @return {Promise<Uint8Array>}
 */
async function mgf1(seed, len, hash = 'SHA-256'){
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
}

function i2osp(x, len){
  const r = new Uint8Array(len);
  r.forEach( (elem, idx) => {
    const y = 0xFF & (x >> (idx*8));
    r[len - idx - 1] = y;
  });
  return r;
}