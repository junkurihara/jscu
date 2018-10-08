import hmac from '../src/index.js';
import random from 'js-crypto-random';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


let hashes = ['SHA-256', 'SHA-384', 'SHA-512'];
describe('HMAC test', () => {
  let msg;
  before( async () => {
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('HMAC successfully generates unique MAC for unique key', async function () {
    this.timeout(20000);
    if(typeof window !== 'undefined' && typeof window.msCrypto !== 'undefined') hashes = ['SHA-256', 'SHA-384']; // SHA-512 doesn't work in IE
    await Promise.all(hashes.map( async (hash) => {
      const keya = await random.getRandomBytes(32);
      const keyb = await random.getRandomBytes(32);
      const da = await hmac.compute(keya, msg, hash);
      const db = await hmac.compute(keyb, msg, hash);
      expect(da).to.be.a('Uint8Array');
      expect(db).to.be.a('Uint8Array');
      expect(da.toString() === db.toString(), `failed at ${hash}`).to.be.false;
    }));
  });

  it('If msg is overwritten, it can be detected via MAC', async function () {
    this.timeout(20000);
    if(typeof window !== 'undefined' && typeof window.msCrypto !== 'undefined') hashes = ['SHA-256', 'SHA-384']; // SHA-512 doesn't work in IE
    await Promise.all(hashes.map( async (hash) => {
      const key = await random.getRandomBytes(32);
      const d = await hmac.compute(key, msg, hash);
      const success = await hmac.verify(key, msg, d, hash);
      expect(success, `failed at ${hash}`).to.be.true;

      const newmsg = Object.assign({}, {x: msg}).x;
      newmsg[1] = 0x33;
      const fail = await hmac.verify(key, newmsg, d, hash);
      expect(fail, `failed at ${hash}`).to.be.false;
    }));
  });
});

