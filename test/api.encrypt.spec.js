import jscu from '../src/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

describe('encryption test', () => {
  const curves = ['P-256', 'P-384', 'P-521'];
  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let keySet = [];
  let msg;
  before( async () => {
    keySet = await Promise.all(curves.map( async (crv) => {
      return [ await jscu.pkc.generateKey('EC', {namedCurve: crv}), await jscu.pkc.generateKey('EC', {namedCurve: crv})];
    }));
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('Encrypted message is successfully generated and decrypted', async () => {
    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < hashes.length; j++) {
        let options = {
          privateKey: keySet[i][1].privateKey,
          hash: hashes[j],
          encrypt: 'AES-GCM',
          keyLength: 32,
          info: ''
        };
        const encrypted = await jscu.pkc.encrypt(msg, keySet[i][0].publicKey, options);

        options = {
          publicKey: keySet[i][1].publicKey,
          hash: hashes[j],
          encrypt: 'AES-GCM',
          keyLength: 32,
          info: '',
          salt: encrypted.salt,
          iv: encrypted.iv
        };
        const decrypted = await jscu.pkc.decrypt(encrypted.data, keySet[i][0].privateKey, options);

        expect(msg.toString() === decrypted.toString()).to.be.true;
      }
    }
  });
});

