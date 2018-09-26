import hkdf from '../src/index.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


const hashes = ['SHA-256', 'SHA-384', 'SHA-512'];
describe('HKDF test', () => {
  let masterSecret;
  const length = 144;
  before( async () => {
    masterSecret = new Uint8Array(32);
    for(let i = 0; i < 32; i++) masterSecret[i] = 0xFF & i;
  });

  it('HKDF is done with automatic salt generation', async function () {
    this.timeout(20000);
    await Promise.all(hashes.map( async (hash) => {
      const d = await hkdf.compute(masterSecret, hash, length, '', null);
      expect(d.key).to.be.a('Uint8Array');
      expect(d.salt).to.be.a('Uint8Array');
      expect(d.key.byteLength, `failed at ${hash}`).to.be.equal(length);
    }));
  });

  it('When the same salt is given, the same hash is obtained with HKDF', async function () {
    this.timeout(20000);
    await Promise.all(hashes.map( async (hash) => {
      const d = await hkdf.compute(masterSecret, hash, length, '', null);
      expect(d.key).to.be.a('Uint8Array');
      expect(d.salt).to.be.a('Uint8Array');
      expect(d.key.byteLength, `failed at ${hash}`).to.be.equal(length);

      const dash = await hkdf.compute(masterSecret, hash, length, '', d.salt);
      expect(dash.key).to.be.a('Uint8Array');
      expect(dash.salt).to.be.a('Uint8Array');
      expect(dash.key.toString() === d.key.toString(), `failed at ${hash}`).to.be.true;
    }));
  });

  const fixedMACs = {
    'SHA-256': '124,145,193,234,149,107,107,61,61,58,9,228,216,212,69,71,240,202,118,194,180,114,113,80,57,24,232,113,213,155,191,166,26,1,94,230,244,185,171,102,20,246,59,203,245,200,17,25,92,22,196,106,168,145,125,94,125,84,101,149,119,146,250,243,152,225,232,129,232,101,106,19,55,157,34,240,146,204,162,5,235,156,31,230,188,36,176,44,67,35,99,135,83,197,177,236,167,63,60,93,47,189,225,162,175,151,241,234,151,223,136,25,249,206,88,208,28,111,166,235,128,33,40,15,90,219,238,153,152,79,97,115,33,89,55,168,181,141,76,237,144,181,57,117',
    'SHA-384': '226,40,99,209,178,247,5,3,166,90,9,57,196,54,29,65,191,119,205,64,47,173,233,116,113,173,210,1,8,30,44,233,142,251,189,192,98,33,183,94,253,87,14,102,50,209,55,67,226,34,229,19,69,88,120,205,147,250,207,6,190,188,129,162,142,51,6,94,198,13,52,245,178,65,101,49,1,35,97,111,92,164,181,162,227,6,13,233,115,237,140,241,0,94,195,189,92,45,79,229,249,176,59,226,25,219,176,12,37,70,220,234,182,3,199,37,63,197,185,145,65,12,133,26,152,177,154,89,5,110,49,205,30,57,50,9,111,119,211,27,189,48,162,248',
    'SHA-512': '77,119,111,188,124,95,226,127,20,170,196,226,159,131,36,202,21,73,204,211,247,102,23,159,105,161,241,64,50,116,222,170,254,66,55,162,60,1,101,29,45,47,15,139,247,111,136,142,99,191,28,155,218,49,174,135,126,218,59,64,167,134,208,165,16,247,6,10,59,62,132,83,23,168,218,212,7,22,213,52,101,9,30,1,228,227,88,185,196,5,50,49,100,24,84,15,58,45,93,90,119,135,41,224,224,53,39,176,107,150,138,99,113,161,111,145,83,241,68,46,151,134,169,76,254,20,58,160,91,177,62,71,12,106,54,35,116,101,34,115,23,103,199,33'};

  it('When the fixed salt is given, the mac is always fixed', async function () {
    this.timeout(20000);
    await Promise.all(hashes.map( async (hash) => {
      const d = await hkdf.compute(masterSecret, hash, length, '', masterSecret);
      expect(d.key).to.be.a('Uint8Array');
      expect(d.salt).to.be.a('Uint8Array');
      expect(d.key.toString() === fixedMACs[hash]).to.be.true;
    }));
  });
});

