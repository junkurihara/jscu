import {getTestEnv} from './prepare';
import {CurveTypes, ModulusLength} from '../src/typedef';
import * as chai from 'chai';
// const should = chai.should();
const expect = chai.expect;
const env = getTestEnv();
const jscu = env.library;
const envName = env.envName;

async function ecKeyPairAssert(publicJwk: JsonWebKey, privateJwk: JsonWebKey){
  expect(privateJwk.x).to.be.a('string');
  expect(privateJwk.y).to.be.a('string');
  expect(privateJwk.d).to.be.a('string');
  expect(publicJwk.x).equal(privateJwk.x);
  expect(publicJwk.y).equal(privateJwk.y);
}

async function rsaKeyPairAssert(publicJwk: JsonWebKey, privateJwk: JsonWebKey){
  expect(privateJwk.n).to.be.a('string');
  expect(privateJwk.e).to.be.a('string');
  expect(privateJwk.d).to.be.a('string');
  expect(privateJwk.p).to.be.a('string');
  expect(privateJwk.q).to.be.a('string');
  expect(privateJwk.dp).to.be.a('string');
  expect(privateJwk.dq).to.be.a('string');
  expect(privateJwk.qi).to.be.a('string');
  expect(publicJwk.n).equal(privateJwk.n);
  expect(publicJwk.e).equal(privateJwk.e);
}

describe(`${envName}: Key generation test via exported api`, () => {

  const curves: Array<CurveTypes> = ['P-256', 'P-384', 'P-521', 'P-256K'];
  it('ECDSA Key Generation should be done successfully', async function () {
    this.timeout(10000);
    await Promise.all(curves.map( async (crv: CurveTypes) => {
      const kp = await jscu.pkc.generateKey('EC', {namedCurve: crv});

      expect(kp.publicKey instanceof jscu.Key).to.be.true;
      expect(kp.privateKey instanceof jscu.Key).to.be.true;

      const publicJwk = await kp.publicKey.export('jwk');
      const privateJwk = await kp.privateKey.export('jwk');

      await ecKeyPairAssert(publicJwk, privateJwk);
    }));
  });

  it('RSA Key Generation should be done successfully', async function () {
    this.timeout(10000);
    let result = true;
    const mods: Array<ModulusLength> = [2048, 4096];
    await Promise.all(mods.map( async (nLen) => {
      const kp = await jscu.pkc.generateKey('RSA', {modulusLength: nLen});

      expect(kp.publicKey instanceof jscu.Key).to.be.true;
      expect(kp.privateKey instanceof jscu.Key).to.be.true;

      const publicJwk = await kp.publicKey.export('jwk');
      const privateJwk = await kp.privateKey.export('jwk');
      await rsaKeyPairAssert(publicJwk, privateJwk);
    })).catch( () => { result = false; });
    // console.log(keys);
    expect(result).to.be.true;
  });
});
