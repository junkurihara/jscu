import {getTestEnv} from './prepare';
import {CurveTypes, ModulusLength} from '../src/typedef';
const env = getTestEnv();
const jscu = env.library;
const envName = env.envName;

async function ecKeyPairAssert(publicJwk: JsonWebKey, privateJwk: JsonWebKey){
  expect(typeof privateJwk.x).toEqual('string');
  expect(typeof privateJwk.y).toEqual('string');
  expect(typeof privateJwk.d).toEqual('string');
  expect(publicJwk.x).toEqual(privateJwk.x);
  expect(publicJwk.y).toEqual(privateJwk.y);
}

async function rsaKeyPairAssert(publicJwk: JsonWebKey, privateJwk: JsonWebKey){
  expect(typeof privateJwk.n).toEqual('string');
  expect(typeof privateJwk.e).toEqual('string');
  expect(typeof privateJwk.d).toEqual('string');
  expect(typeof privateJwk.p).toEqual('string');
  expect(typeof privateJwk.q).toEqual('string');
  expect(typeof privateJwk.dp).toEqual('string');
  expect(typeof privateJwk.dq).toEqual('string');
  expect(typeof privateJwk.qi).toEqual('string');
  expect(publicJwk.n).toEqual(privateJwk.n);
  expect(publicJwk.e).toEqual(privateJwk.e);
}

describe(`${envName}: Key generation test via exported api`, () => {

  const curves: Array<CurveTypes> = ['P-256', 'P-384', 'P-521', 'P-256K'];
  it('ECDSA Key Generation should be done successfully', async function () {
    await Promise.all(curves.map( async (crv: CurveTypes) => {
      const kp = await jscu.pkc.generateKey('EC', {namedCurve: crv});

      expect(kp.publicKey instanceof jscu.Key).toBeTruthy();
      expect(kp.privateKey instanceof jscu.Key).toBeTruthy();

      const publicJwk = await kp.publicKey.export('jwk');
      const privateJwk = await kp.privateKey.export('jwk');

      await ecKeyPairAssert(publicJwk, privateJwk);
    }));
  },10000);

  it('RSA Key Generation should be done successfully', async function () {
    let result = true;
    const mods: Array<ModulusLength> = [2048, 4096];
    await Promise.all(mods.map( async (nLen) => {
      const kp = await jscu.pkc.generateKey('RSA', {modulusLength: nLen});

      expect(kp.publicKey instanceof jscu.Key).toBeTruthy();
      expect(kp.privateKey instanceof jscu.Key).toBeTruthy();

      const publicJwk = await kp.publicKey.export('jwk');
      const privateJwk = await kp.privateKey.export('jwk');
      await rsaKeyPairAssert(publicJwk, privateJwk);
    })).catch( () => { result = false; });
    // console.log(keys);
    expect(result).toBeTruthy();
  },10000);
});
