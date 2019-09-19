// test vectors from
// https://www.di-mgt.com.au/sha_testvectors.html
export const testVectors : {
  [index: string]: {
    [index: string]: string
  } }
= {
  'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq': {
    'MD5':      '8215ef0796a20bcaaae116d3876c664a',
    'SHA-1':    '84983e441c3bd26ebaae4aa1f95129e5e54670f1',
    'SHA-224':  '75388b16512776cc5dba5da1fd890150b0c6455cb4f58b1952522525',
    'SHA-256':  '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
    'SHA-384':  '3391fdddfc8dc7393707a65b1b4709397cf8b1d162af05abfe8f450de5f36bc6b0455a8520bc4e6f5fe95b1fe3c8452b',
    'SHA-512':  '204a8fc6dda82f0a0ced7beb8e08a41657c16ef468b228a8279be331a703c33596fd15c13b1b07f9aa1d3bea57789ca031ad85c7a71dd70354ec631238ca3445',
    'SHA3-224': '8a24108b154ada21c9fd5574494479ba5c7e7ab76ef264ead0fcce33',
    'SHA3-256': '41c0dba2a9d6240849100376a8235e2c82e1b9998a999e21db32dd97496d3376',
    'SHA3-384': '991c665755eb3a4b6bbdfb75c78a492e8c56a22c5c4d7e429bfdbc32b9d4ad5aa04a1f076e62fea19eef51acd0657c22',
    'SHA3-512': '04a371e84ecfb5b8b77cb48610fca8182dd457ce6f326a0fd3d7ec2f1e91636dee691fbe0c985302ba1b0d8dc78c086346b533b49c030d99a27daf1139d6e75e'
  }
};
