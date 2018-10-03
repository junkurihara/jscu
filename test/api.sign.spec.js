import jscu from '../src/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Signing and verification test via exported api', () => {
  const curves = ['P-256', 'P-384', 'P-521'];
  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let keySet = [];
  let msg;
  before( async () => {
    keySet = await Promise.all(curves.map( async (crv) =>{
      return await jscu.pkc.generateKey('EC', {namedCurve: crv});
    }));
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

});