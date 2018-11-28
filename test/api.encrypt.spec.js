import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const jscu = env.library;
const envName = env.envName;

import rsaSample from './rsa_sample.js';

describe(`${envName}: Encryption test`, () => {
  const curves = ['P-256', 'P-384', 'P-521'];
  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let ecKeySet = [];
  let rsaKeySet = [];
  let msg;
  before( async () => {
    ecKeySet = await Promise.all(curves.map( async (crv) => [ await jscu.pkc.generateKey('EC', {namedCurve: crv}), await jscu.pkc.generateKey('EC', {namedCurve: crv})]));
    rsaKeySet = await Promise.all([2048, 4096].map( async (nLen) => await jscu.pkc.generateKey('RSA', {modulusLength: nLen})));
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('ECDH: Encrypted message is successfully generated and decrypted', async () => {
    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < hashes.length; j++) {
        let options = {
          privateKey: ecKeySet[i][1].privateKey,
          hash: hashes[j],
          encrypt: 'AES-GCM',
          keyLength: 32,
          info: ''
        };
        const encrypted = await jscu.pkc.encrypt(msg, ecKeySet[i][0].publicKey, options);

        options = {
          publicKey: ecKeySet[i][1].publicKey,
          hash: hashes[j],
          encrypt: 'AES-GCM',
          keyLength: 32,
          info: '',
          salt: encrypted.salt,
          iv: encrypted.iv
        };
        const decrypted = await jscu.pkc.decrypt(encrypted.data, ecKeySet[i][0].privateKey, options);

        expect(msg.toString() === decrypted.toString()).to.be.true;
      }
    }
  });

  it('RSA-OAEP: Encrypted message is successfully generated and decrypted', async () => {
    const results = await Promise.all(rsaKeySet.map( async (kp) => {
      let result = true;
      const encrypted = await jscu.pkc.encrypt(msg, kp.publicKey, {hash: 'SHA-256'}).catch( (e) => {console.error(e); result = false;});
      const decrypted = await jscu.pkc.decrypt(encrypted.data, kp.privateKey, {hash: 'SHA-256'}).catch( (e) => {result = false;});

      expect(result).to.be.true;
      return (decrypted.toString() === msg.toString());
    }));
    expect(results.every( (r) => r)).to.be.true;
  });
});

