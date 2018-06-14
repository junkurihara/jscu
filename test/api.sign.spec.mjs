import jscu from '../src/index.mjs';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Signing and verification test via exported api', () => {
  const getKeyParam = (elem) => {
    const keyParams =  {
      extractable: true,
      keyUsage: ['sign', 'verify']
    };
    const algo = {algo: {name: 'ECDSA', namedCurve: elem}};
    return Object.assign(algo, keyParams);
  };
  const curves = ['P-256', 'P-384', 'P-521'];
  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let keySet = [];
  let msg;
  before( async () => {
    keySet = await Promise.all(curves.map( async (crv) =>{
      const param = getKeyParam(crv);
      return await jscu.crypto.generateKeyPair(param);
    }));
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });



  it('ECDSA Signing and verification should be done successfully', async () => {
    for (let i = 0; i < curves.length; i++){
      for (let j = 0; j < hashes.length; j++){
        const sig = await jscu.crypto.sign(msg, keySet[i].privateKey.key, {name: hashes[j]});
        const result = await jscu.crypto.verify(msg, sig, keySet[i].publicKey.key, {name: hashes[j]});
        expect(result).to.be.true;
      }
    }
  });

});