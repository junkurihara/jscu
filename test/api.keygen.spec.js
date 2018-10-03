import jscu from '../src/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

async function keyAssert(crv){
  const keys = await jscu.pkc.generateKey('EC', {namedCurve: crv});
  expect(keys).to.be.a('object');
  expect(keys.privateKey.x, `failed at ${crv}`).to.be.a('string');
  expect(keys.privateKey.y, `failed at ${crv}`).to.be.a('string');
  expect(keys.privateKey.d, `failed at ${crv}`).to.be.a('string');
  expect(keys.publicKey.x, `failed at ${crv}`).equal(keys.privateKey.x);
  expect(keys.publicKey.y, `failed at ${crv}`).equal(keys.privateKey.y);
}

describe('Key generation test via exported api', () => {


  const curves = ['P-256', 'P-384', 'P-521', 'P-256K'];
  it('ECDSA Key Generation should be done successfully', async () => {

    await Promise.all(curves.map( async (crv) => {
      await keyAssert(crv);
    }));
  });

  it('ECDSA Key Generation should be done unsuccessfully', async () => {
    const curve = '256'; // unsupported // K-256 is supported sometimes.
    let err;
    await keyAssert(curve).catch( (e) => { err = e; });
    expect(err).to.be.a('error');
  });
});