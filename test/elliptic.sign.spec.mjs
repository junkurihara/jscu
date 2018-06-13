import elliptic from '../src/crypto/elliptic/index.mjs';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Signing and verification test in pure js ecdsa', () => {
  const curves = ['P-256', 'P-384', 'P-521'];
  let keySet = [];
  let msg;
  before( async () => {
    const algo = { name: 'ECDSA' };
    keySet = await Promise.all(
      curves.map( async (elem) => await elliptic.crypto.generateKeyPair(Object.assign(algo, {namedCurve: elem})))
    );
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });


  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  it('ECDSA Signing and verification should be done successfully', async () => {
    const algo = { name: 'ECDSA' };  //canonical:true
    for (let i = 0; i < curves.length; i++){
      for (let j =0; j < hashes.length; j++){
        const sig = await elliptic.crypto.sign(
          Object.assign(algo, {namedCurve: curves[i], hash: { name: hashes[j] } }),
          keySet[i].privateKey.key,
          msg);
        const result = await elliptic.crypto.verify(
          Object.assign(algo, {namedCurve: curves[i], hash: {name: hashes[j]}}),
          keySet[i].publicKey.key,
          sig,
          msg);
        expect(result).to.be.true;
      }
    }
  });

});