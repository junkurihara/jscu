import {getTestEnv} from './prepare';
const env = getTestEnv();
const aes = env.library;
const envName = env.envName;

import jseu from 'js-encoding-utils';

// from https://tools.ietf.org/html/rfc3394
const testVectors = [
  // 16bytes
  { kek: '000102030405060708090A0B0C0D0E0F',
    cek: '00112233445566778899AABBCCDDEEFF',
    output: '1FA68B0A8112B447AEF34BD8FB5A7B829D3E862371D2CFE5' },
  { kek: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    cek: '00112233445566778899AABBCCDDEEFF',
    output: '64E8C3F9CE0F5BA263E9777905818A2A93C8191E7D6E8AE7' },
  // 32 bytes
  { kek: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    cek: '00112233445566778899AABBCCDDEEFF000102030405060708090A0B0C0D0E0F',
    output: '28C9F404C4B810F4CBCCB35CFB87F8263F5786E2D80ED326CBC7F0E71A99F43BFB988B9B7A02DD21'}
];


describe(`${envName}: Wrap and Unwrap with AES-KW Test`, () => {
  beforeAll( async () => {
  });

  it('Encrypt and decrypt with AES-KW succeeds correctly with default iv', async () => {
    await Promise.all(testVectors.map( async (testVec) => {
      const kEK = jseu.encoder.hexStringToArrayBuffer(testVec.kek);
      const cEK = jseu.encoder.hexStringToArrayBuffer(testVec.cek);

      const x = await aes.wrapKey(cEK, kEK, {name: 'AES-KW'});
      expect(jseu.encoder.arrayBufferToHexString(x).toUpperCase()).toBe(testVec.output);

      const y = await aes.unwrapKey(x, kEK, {name: 'AES-KW'});
      expect(jseu.encoder.arrayBufferToHexString(y).toUpperCase()).toBe(testVec.cek);
    }));

  },5000);

});
