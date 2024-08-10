import {getTestEnv} from './prepare';
const env = getTestEnv();
const keyutils = env.library;
const envName = env.envName;

import sample from './sampleEncrypted';

import {AsnEncryptOptionsWithPassphrase} from '../src/typedef';

const objectSort = (obj: any) => {
  const keys = Object.keys(obj).sort();
  const map: {[index: string]: any} = {};
  keys.forEach((key) => { map[key] = obj[key]; });
  return map;
};

describe(`${envName}: RSA/EC Key conversion from/to JWK test.`, () => {
  const encOptionArray = [
    {algorithm: 'pbes2'}, // = AES256 with hmachWithSHA256
    {algorithm: 'pbes2', cipher: 'aes128-cbc', prf: 'hmacWithSHA256'},
    // {algorithm: 'pbes2', cipher: 'aes192-cbc', prf: 'hmacWithSHA256'}, // not supported in Chrome
    {algorithm: 'pbes2', cipher: 'aes256-cbc', prf: 'hmacWithSHA256'},
    {algorithm: 'pbes2', cipher: 'des-ede3-cbc', prf: 'hmacWithSHA256'},
    {algorithm: 'pbes2', cipher: 'des-ede3-cbc', prf: 'hmacWithSHA384'},
    {algorithm: 'pbes2', cipher: 'des-ede3-cbc', prf: 'hmacWithSHA512'},
    {algorithm: 'pbeWithMD5AndDES-CBC'},
    {algorithm: 'pbeWithSHA1AndDES-CBC'}
  ];
  const rsaSample = sample.RSA;
  const ecSample = sample.EC;

  beforeAll(async () => {
  });

  it('RSA PBES1 and PBES2 PEM keys can be successfully converted and reconverted to/from JWK', async () => {
    const array = await Promise.all(Object.keys(rsaSample).map( async (key) => {
      const elem = await Promise.all(encOptionArray.map( async (encOptions) => {
        let result = true;
        const privateKey = new keyutils.Key('pem', rsaSample[key]);
        result = result && privateKey.isEncrypted;

        await privateKey.decrypt('kddilabs').catch( () => {result = false;});
        // eslint-disable-next-line require-atomic-updates
        result = result && !privateKey.isEncrypted;

        const jwkpri = await privateKey.export('pem').catch( () => {result = false; });
        const pempri = await privateKey.export(
          'pem', {
            encryptParams: <AsnEncryptOptionsWithPassphrase>{...encOptions, passphrase: 'kddilabs'}
          }
        ).catch( () => {result = false; });

        const privateKey2 = new keyutils.Key('pem', <string>pempri);
        // eslint-disable-next-line require-atomic-updates
        result = result && privateKey2.isEncrypted;
        await privateKey2.decrypt('kddilabs').catch( () => {result = false;});
        // eslint-disable-next-line require-atomic-updates
        result = result && !privateKey2.isEncrypted;

        const jwkpri2 = await privateKey2.export('pem').catch( () => {result = false;});

        return result && (objectSort(jwkpri).toString() === objectSort(jwkpri2).toString());
      }))
        .catch( (e) => {console.error(e.message);});
      console.log(elem);
      // @ts-ignore
      return elem.every( (x) => x);
    }));
    console.log(`result: ${array}`);
    expect(array.every( (x: any) => x)).toBeTruthy();

    // AES256 encrypted key sample
    // const test = '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
    //   'MIIFLTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQI24WwHkKy4+0CAggA\n' +
    //   'MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBDHasukS1RwbDihH6StdYmnBIIE\n' +
    //   '0A9gsWExWzLVV74rnE3PIKJuiophU6SxTpf5zNPaThM2vU7BqwIqNtGIpSMVEQbP\n' +
    //   'UsbKt5OOgm4cWgLQ4mp6ZVj84kym2IOv+OYKKw5qKsDG2egcYCXG0RtSoRaBM8Us\n' +
    //   'ju3j7lL0A4dEuiUqeun9m742HuQ+8VDZU4+4eO5V5AcaVvwex+tROqyhTsdDO8BB\n' +
    //   'LPuCC05dt4pn7bn3pgBm0ZVUAF1FJLs/rncPhJnJDflpbDApsFaRWNpD3878F9L8\n' +
    //   'BLKHZr/srJu1ajcM6E5avyzTvnpeRYqLMqanXqGy957yOg23NANcny20NHktkZJz\n' +
    //   '/oqdWrjiXT4gPHAskx2KYPaVySOVa55tBGoqVovzCHFNuIjwamucg5ZWZY8C6sJC\n' +
    //   '0ZaFAW9TV3Rs2GqxcL3LFx9zEgDWT+VJxQaNFXoXLz8ROYKh6QKAV7jgV4JOUYc6\n' +
    //   'ow3gGUqkhEyIYDuKzZOWeZ1IMHltMUaRz7S+ygPxBvgnjthA1XU9JRv3QSNleLGz\n' +
    //   'WcZBWDhNXLIKepefrBgvrYim3qdfK5H72FjYOx3Ir8K52dPB4BMqqz8JJjSRMfYM\n' +
    //   'ak5abTy6znSnHHHYOrYQE47E9RTYqu2rMp3B75Xru2KUxoVFV49xXXEYNzCNwFg+\n' +
    //   'PwE8gF04mEoqBiwFn40woVQUN8WpWFl3pzKai9HvIPYUOSpZrmPzE8Mu/SVpV//G\n' +
    //   '3fkVwmOyCOs3Tg/tA5aKKjMbSXMJULhCbtxUwx2Kxn8K0PfrRk7+MmLOQlp9JDvN\n' +
    //   'esrONUx/7R0SyuGkEYCQyEHzlURNrWG0ZQDlBOMIuItj2ikoNYvoNTctPsYIQdkr\n' +
    //   'ZwHSJR0DvxCA4/Vso72tnTNrZS2CoNJfJVfE8VwtA0QX9jgkS1b8nkPk1tcrvYsw\n' +
    //   '9uPYXDvmucQyKIKWomA9s27vDw0QqIwgMJ6vIWnaRDDXuIF4CpAOrwaW78ZHee1M\n' +
    //   'fvBq571/NMJFemqh8KMLZfBzkj/JoUfxRbZmBfKs/JdRZ/W6OOO5NZLcGprslpJd\n' +
    //   'u29LBMIx+cmgUZCjDtbKHDMeeG6ptSl4omLrcTE7+ZowOSUaTVxlRqweMqKNJmuc\n' +
    //   'esfWhGEbppk+oPyXDzQ9ENIUcrKin5RJ8QKcxvpiWHxAqwzfXB9eqzUkAuDmQOel\n' +
    //   'jbnigof4XL+KKnANoHHOgs47kKNJm2PzHOvxsKKiI4LIC2AMp2nGrpiMtyP/7uie\n' +
    //   'tZ6Po5HffFSTjlYEE9jEfQ/tipIqyxvEEK+aPYdZ5P3vW2OI0CTcrXJxLlBVPaxB\n' +
    //   'JVD4oMxKdIEIpmV0qnBtaD7aEF2lSIk0gYNnz+DKbXi12zmHNuJ77u6lbXN6lhlr\n' +
    //   'lcPWHQq4btWKDPR79+0lyQiY0UmdwQOUaihvdU6mY07PmslnUbtj5XVDDNP22Qdz\n' +
    //   '3jk9pGVlTcgPQqmcDVdMbHtT8khpIimriI186BvcbPOWI5H4UThyXTSisDPzEGQR\n' +
    //   'F9Z9mNb6p71nqARRNcNIMlA7JJombnR4Ws1NDv5y9szp6WH/lkTDyWw3k9sjrx8a\n' +
    //   'is2Ke0G4AAq0uP+ev5TMtnFZrLnGvt4KkWpJgibiIje+e3rya9jk+GH8qf2nldlj\n' +
    //   'ywUZpixaRCAyxa2Bbjcm/lKsUfdMq8cgzRW51wTpFlMs\n' +
    //   '-----END ENCRYPTED PRIVATE KEY-----';
    // console.log(await keyutils.toJwkFrom('pem', test, {passphrase: 'kddilabs'}).catch( () => {result = false;}));
  }, 50000);


  it('EC PBES1 and PBES2 PEM keys can be successfully converted and reconverted to/from JWK', async () => {
    const array = await Promise.all(Object.keys(ecSample).map( async (key) => {
      const elem = await Promise.all(encOptionArray.map( async (encOptions) => {
        let result = true;
        const privateKey = new keyutils.Key('pem', ecSample[key]);
        result = result && privateKey.isEncrypted;

        await privateKey.decrypt('kddilabs').catch( () => {result = false;});
        // eslint-disable-next-line require-atomic-updates
        result = result && !privateKey.isEncrypted;

        const jwkpri = await privateKey.export('pem').catch( () => {result = false; });
        const pempri = await privateKey.export(
          'pem', {
            encryptParams: <AsnEncryptOptionsWithPassphrase>{...encOptions, passphrase: 'kddilabs'}
          }
        ).catch( () => {result = false; });

        const privateKey2 = new keyutils.Key('pem', <string>pempri);
        // eslint-disable-next-line require-atomic-updates
        result = result && privateKey2.isEncrypted;
        await privateKey2.decrypt('kddilabs').catch( () => {result = false;});
        // eslint-disable-next-line require-atomic-updates
        result = result && !privateKey2.isEncrypted;

        const jwkpri2 = await privateKey2.export('pem').catch( () => {result = false;});


        return result && (objectSort(jwkpri).toString() === objectSort(jwkpri2).toString());
      }))
        .catch( (e) => {console.error(e.message);});
      console.log(elem);
      // @ts-ignore
      return elem.every( (x) => x);
    }));
    console.log(`result: ${array}`);
    expect(array.every( (x: any) => x)).toBeTruthy();
  }, 50000);

});
