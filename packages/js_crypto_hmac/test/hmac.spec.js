import hmac from '../src/index.js';
import random from 'js-crypto-random';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

import jseu from 'js-encoding-utils';


const hashes = ['SHA-256', 'SHA-384', 'SHA-512', 'MD5', 'SHA-1'];
describe('HMAC test', () => {
  let msg;
  before( async () => {
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('HMAC successfully generates unique MAC for unique key', async function () {
    this.timeout(20000);
    const array = await Promise.all(hashes.map( async (hash) => {
      const keya = await random.getRandomBytes(32);
      const keyb = await random.getRandomBytes(32);
      const da = await hmac.compute(keya, msg, hash);
      const db = await hmac.compute(keyb, msg, hash);
      expect(da).to.be.a('Uint8Array');
      expect(db).to.be.a('Uint8Array');
      return da.toString() !== db.toString();
    }));
    console.log(array);
    expect(array.every((a) => (a === true))).to.be.true;
  });

  it('If msg is overwritten, it can be detected via MAC', async function () {
    this.timeout(20000);
    const key = await random.getRandomBytes(32);
    const newMsg = new Uint8Array(msg);
    newMsg[1] = 0xFF&0x33;

    const origArray = await Promise.all(hashes.map( async (hash) => jseu.encoder.encodeBase64(await hmac.compute(key, msg, hash))));
    const altArray = await Promise.all(hashes.map( async (hash) => jseu.encoder.encodeBase64(await hmac.compute(key, newMsg, hash))));

    const array = origArray.map( (orig, idx) => orig !== altArray[idx]);
    console.log(array);
    console.log(origArray);
    console.log(altArray);

    expect(array.every( (x) => x)).to.be.true;

  });
});

