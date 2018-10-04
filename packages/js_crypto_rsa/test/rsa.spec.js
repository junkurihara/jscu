import rsa from '../src/index.js';
import rsaSmaple from './rsa_sample.js';

import * as oaep from '../src/oaep.js';

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

import jseu from 'js-encoding-utils';

describe('RSA cryptography test', () => {

  const modulusLength = ['2048', '4096'];
  const keys = [];
  const msgLen = 128;
  const msg = new Uint8Array(msgLen);
  before( async () => {
    for(let i = 0; i < msgLen; i++) msg[i] = 0xFF & i;
  });

  if(typeof window !== 'undefined') { // TODO: NODEjs currently doesn't work for key generation
    it('JWK key pair is correctly generated', async function () {
      this.timeout(500000);
      const results = await Promise.all(modulusLength.map(async (n) => {
        let result = true;
        const key = await rsa.generateKey(n).catch((e) => {
          result = false;
        });
        keys.push(key);
        // console.log(key);
        return result;
      }));
      console.log(results);
      console.log(keys);
      expect(results.every((r) => r)).to.be.true;
    });
  }

  it('OAEP', async () => {
    const em = await oaep.emeOaepEncode(msg, new Uint8Array([]), 256, 'SHA-256');
    // console.log(em);
    const msgPrime = await oaep.emeOaepDecode(em, new Uint8Array([]), 256, 'SHA-256');
    console.log(msg.toString() === msgPrime.toString());
  });

  it('Message is successfully signed and verified with generated JWK pairs', async function () {
    this.timeout(5000);
    const results = await Promise.all(Object.keys(rsaSmaple).map( async (kp) => {
      let result = true;
      const sign = await rsa.sign(msg, rsaSmaple[kp].privateKey.jwk, 'SHA-256').catch( (e) => {result = false;});
      // console.log(jseu.encoder.encodeBase64(sign));
      const valid = await rsa.verify(msg, sign, rsaSmaple[kp].publicKey.jwk, 'SHA-256').catch( (e) => {result = false;});
      expect(result).to.be.true;

      return valid;
    }));
    console.log(results);
    expect(results.every( (r) => r)).to.be.true;
  });

  it('Message is successfully encrypted and encrypted', async function () {
    this.timeout(5000);
    const results = await Promise.all(Object.keys(rsaSmaple).map( async (kp) => {
      let result = true;
      const encrypted = await rsa.encrypt(msg, rsaSmaple[kp].publicKey.jwk, 'SHA-256').catch( (e) => {result = false;});
      // console.log(jseu.encoder.encodeBase64(encrypted));
      const decrypted = await rsa.decrypt(encrypted, rsaSmaple[kp].privateKey.jwk, 'SHA-256').catch( (e) => {result = false;});

      expect(result).to.be.true;
      return (decrypted.toString() === msg.toString());
    }));
    console.log(results);
    expect(results.every( (r) => r)).to.be.true;
  });

  it('Compatibility test', async () => {
    const webEnc = 'd8ehCiJyQjqjrWnKSNBJ+5Q7SS+5Xdv+Bevcn+3xYX4zMMsY2BCDux75rvexiUcIZphXf3HRNsrL340wlGhg0sNKGBaFR1Nv2D3Ta5FyEnuDbSxl6hItF6pvZ628c0DW5/YTfPE1xJLZwE+8bHAgjJO3eob5vU7/h8X9tZtf37FUfPIMLDWNc4v7E2uynrzV0xHpg6J7QZbwvJmz9uShEVraR0pkR86MPvNnRw8y2iB+xAK5V+CqZLT6I5+rZuWWxaI5+9BypeR2JmNXogrqg88/JiKy1N/TdwJ2ZJ8inu1VW97soJbLmtNPH2Ur5Dd+9dZSNKhdNQwS0QLXZn3C6A==';
    const webSig = 'CHoyzFCHWBPv6cXPplD8P0IRIO/683lfMMcMYmyukkotegyNnP+BtwID3e7f41tRe7sxUXJtb/MjUkDtxv08T2dBTAgNJtk/LLDvNVJ0AJ7MwATQpojzY1xoyEOnRhrDsYjYI+ITYDMLFbvAng2x8hf5mNrR+GoAZLxsBFtq+4n4av7FFmPMpwpFJ/R6arQky3OIt6/dm3d5jQQ6kTPSHKb3gVrutsXUUrSosXQiMDz0Qu6T2bdwKHWX5zO9P00AYwgpoLaWV+vHXQNEyyxLA/VgB2C8obpTNNJF5rqcuVp9KNGmffV43UnzWZX0YAB5JSIc+9JXKqj71JO3Q7AjTA==\n';
    const nodeEnc = 'oryyTFEC/BEgCjML93pibShvvQws120JQ41jFFhY8qm2ceGfknkBXmZYuafsCk2tUGO82mYoS0vGRd22jcQ35Bz5AcnBRlCSk90GUUPYvoRe3ED6k8rzYsi7JkMRWbXOSaI2UBx6cxWHS6ooY/XYsjubz7D+sV6okQkBbGpVCOhw0biBI6QYw54YaMryW3yxSKIoq56Z6mWNMmSTbY1DC9l6ckDn0XDePdZs/SQox1g35OmBNnALRn92Nltg6Bw1wuV/FKNsosiwdwZW7VoQqpvHORDsBBIVG++tIx/T2E5D1tddGOt0vqEWuEA3zn6x/FmKSeLzO6KGaD1xzoivTA==';
    const decrypted = await rsa.decrypt(jseu.encoder.decodeBase64(webEnc), rsaSmaple['2048'].privateKey.jwk, 'SHA-256');
    console.log(decrypted.toString() === msg.toString());
    expect(decrypted.toString() === msg.toString()).to.be.true;
    const valid = await rsa.verify(msg, jseu.encoder.decodeBase64(webSig), rsaSmaple['2048'].publicKey.jwk, 'SHA-256');
    console.log(valid);
    expect(valid).to.be.true;

    const decryptedNode = await rsa.decrypt(jseu.encoder.decodeBase64(nodeEnc), rsaSmaple['2048'].privateKey.jwk, 'SHA-256');
    console.log(decryptedNode.toString() === msg.toString());
    expect(decryptedNode.toString() === msg.toString()).to.be.true;
  });

  // it('Message is successfully signed and verified with generated JWK pairs with DER signature', async function () {
  //   this.timeout(5000);
  //   const results = await Promise.all(keys.map( async (kp) => {
  //     let result = true;
  //     const sign = await elliptic.sign(msg, kp.privateKey, 'SHA-256', 'der').catch( (e) => {result = false;});
  //     //console.log(sign);
  //     const valid = await elliptic.verify(msg, sign, kp.publicKey, 'SHA-256', 'der').catch( (e) => {result = false;});
  //     expect(result).to.be.true;
  //
  //     return valid;
  //   }));
  //   console.log(results);
  //   expect(results.every( (r) => r)).to.be.true;
  // });

});