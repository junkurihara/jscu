import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const Key = env.library.Key;
const envName = env.envName;

import jseu from 'js-encoding-utils';
import {pruneLeadingZeros, appendLeadingZeros} from '../src/util.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

function objectSort(obj){
  const keys = Object.keys(obj).sort();
  const map = {};
  keys.forEach((key) => { map[key] = obj[key]; });
  return map;
}

describe(`${envName}: RSA Key pruning leading zeros and appending leading zeros`, () => {

  const badRSA = {
    'kty': 'RSA',
    'e': 'AAEAAQ', // 00 01 00 01
    'n': 'qLOyhK-OtQs4cDSoYPFGxJGfMYdjzWxVmMiuSBGh4KvEx-CwgtaTpef87Wdc9GaFEncsDLxkp0LGxjD1M8jMcvYq6DPEC_JYQumEu3i9v5fAEH1VvbZi9cTg-rmEXLUUjvc5LdOq_5OuHmtme7PUJHYW1PW6ENTP0ibeiNOfFvs'
  };
  before(async() => {
  });

  it('Bad RSA JWK', async function () {
    this.timeout(4000);
    const key = new Key('jwk', badRSA);
    const der = await key.export('der');
    const newKey = new Key('der', der);
    const newJwk = await newKey.export('jwk');
    expect(newJwk.e === 'AQAB').to.be.true;

  });

  it('util test', async () => {
    const leading = jseu.encoder.decodeBase64Url('AAEAAQ');
    const nonleading = jseu.encoder.decodeBase64Url('AQAB');

    expect(pruneLeadingZeros(leading).toString() === nonleading.toString()).to.be.true;
    expect(appendLeadingZeros(nonleading, leading.length).toString() === leading.toString()).to.be.true;

    const msg = new Uint8Array(256);
    const offset = 17;
    msg.forEach( (x, idx) => { msg[idx] = (offset > idx) ? 0x00 : 0xFF & idx; });

    const b64uLeading = jseu.encoder.encodeBase64Url(msg);
    const binLeading = jseu.encoder.decodeBase64Url(b64uLeading);
    const b64uNonLeading = jseu.encoder.encodeBase64Url(msg.slice(offset));
    const binNonLeading = jseu.encoder.decodeBase64Url(b64uNonLeading);

    expect(pruneLeadingZeros(binLeading).toString() === binNonLeading.toString()).to.be.true;

    expect(appendLeadingZeros(binNonLeading, binLeading.length).toString() === binLeading.toString()).to.be.true;


  });

});