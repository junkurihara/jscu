import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;
import jseu from 'js-encoding-utils';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const pbkdf = env.library;
const envName = env.envName;

const hashes = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1', 'MD5'];
const sample = {
  pbkdf1: {
    p: 'password',
    pbuf: '70617373776f7264',
    s: 'dc04deff5a33c22df3aa82085f9c2d0f5477af73cd500dfe53162d70ba096a03',
    c: 2048,
    dkLen: 16,
    key: {
      'SHA-256': '2e460082f6002d377042bbfd7c3fcf61',
      'SHA-384': 'bc3d241bd9975babb7bb7fd0c843c9e0',
      'SHA-512': '2b875a1a163ade05f788ba386033c20a',
      'SHA-1': '55ce9e9aa9bf733f193e66620365fe0e',
      'MD5': '9238c6bfe098e5c4e7b68549233cc8ef'
    }
  },
  pbkdf2: {
    p: 'password',
    pbuf: '70617373776f7264',
    s: 'dc04deff5a33c22df3aa82085f9c2d0f5477af73cd500dfe53162d70ba096a03',
    c: 2048,
    dkLen: 32,
    key: {
      'SHA-256': 'bf3d09d429fbf71bbb384a6421447da32096ff8a010c7042d3e29194237792d2',
      'SHA-384': 'f4e9e3377bfdb37695b41d163b67f6a8de017db98ea69bd5163f9d771a141878',
      'SHA-512': 'ff055f4a1f3b9b70de87ecd942c7aed9d1e5b77d5b4d36f92389ead9f6c359bf',
      'SHA-1': 'ca95cba5373ca0b86ad1dd7b31fb51d77f4cdc424c1d9b704620cee505bdc772',
      'MD5': '28ecf8c0c5435581175b094cb7626fff5dca051755dcab43add58cff48abfe8f'
    }
  }
};

describe(`${envName}: Test for PBKDF 1 and 2`, () => {
  before( async () => {
  });

  it('PBKDF2 with password string', async () => {
    const array = await Promise.all( hashes.map( async (h) => {
      const key = await pbkdf.pbkdf2(
        sample.pbkdf2.p,
        jseu.encoder.hexStringToArrayBuffer(sample.pbkdf2.s),
        sample.pbkdf2.c,
        sample.pbkdf2.dkLen,
        h
      );
      return jseu.encoder.arrayBufferToHexString(key) === sample.pbkdf2.key[h];
    }));
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('PBKDF2 with password buffer', async () => {
    const array = await Promise.all( hashes.map( async (h) => {
      const key = await pbkdf.pbkdf2(
        jseu.encoder.hexStringToArrayBuffer(sample.pbkdf2.pbuf),
        jseu.encoder.hexStringToArrayBuffer(sample.pbkdf2.s),
        sample.pbkdf2.c,
        sample.pbkdf2.dkLen,
        h
      );
      return jseu.encoder.arrayBufferToHexString(key) === sample.pbkdf2.key[h];
    }));
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('PBKDF1 with password string', async () => {
    const array = await Promise.all( hashes.map( async (h) => {
      const key = await pbkdf.pbkdf1(
        sample.pbkdf1.p,
        jseu.encoder.hexStringToArrayBuffer(sample.pbkdf1.s),
        sample.pbkdf1.c,
        sample.pbkdf1.dkLen,
        h
      );
      return jseu.encoder.arrayBufferToHexString(key) === sample.pbkdf1.key[h];
    }));
    expect(array.every( (elem) => elem)).to.be.true;
  });

  it('PBKDF1 with password buffer', async () => {
    const array = await Promise.all( hashes.map( async (h) => {
      const key = await pbkdf.pbkdf1(
        jseu.encoder.hexStringToArrayBuffer(sample.pbkdf1.pbuf),
        jseu.encoder.hexStringToArrayBuffer(sample.pbkdf1.s),
        sample.pbkdf1.c,
        sample.pbkdf1.dkLen,
        h
      );
      return jseu.encoder.arrayBufferToHexString(key) === sample.pbkdf1.key[h];
    }));
    expect(array.every( (elem) => elem)).to.be.true;
  });

});

