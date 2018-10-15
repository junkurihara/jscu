import keyutils from '../src/index.js';
import sampleRSA from './rsa_sample.js';

import jseu from 'js-encoding-utils';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

function objectSort(obj){
  const keys = Object.keys(obj).sort();
  const map = {};
  keys.forEach((key) => { map[key] = obj[key]; });
  return map;
}


const bits = ['2048', '4096'];
describe('RSA Key conversion from/to JWK test.', () => {
  before(async () => {
  });

  it('JWK RSA should be successfully converted from PEM', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {
      // public key
      const jwkpub = await keyutils.toJwkFrom('pem', sampleRSA[bitLen].publicKey.pem);

      // private key
      const jwkpri = await keyutils.toJwkFrom('pem', sampleRSA[bitLen].privateKey.pem);


      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(sampleRSA[bitLen].publicKey.jwk)))
        && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(sampleRSA[bitLen].privateKey.jwk)));
    }));
    console.log(array);
    expect( array.every( (a) => a)).to.be.true;
  });

  it('PEM RSA should be successfully converted from JWK', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {

      const pempub = await keyutils.fromJwkTo('pem', sampleRSA[bitLen].publicKey.jwk);

      const pempri = await keyutils.fromJwkTo('pem', sampleRSA[bitLen].privateKey.jwk);

      return (pempub === sampleRSA[bitLen].publicKey.pem) && (pempri === sampleRSA[bitLen].privateKey.pem);
    }));
    console.log(array);
    expect( array.every( (a) => a)).to.be.true;
  });

  it('JWK RSA should be successfully converted from DER', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {
      const derpub = jseu.formatter.pemToBin(sampleRSA[bitLen].publicKey.pem);
      const derpri = jseu.formatter.pemToBin(sampleRSA[bitLen].privateKey.pem);

      // public key
      const jwkpub = await keyutils.toJwkFrom('der', derpub);

      // private key
      const jwkpri = await keyutils.toJwkFrom('der', derpri);


      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(sampleRSA[bitLen].publicKey.jwk)))
        && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(sampleRSA[bitLen].privateKey.jwk)));
    }));
    console.log(array);
    expect( array.every( (a) => a)).to.be.true;
  });

  it('DER RSA should be successfully converted from JWK', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {

      const pempub = await keyutils.fromJwkTo('pem', sampleRSA[bitLen].publicKey.jwk);

      const pempri = await keyutils.fromJwkTo('pem', sampleRSA[bitLen].privateKey.jwk);

      const derpub = jseu.formatter.pemToBin(pempub);
      const derpri = jseu.formatter.pemToBin(pempri);

      return (derpub.toString() === jseu.formatter.pemToBin(sampleRSA[bitLen].publicKey.pem).toString())
        && (derpri.toString() === jseu.formatter.pemToBin(sampleRSA[bitLen].privateKey.pem).toString());
    }));
    console.log(array);
    expect( array.every( (a) => a)).to.be.true;
  });

});