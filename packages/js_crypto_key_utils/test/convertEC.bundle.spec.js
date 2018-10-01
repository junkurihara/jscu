import keyutils from '../dist/jsckeyutil.bundle.js';
import jscu from 'js-crypto-utils';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

function objectSort(obj){
  const keys = Object.keys(obj).sort();
  const map = {};
  keys.forEach((key) => { map[key] = obj[key]; });
  return map;
}


const curves = ['P-256', 'P-384', 'P-521'];
describe('EC Key conversion from/to JWK test.', () => {

  const getKeyParam = (elem) => ({keyType: 'EC', namedCurve: elem});
  let ECKeySet = [];
  before(async () => {
    ECKeySet = await Promise.all(curves.map(async (crv) => {
      const param = getKeyParam(crv);
      return await jscu.crypto.generateKeyPair(param);
    }));
  });

  it('JWK EC should be successfully converted to PEM and re-converted to JWK correctly', async () => {
    const array = ECKeySet.map( (key) => {
      const pempub = keyutils.fromJwkTo('pem', key.publicKey.key, 'public', {compact: false});
      const pempri = keyutils.fromJwkTo('pem', key.privateKey.key, 'private', {compact: false});
      // console.log(pempub);
      // console.log(pempri);
      const jwkpub = keyutils.toJwkFrom('pem', pempub, 'public');
      const jwkpri = keyutils.toJwkFrom('pem', pempri, 'private');
      delete key.publicKey.key.ext;
      delete key.privateKey.key.ext;
      delete key.publicKey.key.alg;
      delete key.privateKey.key.alg;
      delete key.publicKey.key.key_ops;
      delete key.privateKey.key.key_ops;
      const res =  (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
      if (!res) {
        console.log(objectSort(jwkpub));
        console.log(objectSort(key.publicKey.key));
        console.log(objectSort(jwkpri));
        console.log(objectSort(key.privateKey.key));
        // console.log(pempub);
        // console.log(pempri);
      }
      return res;
    });
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to PEM and re-converted to JWK correctly with public key compact form', async () => {

    const array = ECKeySet.map( (key) => {
      const pempub = keyutils.fromJwkTo('pem', key.publicKey.key, 'public', {compact: true});
      const pempri = keyutils.fromJwkTo('pem', key.privateKey.key, 'private', {compact: true});
      // console.log(pempub);
      // console.log(pempri);
      const jwkpub = keyutils.toJwkFrom('pem', pempub, 'public');
      const jwkpri = keyutils.toJwkFrom('pem', pempri, 'private');
      delete key.publicKey.key.ext;
      delete key.privateKey.key.ext;
      delete key.publicKey.key.alg;
      delete key.privateKey.key.alg;
      delete key.publicKey.key.key_ops;
      delete key.privateKey.key.key_ops;
      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
    });
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });


  it('JWK EC should be successfully converted to DER and re-converted to JWK correctly', async () => {

    const array = ECKeySet.map( (key) => {
      const derpub = keyutils.fromJwkTo('der', key.publicKey.key, 'public', {compact: false});
      const derpri = keyutils.fromJwkTo('der', key.privateKey.key, 'private', {compact: false});

      const jwkpub = keyutils.toJwkFrom('der', derpub, 'public');
      const jwkpri = keyutils.toJwkFrom('der', derpri, 'private');
      delete key.publicKey.key.ext;
      delete key.privateKey.key.ext;
      delete key.publicKey.key.alg;
      delete key.privateKey.key.alg;
      delete key.publicKey.key.key_ops;
      delete key.privateKey.key.key_ops;
      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
    });
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to DER and re-converted to JWK correctly with public key compact form', async () => {
    const array = ECKeySet.map( (key) => {
      const derpub = keyutils.fromJwkTo('der', key.publicKey.key, 'public', {compact: true});
      const derpri = keyutils.fromJwkTo('der', key.privateKey.key, 'private', {compact: true});

      const jwkpub = keyutils.toJwkFrom('der', derpub, 'public');
      const jwkpri = keyutils.toJwkFrom('der', derpri, 'private');
      delete key.publicKey.key.ext;
      delete key.privateKey.key.ext;
      delete key.publicKey.key.alg;
      delete key.privateKey.key.alg;
      delete key.publicKey.key.key_ops;
      delete key.privateKey.key.key_ops;
      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
    });
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to uncompressed-octet formed key and vice varsa', async () => {
    const array = ECKeySet.map( (key) => {
      const namedCurve = key.publicKey.key.crv;
      const octpub = keyutils.fromJwkTo('oct', key.publicKey.key, 'public', {format: 'string', compact: false});
      const octpri = keyutils.fromJwkTo('oct', key.privateKey.key, 'private', {format: 'string', compact: false});
      // console.log(octpub);
      // console.log(octpri);
      const jwkpub = keyutils.toJwkFrom('oct', octpub, 'public', {format: 'string', namedCurve });
      const jwkpri = keyutils.toJwkFrom('oct', octpri, 'private', {format: 'string', namedCurve });
      delete key.publicKey.key.ext;
      delete key.privateKey.key.ext;
      delete key.publicKey.key.alg;
      delete key.privateKey.key.alg;
      delete key.publicKey.key.key_ops;
      delete key.privateKey.key.key_ops;
      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
    });
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to compact-octet formed key and vice varsa', async () => {
    const array = ECKeySet.map( (key) => {
      const namedCurve = key.publicKey.key.crv;
      const octpub = keyutils.fromJwkTo('oct', key.publicKey.key, 'public', {format: 'string', compact: true});
      const octpri = keyutils.fromJwkTo('oct', key.privateKey.key, 'private', {format: 'string', compact: true});
      // console.log(octpub);
      // console.log(octpri);
      const jwkpub = keyutils.toJwkFrom('oct', octpub, 'public', {format: 'string', namedCurve });
      const jwkpri = keyutils.toJwkFrom('oct', octpri, 'private', {format: 'string', namedCurve });
      delete key.publicKey.key.ext;
      delete key.privateKey.key.ext;
      delete key.publicKey.key.alg;
      delete key.privateKey.key.alg;
      delete key.publicKey.key.key_ops;
      delete key.privateKey.key.key_ops;
      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
    });
    console.log(array);
    expect(array.every( (elem) => elem)).to.be.true;
  });

});