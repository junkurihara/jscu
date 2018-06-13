import elliptic from '../src/crypto/elliptic/index.mjs';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

async function keyAssert(algo){
  const keys = await elliptic.crypto.generateKeyPair(algo);
  expect(keys).to.be.a('object');
  expect(keys.privateKey.key.x, `failed at ${algo.namedCurve}`).to.be.a('string');
  expect(keys.privateKey.key.y, `failed at ${algo.namedCurve}`).to.be.a('string');
  expect(keys.privateKey.key.d, `failed at ${algo.namedCurve}`).to.be.a('string');
  expect(keys.publicKey.key.x, `failed at ${algo.namedCurve}`).equal(keys.privateKey.key.x);
  expect(keys.publicKey.key.y, `failed at ${algo.namedCurve}`).equal(keys.privateKey.key.y);
}

describe('Key generation test in pure js ecdsa', () => {

  const curves = ['P-256', 'P-384', 'P-521'];
  it('ECDSA Key Generation should be done successfully', async () => {
    const algo = { name: 'ECDSA'};
    await Promise.all(
      curves.map( async (elem) => {
        algo.namedCurve = elem;
        await keyAssert(algo);
      })
    );
  });

  it('ECDSA Key Generation should be done unsuccessfully', async () => {
    const algo = { name: 'ECDSA', namedCurve: 'K-256'}; // unsupported
    let err;
    await keyAssert(algo).catch( (e) => { err = e;});
    expect(err).to.be.a('error');
  });
});