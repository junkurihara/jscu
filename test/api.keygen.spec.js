import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const jscu = env.library;
const envName = env.envName;

async function ecKeyPairAssert(kp){
  expect(kp.publicKey instanceof jscu.Key).to.be.true;
  expect(kp.privateKey instanceof jscu.Key).to.be.true;

  const publicJwk = await kp.publicKey.export('jwk');
  const privateJwk = await kp.privateKey.export('jwk');

  expect(privateJwk.x).to.be.a('string');
  expect(privateJwk.y).to.be.a('string');
  expect(privateJwk.d).to.be.a('string');
  expect(publicJwk.x).equal(privateJwk.x);
  expect(publicJwk.y).equal(privateJwk.y);
}

async function rsaKeyPairAssert(kp){
  expect(kp.publicKey instanceof jscu.Key).to.be.true;
  expect(kp.privateKey instanceof jscu.Key).to.be.true;

  const publicJwk = await kp.publicKey.export('jwk');
  const privateJwk = await kp.privateKey.export('jwk');

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

  const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
  it('ECDSA Key Generation should be done successfully', async () => {
    await Promise.all(curves.map( async (crv) => {
      const kp = await jscu.pkc.generateKey('EC', {namedCurve: crv});
      await ecKeyPairAssert(kp);
    }));
  });

  it('ECDSA Key Generation should be done unsuccessfully', async () => {
    const crv = '256'; // unsupported // K-256 is supported sometimes.
    let err;
    try {
      const kp = await jscu.pkc.generateKey('EC', {namedCurve: crv});
      await ecKeyPairAssert(kp);
    } catch (e) { err = e; }
    expect(err).to.be.a('error');
  });

  it('RSA Key Generation should be done successfully', async () => {
    let result = true;
    await Promise.all([2048, 4096].map( async (nLen) => {
      const kp = await jscu.pkc.generateKey('RSA', {modulusLength: nLen});
      await rsaKeyPairAssert(kp);
    })).catch( () => { result = false; });
    // console.log(keys);
    expect(result).to.be.true;
  });
});