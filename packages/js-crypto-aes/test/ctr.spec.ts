import {getTestEnv} from './prepare';
const env = getTestEnv();
const aes = env.library;
const envName = env.envName;

import jseu from 'js-encoding-utils';

// https://tools.ietf.org/html/rfc3686
const testVectors = [
  { key: 'AE6852F8121067CC4BF7A5765577F39E',
    iv: '000000300000000000000000',
    data: '53696E676C6520626C6F636B206D7367',
    output: 'E4095D4FB7A7B3792D6175A3261311B8' },
  { key: '7E24067817FAE0D743D6CE1F32539163',
    iv: '006CB6DBC0543B59DA48D90B',
    data: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    output: '5104A106168A72D9790D41EE8EDAD388EB2E1EFC46DA57C8FCE630DF9141BE28'},
  { key: 'F6D66D6BD52D59BB0796365879EFF886C66DD51A5B6A99744B50590C87A23884',
    iv: '00FAAC24C1585EF15A43D875',
    data: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    output: 'F05E231B3894612C49EE000B804EB2A9B8306B508F839D6A5530831D9344AF1C' },
];

describe(`${envName}: Encryption and Decryption with AES-CTR Test`, () => {
  beforeAll( async () => {
  });

  it('Encrypt and decrypt with AES-CTR succeeds correctly', async () => {
    await Promise.all(testVectors.map( async (testVec) => {

      const key = jseu.encoder.hexStringToArrayBuffer(testVec.key);
      const data = jseu.encoder.hexStringToArrayBuffer(testVec.data);
      const iv = jseu.encoder.hexStringToArrayBuffer(testVec.iv);
      const encrypted = await aes.encrypt(data, key, {name: 'AES-CTR', iv});
      expect(jseu.encoder.arrayBufferToHexString(encrypted).toUpperCase()).toBe(testVec.output);
      const decrypted = await aes.decrypt(encrypted, key, {name: 'AES-CTR', iv});
      expect(jseu.encoder.arrayBufferToHexString(decrypted).toUpperCase()).toBe(testVec.data);
    }));
  }, 5000);


});
