import {getTestEnv} from './prepare';
import {CurveTypes, HashTypes, ModulusLength} from '../src/typedef';
const env = getTestEnv();
const jscu = env.library;
const envName = env.envName;

describe(`${envName}: Signing and verification test via exported api`, () => {
  const curves: Array<CurveTypes> = ['P-256', 'P-384', 'P-521', 'P-256K'];
  const hashes: Array<HashTypes> = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let ecKeySet: Array<any> = [];
  let rsaKeySet: Array<any> = [];
  let msg: Uint8Array;
  beforeAll( async () => {
    ecKeySet = await Promise.all(curves.map( async (crv) => await jscu.pkc.generateKey('EC', {namedCurve: crv})));
    const mods: Array<ModulusLength> = [2048, 4096];
    rsaKeySet = await Promise.all(mods.map( async (nLen) => await jscu.pkc.generateKey('RSA', {modulusLength: nLen})));
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  },20000);



  it('ECDSA Signing and verification should be done successfully', async () => {
    for (let i = 0; i < curves.length; i++){
      for (let j = 0; j < hashes.length; j++){
        const sig = await jscu.pkc.sign(msg, ecKeySet[i].privateKey, hashes[j]);
        const result = await jscu.pkc.verify(msg, sig, ecKeySet[i].publicKey, hashes[j]);
        expect(result).toBeTruthy();
      }
    }
  });

  it('RSA-PSS Signing and verification should be done successfully', async () => {
    const array = await Promise.all(
      rsaKeySet.map( async (kp) => {
        let result = true;
        for(let i = 0; i < hashes.length; i++) {
          const sig = await jscu.pkc.sign(msg, kp.privateKey, hashes[i], {name: 'RSA-PSS', saltLength: 32});
          const valid = await jscu.pkc.verify(msg, sig, kp.publicKey, hashes[i], {name: 'RSA-PSS', saltLength: 32});
          result = valid && result;
        }
        return result;
      }));
    expect(array.every( (r) => r)).toBeTruthy();
  });

  it('RSASSA-PKCS1-v1_5 Signing and verification should be done successfully', async () => {
    const array = await Promise.all(
      rsaKeySet.map( async (kp) => {
        let result = true;
        for(let i = 0; i < hashes.length; i++) {
          const sig = await jscu.pkc.sign(msg, kp.privateKey, hashes[i], {name: 'RSASSA-PKCS1-v1_5'});
          const valid = await jscu.pkc.verify(msg, sig, kp.publicKey, hashes[i], {name: 'RSASSA-PKCS1-v1_5'});
          result = valid && result;
        }
        return result;
      }));
    expect(array.every( (r) => r)).toBeTruthy();
  });

});
