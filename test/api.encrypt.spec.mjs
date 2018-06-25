import jscu from '../src/index.mjs';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

describe('encryption test', () => {
  const getKeyParam = (elem) => {
    return {keyType: 'EC', namedCurve: elem};
  };
  const curves = ['P-256', 'P-384', 'P-521'];
  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let keySet = [];
  let msg;
  before( async () => {
    keySet = await Promise.all(curves.map( async (crv) => {
      const param = getKeyParam(crv);
      return [ await jscu.crypto.generateKeyPair(param), await jscu.crypto.generateKeyPair(param)];
    }));
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('encrypted message is successfully generated and decrypted', async () => {
    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < hashes.length; j++) {
        let options = {
          hash: hashes[j],
          encrypt: 'AES-GCM',
          keyLength: 32,
          info: ''
        };
        const encrypted = await jscu.crypto.encrypt(msg, keySet[i][0].publicKey.key, keySet[i][1].privateKey.key, options);

        options = {
          hash: hashes[j],
          encrypt: 'AES-GCM',
          keyLength: 32,
          info: '',
          salt: encrypted.salt,
          iv: encrypted.iv
        };
        const decrypted = await jscu.crypto.decrypt(encrypted.data, keySet[i][0].privateKey.key, keySet[i][1].publicKey.key, options);

        expect(msg.toString() === decrypted.toString()).to.be.true;
      }
    }
  });
});

