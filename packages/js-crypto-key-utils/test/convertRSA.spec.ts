import {getTestEnv} from './prepare';
const env = getTestEnv();
const keyutils = env.library;
const envName = env.envName;

import sampleRSA from './sampleRsa';

import jseu from 'js-encoding-utils';

const objectSort = (obj: any) => {
  const keys = Object.keys(obj).sort();
  const map: {[index: string]: any} = {};
  keys.forEach((key) => { map[key] = obj[key]; });
  return map;
};

const prune = (jwk: JsonWebKey) => {
  delete jwk.ext;
  delete jwk.alg;
  delete jwk.key_ops;
  return jwk;
};



const bits = ['2048', '4096'];
describe(`${envName}: RSA Key conversion from/to JWK test.`, () => {
  beforeAll(async () => {
  });

  it('JWK RSA should be successfully converted from PEM', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {
      // public key
      const publicKey = new keyutils.Key('pem', sampleRSA[bitLen].publicKey.pem);
      const jwkpub = await publicKey.export('jwk');
      // private key
      const privateKey = new keyutils.Key('pem', sampleRSA[bitLen].privateKey.pem);
      const jwkpri = await privateKey.export('jwk');

      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(prune(sampleRSA[bitLen].publicKey.jwk))))
        && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(prune(sampleRSA[bitLen].privateKey.jwk))));
    }));
    console.log(array);
    expect( array.every( (a) => a)).toBeTruthy();
  });

  it('PEM RSA should be successfully converted from JWK', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {
      // public key
      const publicKey = new keyutils.Key('jwk', sampleRSA[bitLen].publicKey.jwk);
      const pempub = await publicKey.export('pem');
      // private key
      const privateKey = new keyutils.Key('jwk', sampleRSA[bitLen].privateKey.jwk);
      const pempri = await privateKey.export('pem');

      return (pempub === sampleRSA[bitLen].publicKey.pem) && (pempri === sampleRSA[bitLen].privateKey.pem);
    }));
    console.log(array);
    expect( array.every( (a) => a)).toBeTruthy();
  });

  it('JWK RSA should be successfully converted from DER', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {
      const derpub = jseu.formatter.pemToBin(sampleRSA[bitLen].publicKey.pem);
      const derpri = jseu.formatter.pemToBin(sampleRSA[bitLen].privateKey.pem);

      // public key
      const publicKey = new keyutils.Key('der', derpub);
      const jwkpub = await publicKey.export('jwk');
      // private key
      const privateKey = new keyutils.Key('der', derpri);
      const jwkpri = await privateKey.export('jwk');

      return (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(prune(sampleRSA[bitLen].publicKey.jwk))))
        && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(prune(sampleRSA[bitLen].privateKey.jwk))));
    }));
    console.log(array);
    expect( array.every( (a) => a)).toBeTruthy();
  });

  it('DER RSA should be successfully converted from JWK', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {
      // public key
      const publicKey = new keyutils.Key('jwk', sampleRSA[bitLen].publicKey.jwk);
      const derpub = await publicKey.export('der');
      // private key
      const privateKey = new keyutils.Key('jwk', sampleRSA[bitLen].privateKey.jwk);
      const derpri = await privateKey.export('der');

      return (derpub.toString() === jseu.formatter.pemToBin(sampleRSA[bitLen].publicKey.pem).toString())
        && (derpri.toString() === jseu.formatter.pemToBin(sampleRSA[bitLen].privateKey.pem).toString());
    }));
    console.log(array);
    expect( array.every( (a) => a)).toBeTruthy();
  });

});
