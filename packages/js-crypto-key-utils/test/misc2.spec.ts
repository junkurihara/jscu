import {getTestEnv} from './prepare';
const env = getTestEnv();
const Key = env.library.Key;
const envName = env.envName;

import jseu from 'js-encoding-utils';
import {pruneLeadingZeros, appendLeadingZeros} from '../src/util';


describe(`${envName}: RSA Key pruning leading zeros and appending leading zeros`, () => {

  const badRSA = {
    'kty': 'RSA',
    'e': 'AAEAAQ', // 00 01 00 01
    'n': 'qLOyhK-OtQs4cDSoYPFGxJGfMYdjzWxVmMiuSBGh4KvEx-CwgtaTpef87Wdc9GaFEncsDLxkp0LGxjD1M8jMcvYq6DPEC_JYQumEu3i9v5fAEH1VvbZi9cTg-rmEXLUUjvc5LdOq_5OuHmtme7PUJHYW1PW6ENTP0ibeiNOfFvs'
  };
  beforeAll(async() => {
  });

  it('Bad RSA JWK', async function () {
    const key = new Key('jwk', badRSA);
    const der = await key.export('der');
    const newKey = new Key('der', der);
    const newJwk = await newKey.export('jwk');
    expect((<JsonWebKey>newJwk).e === 'AQAB').toBeTruthy();

  },4000);

  it('util test', async () => {
    const leading = <Uint8Array>jseu.encoder.decodeBase64Url('AAEAAQ');
    const nonleading = <Uint8Array>jseu.encoder.decodeBase64Url('AQAB');

    expect(pruneLeadingZeros(leading).toString() === nonleading.toString()).toBeTruthy();
    expect(appendLeadingZeros(nonleading, leading.length).toString() === leading.toString()).toBeTruthy();

    const msg = new Uint8Array(256);
    const offset = 17;
    // @ts-ignore
    msg.forEach( (x, idx) => { msg[idx] = (offset > idx) ? 0x00 : 0xFF & idx; });

    const b64uLeading = <string>jseu.encoder.encodeBase64Url(msg);
    const binLeading = <Uint8Array>jseu.encoder.decodeBase64Url(b64uLeading);
    const b64uNonLeading = <string>jseu.encoder.encodeBase64Url(msg.slice(offset));
    const binNonLeading = <Uint8Array>jseu.encoder.decodeBase64Url(b64uNonLeading);

    expect(pruneLeadingZeros(binLeading).toString() === binNonLeading.toString()).toBeTruthy();

    expect(appendLeadingZeros(binNonLeading, binLeading.length).toString() === binLeading.toString()).toBeTruthy();


  });

});
