import {getTestEnv} from './prepare';
const env = getTestEnv();
const elliptic = env.library;
const envName = env.envName;

import {JsonWebKeyPair, CurveTypes} from '../src/typedef';

describe(`${envName}: Elliptic curve cryptography test`, () => {

  const curves: Array<CurveTypes> = ['P-256', 'P-384', 'P-521', 'P-256K'];
  const keys: Array<JsonWebKeyPair> = [];
  const msgLen = 128;
  const msg = new Uint8Array(msgLen);
  beforeAll( async () => {
    for(let i = 0; i < msgLen; i++) msg[i] = 0xFF & i;
  });

  it('JWK key pair is correctly generated', async () => {
    const results = await Promise.all(curves.map( async (crv) => {
      let result = true;
      const key: JsonWebKeyPair = await elliptic.generateKey(crv).catch( () => {result = false; throw new Error('omg!');});
      keys.push(key);
      // console.log(key);
      return result;
    }));
    console.log(results);
    console.log(keys);
    expect(results.every( (r) => r)).toBeTruthy();
  },5000);

  it('Message is successfully signed and verified with generated JWK pairs', async () => {
    const results = await Promise.all(keys.map( async (kp: JsonWebKeyPair) => {
      let result = true;
      const sign = await elliptic.sign(msg, kp.privateKey, 'SHA-256').catch( () => {result = false;});
      //console.log(sign);
      const valid = await elliptic.verify(msg, <Uint8Array>sign, kp.publicKey, 'SHA-256').catch( () => {result = false;});
      expect(result).toBeTruthy();

      return valid;
    }));
    console.log(results);
    expect(results.every( (r) => r)).toBeTruthy();
  },5000);

  it('Shared secret is correctly computed at each side', async () => {
    const results = await Promise.all(keys.map( async (kp: JsonWebKeyPair) => {
      let result = true;
      const newKey = await elliptic.generateKey(<CurveTypes>kp.privateKey.crv).catch( () => {result = false;});
      const shared1: Uint8Array = await elliptic.deriveSecret(kp.publicKey, (<JsonWebKeyPair>newKey).privateKey).catch( () => {result = false; return new Uint8Array([]);});
      const shared2: Uint8Array = await elliptic.deriveSecret((<JsonWebKeyPair>newKey).publicKey, kp.privateKey).catch( () => {result = false;  return new Uint8Array([]);});
      expect(result).toBeTruthy();

      return (shared1.toString() === shared2.toString());
    }));
    console.log(results);
    expect(results.every( (r) => r)).toBeTruthy();
  },10000);

  it('Message is successfully signed and verified with generated JWK pairs with DER signature', async () => {
    const results = await Promise.all(keys.map( async (kp) => {
      let result = true;
      const sign = await elliptic.sign(msg, kp.privateKey, 'SHA-256', 'der').catch( () => {result = false;});
      //console.log(sign);
      const valid = await elliptic.verify(msg, <Uint8Array>sign, kp.publicKey, 'SHA-256', 'der').catch( () => {result = false;});
      expect(result).toBeTruthy();

      return valid;
    }));
    console.log(results);
    expect(results.every( (r) => r)).toBeTruthy();
  },5000);

});
