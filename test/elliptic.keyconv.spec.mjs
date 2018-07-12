
import elliptic from '../src/crypto/elliptic/index.mjs';
let crypto;
if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && typeof window.crypto.subtle === 'object'
  && typeof window.crypto.subtle.importKey === 'function' && typeof window.crypto.subtle.sign === 'function') {
  crypto = window.crypto;
}
else crypto = null;


import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

describe('Signing and verification test with key conversion in pure js ecdsa and webcrypto', async () => {
  const curves = ['P-256', 'P-384', 'P-521'];
  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let ellipticKeySet = [];
  let webcryptoKeySet = [];
  let msg;
  before(async () => {
    if (!crypto){
      crypto = require('node-webcrypto-ossl');
      if(typeof crypto !== 'undefined' && typeof crypto.WebCrypto !== 'function' && typeof crypto.default !=='undefined')
        crypto = crypto.default;
      crypto = new crypto();
    }
    const algo = {name: 'ECDSA'};
    ellipticKeySet = await Promise.all(
      curves.map(async (elem) => await elliptic.crypto.generateKeyPair(Object.assign(algo, {namedCurve: elem})))
    );
    webcryptoKeySet = await Promise.all(
      curves.map(async (elem) => await crypto.subtle.generateKey(Object.assign(algo, {namedCurve: elem}), true, ['sign', 'verify']))
    );
    msg = new Uint8Array(32);
    for (let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('Generated JWK should be successfully converted to SPKI/PKCS8 binary keys and then usable in WebCrypto', async () => {
    const binKeys = [];
    for(let i = 0; i < ellipticKeySet.length; i++){
      // change to bin keys
      const curve = ellipticKeySet[i].publicKey.key.crv;
      expect(curve).to.be.equal(ellipticKeySet[i].privateKey.key.crv);

      binKeys[i] = {
        publicKey: await elliptic.keyconv.JwkToBin(ellipticKeySet[i].publicKey.key, 'public', curve),
        privateKey: await elliptic.keyconv.JwkToBin(ellipticKeySet[i].privateKey.key, 'private', curve)
      };

      hashes.forEach( async(hash) => {
        const algo = {name: 'ECDSA', hash: {name: hash}, namedCurve: curve};  //canonical:true

        // try to sign/verify using webcrypto (ossl)
        const privkey = await crypto.subtle.importKey('pkcs8', binKeys[i].privateKey, algo, false, ['sign']);
        const signature = await crypto.subtle.sign(algo, privkey, msg);
        const pubkey = await crypto.subtle.importKey('spki', binKeys[i].publicKey, algo, false, ['verify']);
        const result = await crypto.subtle.verify(algo, pubkey, signature, msg);
        expect(result).to.be.true;
      });
    }
  });

  it('WebCrypto generated SPKI/PKCS8 binary keys should be successfully converted and then usable in Elliptic', async () => {
    const jwKeys = [];
    for(let i = 0; i < webcryptoKeySet.length; i++){
      // change to bin keys
      jwKeys[i] = {
        publicKey: await elliptic.keyconv.binToJwk(
          await crypto.subtle.exportKey('spki', webcryptoKeySet[i].publicKey),
          'public'),
        privateKey: await elliptic.keyconv.binToJwk(
          await crypto.subtle.exportKey('pkcs8', webcryptoKeySet[i].privateKey),
          'private')
      };

      hashes.forEach( async(hash) => {
        const namedCurve = jwKeys[i].publicKey.crv;
        expect(namedCurve).to.be.equal(jwKeys[i].privateKey.crv);
        const algo = {name: 'ECDSA', hash: {name: hash}, namedCurve};  //canonical:true
        const signature = await elliptic.crypto.sign(algo, jwKeys[i].privateKey, msg);
        const result = await elliptic.crypto.verify(algo, jwKeys[i].publicKey, signature, msg);
        expect(result).to.be.true;
      });
    }
  });

});