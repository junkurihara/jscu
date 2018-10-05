import jscu from '../src/index.js';
import rsaSample from './rsa_sample.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Signing and verification test via exported api', () => {
  const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let keySet = [];
  let msg;
  before( async () => {
    keySet = await Promise.all(curves.map( async (crv) => await jscu.pkc.generateKey('EC', {namedCurve: crv})));
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });



  it('ECDSA Signing and verification should be done successfully', async () => {
    for (let i = 0; i < curves.length; i++){
      for (let j = 0; j < hashes.length; j++){
        const sig = await jscu.pkc.sign(msg, keySet[i].privateKey, hashes[j]);
        const result = await jscu.pkc.verify(msg, sig, keySet[i].publicKey, hashes[j]);
        expect(result).to.be.true;
      }
    }
  });

  it('RSA-PSS Signing and verification should be done successfully', async () => {
    const array = await Promise.all(
      Object.keys(rsaSample).map( async (modulusLength) => {
        let result = true;
        for(let i = 0; i < hashes.length; i++) {
          const sig = await jscu.pkc.sign(msg, rsaSample[modulusLength].privateKey.jwk, hashes[i], {name: 'RSA-PSS', saltLength: 32});
          const valid = await jscu.pkc.verify(msg, sig, rsaSample[modulusLength].publicKey.jwk, hashes[i], {name: 'RSA-PSS', saltLength: 32});
          result = valid && result;
        }
        return result;
      }));
    console.log(array);
  });

  it('RSASSA-PKCS1-v1_5 Signing and verification should be done successfully', async () => {
    const array = await Promise.all(
      Object.keys(rsaSample).map( async (modulusLength) => {
        let result = true;
        for(let i = 0; i < hashes.length; i++) {
          const sig = await jscu.pkc.sign(msg, rsaSample[modulusLength].privateKey.jwk, hashes[i], {name: 'RSASSA-PKCS1-v1_5'});
          const valid = await jscu.pkc.verify(msg, sig, rsaSample[modulusLength].publicKey.jwk, hashes[i], {name: 'RSASSA-PKCS1-v1_5'});
          result = valid && result;
        }
        return result;
      }));
    console.log(array);
  });

});