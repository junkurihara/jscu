import keyutils from '../src/index.js';
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
describe('Key conversion from JWK test.', () => {

  const getKeyParam = (elem) => ({keyType: 'EC', namedCurve: elem});
  let ECKeySet = [];
  before(async () => {
    ECKeySet = await Promise.all(curves.map(async (crv) => {
      const param = getKeyParam(crv);
      return await jscu.crypto.generateKeyPair(param);
    }));
  });

  it('JWK EC should be successfully converted to PEM and re-converted to JWK correctly', async () => {
    let result = true;
    let array;
    try {
      array = ECKeySet.map( (key) => {
        const pempub = keyutils.fromJwkTo(key.publicKey.key, 'public', {encode: 'asn', format: 'pem', compact: false});
        const pempri = keyutils.fromJwkTo(key.privateKey.key, 'private', {encode: 'asn', format: 'pem', compact: false});
        console.log(pempub);
        console.log(pempri);
        const jwkpub = keyutils.toJwkFrom(pempub, 'public', {encode: 'asn', format: 'pem'});
        const jwkpri = keyutils.toJwkFrom(pempri, 'private', {encode: 'asn', format: 'pem'});
        delete key.publicKey.key.ext;
        delete key.privateKey.key.ext;
        delete key.publicKey.key.alg;
        delete key.privateKey.key.alg;
        delete key.publicKey.key.key_ops;
        delete key.privateKey.key.key_ops;
        return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
      });
    }catch(e){result = false; console.error(e);}
    expect(result).to.be.true;
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to PEM and re-converted to JWK correctly with public key compact form', async () => {
    let result = true;
    let array;
    try {
      array = ECKeySet.map( (key) => {
        const pempub = keyutils.fromJwkTo(key.publicKey.key, 'public', {encode: 'asn', format: 'pem', compact: true});
        const pempri = keyutils.fromJwkTo(key.privateKey.key, 'private', {encode: 'asn', format: 'pem', compact: true});
        console.log(pempub);
        console.log(pempri);
        const jwkpub = keyutils.toJwkFrom(pempub, 'public', {encode: 'asn', format: 'pem'});
        const jwkpri = keyutils.toJwkFrom(pempri, 'private', {encode: 'asn', format: 'pem'});
        delete key.publicKey.key.ext;
        delete key.privateKey.key.ext;
        delete key.publicKey.key.alg;
        delete key.privateKey.key.alg;
        delete key.publicKey.key.key_ops;
        delete key.privateKey.key.key_ops;
        return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
      });
    }catch(e){result = false; console.error(e);}
    expect(result).to.be.true;
    expect(array.every( (elem) => elem)).to.be.true;
  });


  it('JWK EC should be successfully converted to DER and re-converted to JWK correctly', async () => {
    let result = true;
    let array;
    try {
      array = ECKeySet.map( (key) => {
        const derpub = keyutils.fromJwkTo(key.publicKey.key, 'public', {encode: 'asn', format: 'der', compact: false});
        const derpri = keyutils.fromJwkTo(key.privateKey.key, 'private', {encode: 'asn', format: 'der', compact: false});

        const jwkpub = keyutils.toJwkFrom(derpub, 'public', {encode: 'asn', format: 'der'});
        const jwkpri = keyutils.toJwkFrom(derpri, 'private', {encode: 'asn', format: 'der'});
        delete key.publicKey.key.ext;
        delete key.privateKey.key.ext;
        delete key.publicKey.key.alg;
        delete key.privateKey.key.alg;
        delete key.publicKey.key.key_ops;
        delete key.privateKey.key.key_ops;
        return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
      });
    }catch(e){result = false; console.error(e);}
    expect(result).to.be.true;
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to DER and re-converted to JWK correctly with public key compact form', async () => {
    let result = true;
    let array;
    try {
      array = ECKeySet.map( (key) => {
        const derpub = keyutils.fromJwkTo(key.publicKey.key, 'public', {encode: 'asn', format: 'der', compact: true});
        const derpri = keyutils.fromJwkTo(key.privateKey.key, 'private', {encode: 'asn', format: 'der', compact: true});

        const jwkpub = keyutils.toJwkFrom(derpub, 'public', {encode: 'asn', format: 'der'});
        const jwkpri = keyutils.toJwkFrom(derpri, 'private', {encode: 'asn', format: 'der'});
        delete key.publicKey.key.ext;
        delete key.privateKey.key.ext;
        delete key.publicKey.key.alg;
        delete key.privateKey.key.alg;
        delete key.publicKey.key.key_ops;
        delete key.privateKey.key.key_ops;
        return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
      });
    }catch(e){result = false; console.error(e);}
    expect(result).to.be.true;
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to uncompressed-octet formed key and vice varsa', async () => {
    let result = true;
    let array;
    try {
      array = ECKeySet.map( (key) => {
        const namedCurve = key.publicKey.key.crv;
        const octpub = keyutils.fromJwkTo(key.publicKey.key, 'public', {encode: 'oct', format: 'string', compact: false});
        const octpri = keyutils.fromJwkTo(key.privateKey.key, 'private', {encode: 'oct', format: 'string', compact: false});
        console.log(octpub);
        console.log(octpri);
        const jwkpub = keyutils.toJwkFrom(octpub, 'public', {encode: 'oct', format: 'string', namedCurve });
        const jwkpri = keyutils.toJwkFrom(octpri, 'private', {encode: 'oct', format: 'string', namedCurve });
        delete key.publicKey.key.ext;
        delete key.privateKey.key.ext;
        delete key.publicKey.key.alg;
        delete key.privateKey.key.alg;
        delete key.publicKey.key.key_ops;
        delete key.privateKey.key.key_ops;
        return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
      });
    }catch(e){result = false; console.error(e);}
    expect(result).to.be.true;
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('JWK EC should be successfully converted to compact-octet formed key and vice varsa', async () => {
    let result = true;
    let array;
    try {
      array = ECKeySet.map( (key) => {
        const namedCurve = key.publicKey.key.crv;
        const octpub = keyutils.fromJwkTo(key.publicKey.key, 'public', {encode: 'oct', format: 'string', compact: true});
        const octpri = keyutils.fromJwkTo(key.privateKey.key, 'private', {encode: 'oct', format: 'string', compact: true});
        console.log(octpub);
        console.log(octpri);
        const jwkpub = keyutils.toJwkFrom(octpub, 'public', {encode: 'oct', format: 'string', namedCurve });
        const jwkpri = keyutils.toJwkFrom(octpri, 'private', {encode: 'oct', format: 'string', namedCurve });
        delete key.publicKey.key.ext;
        delete key.privateKey.key.ext;
        delete key.publicKey.key.alg;
        delete key.privateKey.key.alg;
        delete key.publicKey.key.key_ops;
        delete key.privateKey.key.key_ops;
        return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey.key)))
          && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey.key)));
      });
    }catch(e){result = false; console.error(e);}
    expect(result).to.be.true;
    expect(array.every( (elem) => elem)).to.be.true;
  });
});