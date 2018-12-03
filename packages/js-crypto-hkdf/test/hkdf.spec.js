import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const hkdf = env.library;
const envName = env.envName;


import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


let hashes = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5'];
describe(`${envName}: HKDF test`, () => {
  let masterSecret;
  const length = 144;
  before( async () => {
    masterSecret = new Uint8Array(32);
    for(let i = 0; i < 32; i++) masterSecret[i] = 0xFF & i;
  });

  it('HKDF is done with automatic salt generation', async function () {
    this.timeout(20000);
    if(typeof window !== 'undefined' && typeof window.msCrypto !== 'undefined') hashes = ['SHA-256', 'SHA-384']; // SHA-512 doesn't work in IE
    await Promise.all(hashes.map( async (hash) => {
      const d = await hkdf.compute(masterSecret, hash, length, '', null);
      expect(d.key).to.be.a('Uint8Array');
      expect(d.salt).to.be.a('Uint8Array');
      expect(d.key.byteLength, `failed at ${hash}`).to.be.equal(length);
    }));

  });

  it('When the same salt is given, the same hash is obtained with HKDF', async function () {
    this.timeout(20000);
    if(typeof window !== 'undefined' && typeof window.msCrypto !== 'undefined') hashes = ['SHA-256', 'SHA-384']; // SHA-512 doesn't work in IE
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
    'SHA-512': '77,119,111,188,124,95,226,127,20,170,196,226,159,131,36,202,21,73,204,211,247,102,23,159,105,161,241,64,50,116,222,170,254,66,55,162,60,1,101,29,45,47,15,139,247,111,136,142,99,191,28,155,218,49,174,135,126,218,59,64,167,134,208,165,16,247,6,10,59,62,132,83,23,168,218,212,7,22,213,52,101,9,30,1,228,227,88,185,196,5,50,49,100,24,84,15,58,45,93,90,119,135,41,224,224,53,39,176,107,150,138,99,113,161,111,145,83,241,68,46,151,134,169,76,254,20,58,160,91,177,62,71,12,106,54,35,116,101,34,115,23,103,199,33',
    'SHA-1': '231,154,101,85,67,166,227,46,107,169,115,168,122,162,93,194,10,128,27,249,153,198,172,180,27,209,12,238,163,12,98,163,236,102,63,223,161,210,134,122,189,22,131,17,171,185,178,228,115,0,218,206,137,173,245,206,223,69,72,248,241,58,225,7,23,151,118,82,196,123,65,14,205,160,64,3,225,9,124,178,27,174,18,48,251,3,59,132,162,81,151,191,178,11,202,26,233,214,5,254,87,32,229,112,122,149,27,28,87,252,204,243,161,2,123,48,131,94,121,188,147,143,232,247,105,96,151,230,76,180,214,185,71,188,78,23,251,225,102,131,107,231,158,87',
    'MD5': '34,114,11,173,87,235,112,155,161,97,171,57,143,74,153,140,175,88,254,87,93,61,179,88,60,142,74,41,117,97,62,89,80,168,115,6,130,109,48,166,162,35,217,104,241,208,238,57,121,26,33,71,247,81,97,99,62,96,225,167,118,46,176,104,212,119,127,248,29,0,165,36,183,238,250,171,155,179,152,55,236,224,58,4,1,22,144,146,92,123,240,96,1,46,82,221,253,32,216,171,51,137,130,88,53,209,151,50,204,151,231,90,56,171,97,250,101,225,150,198,242,161,216,91,196,89,103,163,106,120,61,59,26,150,23,226,244,149,161,40,106,90,106,32'
  };

  it('When the fixed salt is given, the mac is always fixed', async function () {
    this.timeout(20000);
    if(typeof window !== 'undefined' && typeof window.msCrypto !== 'undefined') hashes = ['SHA-256', 'SHA-384']; // SHA-512 doesn't work in IE
    await Promise.all(hashes.map( async (hash) => {
      const d = await hkdf.compute(masterSecret, hash, length, '', masterSecret);
      expect(d.key).to.be.a('Uint8Array');
      expect(d.salt).to.be.a('Uint8Array');
      expect(d.key.toString() === fixedMACs[hash]).to.be.true;
    }));
  });
});

