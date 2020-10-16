import {getTestEnv} from './prepare';
const env = getTestEnv();
const Key = env.library.Key;
const envName = env.envName;


import sampleRSA from './sampleRsa';
import sampleEC from './sampleEc';
import jseu from 'js-encoding-utils';

const objectSort = (obj: any) => {
  const keys = Object.keys(obj).sort();
  const map: {[index: string]: any} = {};
  keys.forEach((key) => { map[key] = obj[key]; });
  return map;
};

const bits = ['2048', '4096'];
// const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
describe(`${envName}: RSA/EC Key conversion from/to JWK test.`, () => {

  let ECKeySet: any[] = [];
  beforeAll(async () => {
    ECKeySet = sampleEC.ecKey;//await Promise.all(curves.map(async (crv) => await ec.generateKey(crv)));
  }, 20000);

  it('EC: Derive public key to private key', async () => {
    const array = await Promise.all(ECKeySet.map( async (key) => {
      const keyObj = new Key('jwk', key.privateKey);
      expect(keyObj.isPrivate).toBeTruthy();

      const pubpemCompact = await keyObj.export('pem', {compact: true, outputPublic: true});  // export public from private
      const koc = new Key('pem', pubpemCompact);
      expect(koc.isPrivate).toBeFalsy();
      const kocjwk = await koc.export('jwk');

      const pubpem = await keyObj.export('pem', {compact: false, outputPublic: true});  // export public from private
      const ko = new Key('pem', pubpem);
      expect(ko.isPrivate).toBeFalsy();
      const kojwk = await ko.export('jwk');

      expect(
        JSON.stringify(objectSort(kocjwk)) === JSON.stringify(objectSort(key.publicKey))
        && JSON.stringify(objectSort(kojwk)) === JSON.stringify(objectSort(key.publicKey))
      ).toBeTruthy();

      const octpemCompact = await keyObj.export('oct', {compact: true, output:'string', outputPublic: true});
      const ooc = new Key('oct', jseu.encoder.hexStringToArrayBuffer(<string>octpemCompact), {namedCurve: key.publicKey.crv});
      // console.log(getKeyStatus(ooc));
      expect(ooc.isPrivate).toBeFalsy();
      const oocjwk = await ooc.export('jwk');


      const octpem = await keyObj.export('oct', {compact: false, output:'string', outputPublic: true}); // export public from private
      const oo = new Key('oct', jseu.encoder.hexStringToArrayBuffer(<string>octpem), {namedCurve: key.publicKey.crv});
      expect(oo.isPrivate).toBeFalsy();
      const oojwk = await oo.export('jwk');

      expect(
        JSON.stringify(objectSort(oocjwk)) === JSON.stringify(objectSort(key.publicKey))
        && JSON.stringify(objectSort(oojwk)) === JSON.stringify(objectSort(key.publicKey))
      ).toBeTruthy();


    }));
    console.log(array);
    // expect(array.every( (elem) => elem)).toBeTruthy();
  }, 4000);


  it('Status Change Test', async () => {
    const array = await Promise.all(bits.map( async (bitLen) => {
      const key = new Key('pem', sampleRSA[bitLen].privateKey.pem);
      let status = getKeyStatus(key);
      expect(
        !status.isEncrypted
        && status.octLength === 0 && !status.status.oct
        && status.derLength > 0 && status.status.der
        && status.jwkKeyLength === 0 && !status.status.jwk
      ).toBeTruthy();

      const jwk = await key.export('jwk');
      console.log(jwk);
      status = getKeyStatus(key);
      expect(
        !status.isEncrypted
        && status.octLength === 0 && !status.status.oct
        && status.derLength > 0 && status.status.der
        && status.jwkKeyLength === 9 && status.status.jwk
      ).toBeTruthy();

      await key.encrypt('password');
      status = getKeyStatus(key);
      expect(
        status.isEncrypted
        && status.octLength === 0 && !status.status.oct
        && status.derLength > 0 && status.status.der
        && status.jwkKeyLength === 0 && !status.status.jwk
      ).toBeTruthy();
      // console.log(status);

      const asis = await key.export('pem');
      console.log(asis);

      await key.decrypt('password');
      status = getKeyStatus(key);
      expect(
        !status.isEncrypted
        && status.octLength === 0 && !status.status.oct
        && status.derLength === 0 && !status.status.der
        && status.jwkKeyLength === 9 && status.status.jwk
      ).toBeTruthy();
      // console.log(status);

      // console.log(await key.getJwkThumbprint('SHA-256', 'hex'));


    }));
    console.log(array);
    // expect( array.every( (a) => a)).toBeTruthy();
  });

  it('Misc', async () => {
    const array = await Promise.all(ECKeySet.map( async (key) => {
      const keyObj = new Key('jwk', key.privateKey);
      const kty = await keyObj.keyType;
      expect(kty === 'EC').toBeTruthy();

      console.log(jseu.encoder.arrayBufferToHexString(<Uint8Array>(await keyObj.jwkThumbprint)));
    }));
    console.log(array);
  });

});

const getKeyStatus = (k: any) => ({
  type: k._type,
  private: k.isPrivate,
  derLength: (k._der) ? k._der.length : 0,
  octLength: (k._oct) ? Object.keys(k._oct).length : 0,
  jwkKeyLength: (k._jwk) ? Object.keys(k._jwk).length : 0,
  status: k._current,
  isEncrypted: k.isEncrypted
});
