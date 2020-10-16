import {getTestEnv} from './prepare';
const env = getTestEnv();
const rsa = env.library;
const envName = env.envName;


import rsaSmaple from './rsa_sample';
import * as oaep from '../src/oaep';
import jseu from 'js-encoding-utils';
import {JsonWebKeyPair, ModulusLength} from '../src/typedef';

describe(`${envName}: RSA cryptography test`, () => {

  const modulusLength: Array<ModulusLength> = [2048, 4096];
  const keys: Array<JsonWebKeyPair|null> = [];
  const msgLen = 128;
  const msg = new Uint8Array(msgLen);
  beforeAll( async () => {
    for(let i = 0; i < msgLen; i++) msg[i] = 0xFF & i;
  });

  it('JWK key pair is correctly generated', async () => {
    const results = await Promise.all(modulusLength.map(async (n) => {
      let result = true;
      const key: JsonWebKeyPair|null = await rsa.generateKey(n).catch((e: Error) => {
        console.error(e);
        result = false;
        return null;
      });
      keys.push(key);
      // console.log(key);
      return result;
    }));
    console.log(results);
    console.log(keys);
    expect(results.every((r) => r)).toBeTruthy();
  }, 500000);

  it('Message is successfully encrypted and encrypted', async () => {
    const results = await Promise.all(Object.keys(rsaSmaple).map( async (kp) => {
      let result = true;
      const encrypted = await rsa.encrypt(msg, rsaSmaple[kp].publicKey.jwk, 'SHA-256')
        .catch( (e: Error) => {result = false; console.error(e); return new Uint8Array([]);});
      // console.log(jseu.encoder.encodeBase64(encrypted));
      const decrypted = await rsa.decrypt(encrypted, rsaSmaple[kp].privateKey.jwk, 'SHA-256')
        .catch( (e: Error) => {result = false; console.error(e); return '';});

      expect(result).toBeTruthy();
      return (decrypted.toString() === msg.toString());
    }));
    console.log(results);
    expect(results.every( (r) => r)).toBeTruthy();
  },5000);

  it('OAEP', async () => {
    const em = await oaep.emeOaepEncode(msg, new Uint8Array([]), 256, 'SHA-256');
    // console.log(em);
    const msgPrime = await oaep.emeOaepDecode(em, new Uint8Array([]), 256, 'SHA-256');
    expect(msg.toString() === msgPrime.toString()).toBeTruthy();
  },5000);

  it('RSASSA-PKCS1-v1_5: Message is successfully signed and verified with generated JWK pairs', async () => {
    const results = await Promise.all(Object.keys(rsaSmaple).map( async (kp) => {
      let result = true;
      const sign = await rsa.sign(msg, rsaSmaple[kp].privateKey.jwk, 'SHA-256', {name: 'RSASSA-PKCS1-v1_5'}).catch( (e: any) => {result = false; console.error(e);});
      // console.log(sign);
      // console.log(jseu.encoder.encodeBase64(sign));
      const valid = await rsa.verify(msg, <Uint8Array>sign, rsaSmaple[kp].publicKey.jwk, 'SHA-256', {name: 'RSASSA-PKCS1-v1_5'})
        .catch( (e: Error) => {result = false; console.error(e);});
      expect(result).toBeTruthy();

      return valid;
    }));
    console.log(results);
    expect(results.every( (r) => r)).toBeTruthy();
  }, 5000);

  it('RSA-PSS: Message is successfully signed and verified with generated JWK pairs', async () => {
    const results = await Promise.all(Object.keys(rsaSmaple).map(async (kp) => {
      let result = true;
      const sign = await rsa.sign(msg, rsaSmaple[kp].privateKey.jwk, 'SHA-256').catch((e: any) => {
        console.error(e);
        result = false;
      });
      // console.log(jseu.encoder.encodeBase64(sign));
      const valid = await rsa.verify(msg, <Uint8Array>sign, rsaSmaple[kp].publicKey.jwk, 'SHA-256')
        .catch((e: Error) => {
          console.error(e);
          result = false;
        });
      expect(result).toBeTruthy();

      return valid;
    }));
    console.log(results);
    expect(results.every((r) => r)).toBeTruthy();
  }, 50000);


  it('Compatibility test', async () => {
    const webEnc = 'd8ehCiJyQjqjrWnKSNBJ+5Q7SS+5Xdv+Bevcn+3xYX4zMMsY2BCDux75rvexiUcIZphXf3HRNsrL340wlGhg0sNKGBaFR1Nv2D3Ta5FyEnuDbSxl6hItF6pvZ628c0DW5/YTfPE1xJLZwE+8bHAgjJO3eob5vU7/h8X9tZtf37FUfPIMLDWNc4v7E2uynrzV0xHpg6J7QZbwvJmz9uShEVraR0pkR86MPvNnRw8y2iB+xAK5V+CqZLT6I5+rZuWWxaI5+9BypeR2JmNXogrqg88/JiKy1N/TdwJ2ZJ8inu1VW97soJbLmtNPH2Ur5Dd+9dZSNKhdNQwS0QLXZn3C6A==';
    const webSig = 'CHoyzFCHWBPv6cXPplD8P0IRIO/683lfMMcMYmyukkotegyNnP+BtwID3e7f41tRe7sxUXJtb/MjUkDtxv08T2dBTAgNJtk/LLDvNVJ0AJ7MwATQpojzY1xoyEOnRhrDsYjYI+ITYDMLFbvAng2x8hf5mNrR+GoAZLxsBFtq+4n4av7FFmPMpwpFJ/R6arQky3OIt6/dm3d5jQQ6kTPSHKb3gVrutsXUUrSosXQiMDz0Qu6T2bdwKHWX5zO9P00AYwgpoLaWV+vHXQNEyyxLA/VgB2C8obpTNNJF5rqcuVp9KNGmffV43UnzWZX0YAB5JSIc+9JXKqj71JO3Q7AjTA==\n';
    const webSigPKCS1V15 = 'HOe0gTJIHojBv5M0cMIZLIH4k/ZQu8fl2ko3vU+lwx7W24KvQMp8FwjtZt7Cg+7A4PV0BO/w/pHdpaA6SM22er2fYy0jQsC+TWpkd4Z7jPNsQDSRK7UI/xTRrAlYvat4wb5DZrN6x73/m9MZqXXpfIGrmIe0wu7MHW2iRk063bA/A2rxD9bveO6H3l4zYdMRxjwA6I2Wvgc1KxDZrPxGdDDt4EUzekj3rBSOB7S1EUKlc7hC1BicgIUe3Z1hGaCS0T7EwWuqZ091lyiJGrR2aayn8bKLQmeROKEcO51CWLLM5pF6M3hTACt1saz9kGufDvqWPw8uyMP+aPGlV+ASsw==';
    const nodeEnc = 'oryyTFEC/BEgCjML93pibShvvQws120JQ41jFFhY8qm2ceGfknkBXmZYuafsCk2tUGO82mYoS0vGRd22jcQ35Bz5AcnBRlCSk90GUUPYvoRe3ED6k8rzYsi7JkMRWbXOSaI2UBx6cxWHS6ooY/XYsjubz7D+sV6okQkBbGpVCOhw0biBI6QYw54YaMryW3yxSKIoq56Z6mWNMmSTbY1DC9l6ckDn0XDePdZs/SQox1g35OmBNnALRn92Nltg6Bw1wuV/FKNsosiwdwZW7VoQqpvHORDsBBIVG++tIx/T2E5D1tddGOt0vqEWuEA3zn6x/FmKSeLzO6KGaD1xzoivTA==';
    const nodeSig = 'c9vdu4tmstRJEk1fLLLqU/r6cNZ9Tp74Zw2VsJxNvoAEFP/BXkwq27drupqajvxj+QKxP7ggs83Oi/cppmqAFghXMU1OJRRdMIbcn9O8RBZ0SJkY/LHy8NUrNvJ3AY8EjL3zqH1X0YaQltnKs9xgne4p+DpL45fQlFz8BJML+Tw1bIS59uZ87RNIEcAytiwH6VXb/HLJdLZD40OWfG2lD4g5oobZz/Gdd1ncAFuFcl0ut7SZu/wltp8DCXeQ6zl4lUG7YS3+RG0Iigq45pBYhq2Hrag+t0YQwTQQRGhKEjFlr8cKIdUaTSDgEwNcRf25cSVSJrrFepaKswM8QDkpVw==';
    const nodeSigPKCS1V15 = 'HOe0gTJIHojBv5M0cMIZLIH4k/ZQu8fl2ko3vU+lwx7W24KvQMp8FwjtZt7Cg+7A4PV0BO/w/pHdpaA6SM22er2fYy0jQsC+TWpkd4Z7jPNsQDSRK7UI/xTRrAlYvat4wb5DZrN6x73/m9MZqXXpfIGrmIe0wu7MHW2iRk063bA/A2rxD9bveO6H3l4zYdMRxjwA6I2Wvgc1KxDZrPxGdDDt4EUzekj3rBSOB7S1EUKlc7hC1BicgIUe3Z1hGaCS0T7EwWuqZ091lyiJGrR2aayn8bKLQmeROKEcO51CWLLM5pF6M3hTACt1saz9kGufDvqWPw8uyMP+aPGlV+ASsw==';

    const decrypted = await rsa.decrypt(<Uint8Array>(jseu.encoder.decodeBase64(webEnc)), rsaSmaple['2048'].privateKey.jwk, 'SHA-256');
    console.log(decrypted.toString() === msg.toString());
    expect(decrypted.toString() === msg.toString()).toBeTruthy();

    const valid = await rsa.verify(msg, <Uint8Array>jseu.encoder.decodeBase64(webSig), rsaSmaple['2048'].publicKey.jwk, 'SHA-256', {
      name: 'RSA-PSS',
      saltLength: 192
    });
    console.log(valid);
    expect(valid).toBeTruthy();

    const validP = await rsa.verify(msg, <Uint8Array>jseu.encoder.decodeBase64(webSigPKCS1V15), rsaSmaple['2048'].publicKey.jwk, 'SHA-256', {name: 'RSASSA-PKCS1-v1_5'});
    console.log(validP);
    expect(validP).toBeTruthy();

    const decryptedNode = await rsa.decrypt(<Uint8Array>jseu.encoder.decodeBase64(nodeEnc), rsaSmaple['2048'].privateKey.jwk, 'SHA-256');
    console.log(decryptedNode.toString() === msg.toString());
    expect(decryptedNode.toString() === msg.toString()).toBeTruthy();

    const validNode = await rsa.verify(msg, <Uint8Array>jseu.encoder.decodeBase64(nodeSig), rsaSmaple['2048'].publicKey.jwk, 'SHA-256', {
      name: 'RSA-PSS',
      saltLength: 192
    });
    console.log(validNode);
    expect(validNode).toBeTruthy();

    const validNodeP = await rsa.verify(msg, <Uint8Array>jseu.encoder.decodeBase64(nodeSigPKCS1V15), rsaSmaple['2048'].publicKey.jwk, 'SHA-256', {name: 'RSASSA-PKCS1-v1_5'});
    console.log(validNodeP);
    expect(validNodeP).toBeTruthy();
  }, 50000);

});
