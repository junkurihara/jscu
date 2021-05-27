import {getTestEnv} from './prepare';
import {CurveTypes, HashTypes, ModulusLength, PKCCiphertextObject} from '../src/typedef';
const env = getTestEnv();
const jscu = env.library;
const envName = env.envName;


describe(`${envName}: Encryption test`, () => {
  const curves: Array<CurveTypes> = ['P-256', 'P-384', 'P-521'];
  const mods: Array<ModulusLength> = [2048, 4096];
  const hashes: Array<HashTypes> = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let ecKeySet: Array<any> = [];
  let rsaKeySet: Array<any> = [];
  let msg: Uint8Array;
  beforeAll( async () => {
    ecKeySet = await Promise.all(curves.map( async (crv) => [ await jscu.pkc.generateKey('EC', {namedCurve: crv}), await jscu.pkc.generateKey('EC', {namedCurve: crv})]));
    rsaKeySet = await Promise.all(mods.map( async (nLen) => await jscu.pkc.generateKey('RSA', {modulusLength: nLen})));
    msg = new Uint8Array(32);
    for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  },20000);

  it('ECDH: Encrypted message is successfully generated and decrypted with AES-GCM', async () => {
    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < hashes.length; j++) {
        const encryptionOptions = {
          privateKey: ecKeySet[i][1].privateKey,
          hash: hashes[j],
          encrypt: 'AES-GCM',
          keyLength: 32,
          info: ''
        };
        const encrypted = await jscu.pkc.encrypt(msg, ecKeySet[i][0].publicKey, encryptionOptions);

        const decryptionOptions = {
          publicKey: ecKeySet[i][1].publicKey,
          hash: hashes[j],
          encrypt: 'AES-GCM',
          keyLength: 32,
          info: '',
          salt: encrypted.salt,
          iv: encrypted.iv
        };
        const decrypted = await jscu.pkc.decrypt(encrypted.data, ecKeySet[i][0].privateKey, decryptionOptions);

        expect(msg.toString() === decrypted.toString()).toBeTruthy();
      }
    }
  });

  it('ECDH: Encrypted content encryption key is successfully generated and decrypted with AES-KW', async () => {
    const keyMsg = jscu.random.getRandomBytes(32);
    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < hashes.length; j++) {
        const encryptionOptions = {
          privateKey: ecKeySet[i][1].privateKey,
          hash: hashes[j],
          encrypt: 'AES-KW',
          keyLength: 32,
          info: ''
        };
        const encrypted = await jscu.pkc.encrypt(keyMsg, ecKeySet[i][0].publicKey, encryptionOptions);

        const decryptionOptions = {
          publicKey: ecKeySet[i][1].publicKey,
          hash: hashes[j],
          encrypt: 'AES-KW',
          keyLength: 32,
          info: '',
          salt: encrypted.salt
        };
        const decrypted = await jscu.pkc.decrypt(encrypted.data, ecKeySet[i][0].privateKey, decryptionOptions);

        expect(keyMsg.toString()).toEqual(decrypted.toString());
      }
    }
  });

  it('RSA-OAEP: Encrypted message is successfully generated and decrypted', async () => {
    const results = await Promise.all(rsaKeySet.map( async (kp) => {
      let result = true;
      const encrypted = await jscu.pkc.encrypt(msg, kp.publicKey, {hash: 'SHA-256'}).catch( (e: any) => {console.error(e); result = false;});
      const decrypted = await jscu.pkc.decrypt((<PKCCiphertextObject>encrypted).data, kp.privateKey, {hash: 'SHA-256'}).catch( (e: any) => {result = false; console.error(e);});

      expect(result).toBeTruthy();
      return ((<Uint8Array>decrypted).toString() === msg.toString());
    }));
    expect(results.every( (r) => r)).toBeTruthy();
  });
});

