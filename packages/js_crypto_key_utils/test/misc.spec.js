import {Key} from '../src/key.js';
import sampleRSA from './rsa_sample.js';
import ec from 'js-crypto-ec/dist/index.js';
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
const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
describe('RSA/EC Key conversion from/to JWK test.', () => {

  let ECKeySet = [];
  before(async function (){
    this.timeout(20000);
    ECKeySet = await Promise.all(curves.map(async (crv) => {
      return await ec.generateKey(crv);
    }));
  });

  it('EC: Derive public key to private key', async function () {
    this.timeout(4000);
    const array = await Promise.all(ECKeySet.map( async (key) => {
      const keyObj = new Key('jwk', key.privateKey);
      expect(keyObj.isPrivate).to.be.true;

      const pubpemCompact = await keyObj.export('pem', {compact: true, outputPublic: true});  // export public from private
      const koc = new Key('pem', pubpemCompact);
      expect(koc.isPrivate).to.be.false;
      const kocjwk = await koc.export('jwk');

      const pubpem = await keyObj.export('pem', {compact: false, outputPublic: true});  // export public from private
      const ko = new Key('pem', pubpem);
      expect(ko.isPrivate).to.be.false;
      const kojwk = await ko.export('jwk');

      expect(
        JSON.stringify(objectSort(kocjwk)) === JSON.stringify(objectSort(key.publicKey))
        && JSON.stringify(objectSort(kojwk)) === JSON.stringify(objectSort(key.publicKey))
      ).to.be.true;

      const octpemCompact = await keyObj.export('oct', {compact: true, output:'string', outputPublic: true});
      const ooc = new Key('oct', jseu.encoder.hexStringToArrayBuffer(octpemCompact), {namedCurve: key.publicKey.crv});
      // console.log(getKeyStatus(ooc));
      expect(ooc.isPrivate).to.be.false;
      const oocjwk = await ooc.export('jwk');


      const octpem = await keyObj.export('oct', {compact: false, output:'string', outputPublic: true}); // export public from private
      const oo = new Key('oct', jseu.encoder.hexStringToArrayBuffer(octpem), {namedCurve: key.publicKey.crv});
      expect(oo.isPrivate).to.be.false;
      const oojwk = await oo.export('jwk');

      expect(
        JSON.stringify(objectSort(oocjwk)) === JSON.stringify(objectSort(key.publicKey))
        && JSON.stringify(objectSort(oojwk)) === JSON.stringify(objectSort(key.publicKey))
      ).to.be.true;


    }));
    // console.log(array);
    // expect(array.every( (elem) => elem)).to.be.true;
  });


  it('Status Change Test', async () => {
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
      // console.log(status);

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
      // console.log(status);

      // console.log(await key.getJwkThumbprint('SHA-256', 'hex'));


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