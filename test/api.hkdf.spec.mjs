import jscu from '../src/index.mjs';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


const hashes = ['SHA-256', 'SHA-384', 'SHA-512'];
describe('HKDF test', () => {
  let msg;
  const length = 144;
  before( async () => {
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('HKDF is done with automatic salt generation', async () => {
    await Promise.all(hashes.map( async (hash) => {
      const d = await jscu.crypto.hkdf.getKeySalt(msg, 'SHA-256', length, '', null);
      expect(d.key).to.be.a('Uint8Array');
      expect(d.salt).to.be.a('Uint8Array');
      expect(d.key.byteLength, `failed at ${hash}`).to.be.equal(length);
    }));
  });

  it('When the same salt is given, the same hash is obtained with HKDF', async () => {
    await Promise.all(hashes.map( async (hash) => {
      const d = await jscu.crypto.hkdf.getKeySalt(msg, 'SHA-256', length, '', null);
      expect(d.key).to.be.a('Uint8Array');
      expect(d.salt).to.be.a('Uint8Array');
      expect(d.key.byteLength, `failed at ${hash}`).to.be.equal(length);

      const dash = await jscu.crypto.hkdf.getKeySalt(msg, 'SHA-256', length, '', d.salt);
      expect(dash.key).to.be.a('Uint8Array');
      expect(dash.salt).to.be.a('Uint8Array');
      expect(dash.key.toString() === d.key.toString(), `failed at ${hash}`).to.be.true;
    }));
  });
});

