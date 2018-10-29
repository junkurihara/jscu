import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const keyutils = env.library;
const envName = env.envName;

import ec from 'js-crypto-ec/dist/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

function objectSort(obj){
  const keys = Object.keys(obj).sort();
  const map = {};
  keys.forEach((key) => { map[key] = obj[key]; });
  return map;
}

function prune(jwk){
  delete jwk.ext;
  delete jwk.alg;
  delete jwk.key_ops;
  return jwk;
}


const curves = ['P-256', 'P-384', 'P-521'];
describe(`${envName}: EC Key conversion from/to JWK test.`, () => {
  
  let ECKeySet = [];
  before(async function (){
    this.timeout(20000);
    ECKeySet = await Promise.all(curves.map(async (crv) => await ec.generateKey(crv)));
  });

  it('JWK EC should be successfully converted to PEM and re-converted to JWK correctly', async () => {
    const array = await Promise.all(ECKeySet.map( async (key) => {
      const publicKey = new keyutils.Key('jwk', key.publicKey);
      const privateKey = new keyutils.Key('jwk', key.privateKey);

      const pempub = await publicKey.export('pem', {compact: false});
      const pempri = await privateKey.export('pem', {compact: false});

      const publicKey2 = new keyutils.Key('pem', pempub);
      const privateKey2 = new keyutils.Key('pem', pempri);

      const jwkpub = await publicKey2.export('jwk');
      const jwkpri = await privateKey2.export('jwk');

      const res =  (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(prune(key.publicKey))))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(prune(key.privateKey))));
      if (!res) {
        console.log(objectSort(jwkpub));
        console.log(objectSort(key.publicKey));
        console.log(objectSort(jwkpri));
        console.log(objectSort(key.privateKey));
        // console.log(pempub);
        // console.log(pempri);
      }
      return res;
    }));
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to PEM and re-converted to JWK correctly with public key compact form', async () => {

    const array = await Promise.all(ECKeySet.map( async (key) => {
      const publicKey = new keyutils.Key('jwk', key.publicKey);
      const privateKey = new keyutils.Key('jwk', key.privateKey);

      const pempub = await publicKey.export('pem', {compact: true});
      const pempri = await privateKey.export('pem', {compact: true});

      const publicKey2 = new keyutils.Key('pem', pempub);
      const privateKey2 = new keyutils.Key('pem', pempri);

      const jwkpub = await publicKey2.export('jwk');
      const jwkpri = await privateKey2.export('jwk');

      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(prune(key.publicKey))))
        && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(prune(key.privateKey))));
    }));
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });


  it('JWK EC should be successfully converted to DER and re-converted to JWK correctly', async () => {

    const array = await Promise.all(ECKeySet.map( async (key) => {
      const publicKey = new keyutils.Key('jwk', key.publicKey);
      const privateKey = new keyutils.Key('jwk', key.privateKey);

      const derpub = await publicKey.export('der', {compact: false});
      const derpri = await privateKey.export('der', {compact: false});

      const publicKey2 = new keyutils.Key('der', derpub);
      const privateKey2 = new keyutils.Key('der', derpri);

      const jwkpub = await publicKey2.export('jwk');
      const jwkpri = await privateKey2.export('jwk');


      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(prune(key.publicKey))))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(prune(key.privateKey))));
    }));
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to DER and re-converted to JWK correctly with public key compact form', async () => {
    const array = await Promise.all(ECKeySet.map( async (key) => {
      const publicKey = new keyutils.Key('jwk', key.publicKey);
      const privateKey = new keyutils.Key('jwk', key.privateKey);

      const derpub = await publicKey.export('der', {compact: true});
      const derpri = await privateKey.export('der', {compact: true});

      const publicKey2 = new keyutils.Key('der', derpub);
      const privateKey2 = new keyutils.Key('der', derpri);

      const jwkpub = await publicKey2.export('jwk');
      const jwkpri = await privateKey2.export('jwk');

      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(prune(key.publicKey))))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(prune(key.privateKey))));
    }));
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to uncompressed-octet formed key and vice varsa', async () => {
    const array = await Promise.all(ECKeySet.map( async (key) => {
      const publicKey = new keyutils.Key('jwk', key.publicKey);
      const privateKey = new keyutils.Key('jwk', key.privateKey);

      const octpub = await publicKey.export('oct', {compact: false});
      const octpri = await privateKey.export('oct', {compact: false});

      const publicKey2 = new keyutils.Key('oct', octpub, {namedCurve: key.publicKey.crv});
      const privateKey2 = new keyutils.Key('oct', octpri, {namedCurve: key.privateKey.crv});

      const jwkpub = await publicKey2.export('jwk');
      const jwkpri = await privateKey2.export('jwk');

      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(prune(key.publicKey))))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(prune(key.privateKey))));
    }));
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to compact-octet formed key and vice varsa', async () => {
    const array = await Promise.all(ECKeySet.map( async (key) => {
      const publicKey = new keyutils.Key('jwk', key.publicKey);
      const privateKey = new keyutils.Key('jwk', key.privateKey);

      const octpub = await publicKey.export('oct', {compact: true});
      const octpri = await privateKey.export('oct', {compact: true});
      // console.log(octpub);

      const publicKey2 = new keyutils.Key('oct', octpub, {namedCurve: key.publicKey.crv});
      const privateKey2 = new keyutils.Key('oct', octpri, {namedCurve: key.privateKey.crv});

      const jwkpub = await publicKey2.export('jwk');
      const jwkpri = await privateKey2.export('jwk');

      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(prune(key.publicKey))))
        && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(prune(key.privateKey))));
    }));
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

});