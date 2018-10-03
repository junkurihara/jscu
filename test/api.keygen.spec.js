import jscu from '../src/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

async function keyAssert(keyParams){
  const keys = await jscu.crypto.generateKeyPair(keyParams);
  expect(keys).to.be.a('object');
  expect(keys.privateKey.key.x, `failed at ${keyParams.namedCurve}`).to.be.a('string');
  expect(keys.privateKey.key.y, `failed at ${keyParams.namedCurve}`).to.be.a('string');
  expect(keys.privateKey.key.d, `failed at ${keyParams.namedCurve}`).to.be.a('string');
  expect(keys.publicKey.key.x, `failed at ${keyParams.namedCurve}`).equal(keys.privateKey.key.x);
  expect(keys.publicKey.key.y, `failed at ${keyParams.namedCurve}`).equal(keys.privateKey.key.y);
}

describe('Key generation test via exported api', () => {

  const getKeyParam = (elem) => ({keyType: 'EC', namedCurve: elem});

  const curves = ['P-256', 'P-384', 'P-521'];
  it('ECDSA Key Generation should be done successfully', async () => {

    await Promise.all(curves.map( async (crv) => {
      const param = getKeyParam(crv);
      await keyAssert(param);
    }));
  });

  it('ECDSA Key Generation should be done unsuccessfully', async () => {
    const curve = 'X-256'; // unsupported // K-256 is supported sometimes.
    let err;
    await keyAssert(getKeyParam(curve)).catch( (e) => { err = e;});
    expect(err).to.be.a('error');
  });
});