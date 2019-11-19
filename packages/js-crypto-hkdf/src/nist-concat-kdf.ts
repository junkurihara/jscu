import params, {HashTypes} from './params';
import digest from 'js-crypto-hash';

// Deriving KEK
// https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-56Ar2.pdf
// https://tools.ietf.org/html/rfc7518
/**
 * NIST Concatenation KDF fo JOSE
 * @param sharedSecret {Uint8Array} - ECDH Output
 * @param otherInfoBytes {Uint8Array} - other info
 * @param keyDataLen {number} - output key length in bytes
 * @param hash {string} - the default is 'SHA-256'
 * @return {Promise<Uint8Array>}
 */
export const nistConcatKdf = async (
  sharedSecret: Uint8Array,
  otherInfoBytes: Uint8Array,
  keyDataLen: number = 32,
  hash: HashTypes = 'SHA-256'
) => {
  const reps = Math.ceil(keyDataLen / params.hashes[hash].hashSize);
  if(reps > (Math.pow(2, 32) - 1)) throw new Error('TooLongKeyDataIndicated');

  const output = new Uint8Array(params.hashes[hash].hashSize * reps);
  let counter = new Uint8Array(4);
  for(let i = 0; i < reps; i++){
    counter = increment(counter);
    const msg = new Uint8Array(4 + sharedSecret.length + otherInfoBytes.length);
    msg.set(counter);
    msg.set(sharedSecret, counter.length);
    msg.set(otherInfoBytes, counter.length + sharedSecret.length);
    const ki = await digest.compute(msg, hash);
    output.set(ki, i*params.hashes[hash].hashSize);
  }

  return output.slice(0, keyDataLen);
};


const increment = (counter: Uint8Array) => {
  counter[3] += 1;
  let up = true;
  let i = 3;
  while(up && i > 0){
    counter[i-1] += (up && counter[i] === 0) ? 1 : 0;
    up = (up && counter[i] === 0);
    i--;
  }

  return counter;
};
