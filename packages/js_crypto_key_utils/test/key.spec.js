import {Key} from '../src/key.js';
import sampleRSA from './rsa_sample.js';
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

const bits = ['2048', '4096'];
const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
describe('RSA/EC Key conversion from/to JWK test.', () => {

  let ECKeySet = [];
  before(async function (){
    this.timeout(20000);
    ECKeySet = await Promise.all(curves.map(async (crv) => {
      return await ec.generateKey(crv);
    }));
  });

  it('EC Private Key Test', async function () {
    this.timeout(4000);
    const array = await Promise.all(ECKeySet.map( async (key) => {
      const keyObj = new Key('jwk', key.privateKey);

      const pem = await keyObj.export('pem');
      console.log(await keyObj.export('pem', {compact: true, type: 'public'}));  // export public from private
      // console.log(pem);

      const oct = await keyObj.export('oct', {coutput:'string'});
      console.log(await keyObj.export('oct', {compact: true, output:'string', type: 'public'})); // export public from private
      // console.log(oct);

      const encryptedPem = await keyObj.export('pem', {compact: true, encryptParams: {passphrase: 'password'}});
      // console.log(encryptedPem);

      await keyObj.encrypt('password');
      console.log(getKeyStatus(keyObj).isEncrypted);
      console.log(await keyObj.pem);
      await keyObj.decrypt('password');
      console.log(getKeyStatus(keyObj).isEncrypted);
      console.log(await keyObj.pem);
      console.log(await keyObj.oct);
      console.log(await keyObj.jwk);



      // const pempub = await keyutils.fromJwkTo('pem', key.publicKey, {type: 'public', compact: false});
      // const pempri = await keyutils.fromJwkTo('pem', key.privateKey, {type: 'private', compact: false});
      // // console.log(pempub);
      // // console.log(pempri);
      // const jwkpub = await keyutils.toJwkFrom('pem', pempub, {type: 'public'});
      // const jwkpri = await keyutils.toJwkFrom('pem', pempri, {type: 'private'});
      // delete key.publicKey.ext;
      // delete key.privateKey.ext;
      // delete key.publicKey.alg;
      // delete key.privateKey.alg;
      // delete key.publicKey.key_ops;
      // delete key.privateKey.key_ops;
      // const res =  (JSON.stringify(objectSort(jwkpub)) === JSON.stringify(objectSort(key.publicKey)))
      //   && (JSON.stringify(objectSort(jwkpri)) === JSON.stringify(objectSort(key.privateKey)));
      // if (!res) {
      //   console.log(objectSort(jwkpub));
      //   console.log(objectSort(key.publicKey));
      //   console.log(objectSort(jwkpri));
      //   console.log(objectSort(key.privateKey));
      //   // console.log(pempub);
      //   // console.log(pempri);
      // }
      // return res;
    }));
    // console.log(array);
    // expect(array.every( (elem) => elem)).to.be.true;
  });


  it('RSA Private Key Test', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {
      const key = new Key('pem', sampleRSA[bitLen].privateKey.pem);
      let status = getKeyStatus(key);
      expect(
        !status.isEncrypted
        && status.octLength === 0 && !status.status.oct
        && status.derLength > 0 && status.status.der
        && status.jwkKeyLength === 0 && !status.status.jwk
      ).to.be.true;

      const jwk = await key.export('jwk');
      status = getKeyStatus(key);
      expect(
        !status.isEncrypted
        && status.octLength === 0 && !status.status.oct
        && status.derLength > 0 && status.status.der
        && status.jwkKeyLength === 9 && status.status.jwk
      ).to.be.true;

      await key.encrypt('password');
      status = getKeyStatus(key);
      expect(
        status.isEncrypted
        && status.octLength === 0 && !status.status.oct
        && status.derLength > 0 && status.status.der
        && status.jwkKeyLength === 0 && !status.status.jwk
      ).to.be.true;
      console.log(status);

      const asis = await key.export('pem');
      // console.log(asis);

      await key.decrypt('password');
      status = getKeyStatus(key);
      expect(
        !status.isEncrypted
        && status.octLength === 0 && !status.status.oct
        && status.derLength === 0 && !status.status.der
        && status.jwkKeyLength === 9 && status.status.jwk
      ).to.be.true;
      console.log(status);

      console.log(await key.getJwkThumbprint('SHA-256', 'hex'));


    }));
    // console.log(array);
    // expect( array.every( (a) => a)).to.be.true;
  });

});

const getKeyStatus = (k) => {
  return {
    type: k._type,
    private: k.isPrivate,
    derLength: (k._der) ? k._der.length : 0,
    octLength: (k._oct) ? Object.keys(k._oct).length : 0,
    jwkKeyLength: (k._jwk) ? Object.keys(k._jwk).length : 0,
    status: k._current,
    isEncrypted: k.isEncrypted
  };
};