const sample: {[index: string]: any} = {
  RSA: {
    PBES1: '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
      'MIIE6TAbBgkqhkiG9w0BBQMwDgQIuq8b8/g1edUCAggABIIEyHs38093DaQirJeu\n' +
      'YKkCVg/juDuDYc0MYhfpEn4eUo2Y4WOZwxD6EQsdgl5KfL3jDAmsczYIrnz4U6+X\n' +
      'hE4gmhiJu9IrgLYkKpJmtPOK96WH/ir0UrlKznJbRapmV7h+crfz2lqeNbOwDTXc\n' +
      'Qyb5LkIX3PFnrZwGa4xtPbIBBkSdh5rTqcBoZ5ob8LSbHgFpnT39xXOw6mnyqZRN\n' +
      'hvtHSJLmcVNarKfLtVk3gFRbrxd231jSN3r4q+gT9FApoQPlambPcIkrad9HIT6b\n' +
      'IBzJ+E1LrV2tAPZp3WUZEGYt8fQAlydv5lTo03ciC/03yXfNIgF1FwRgXad9XcNM\n' +
      'gHAoFJ8+om0yQjX2o7O+O+2MLHUobJzZUxo12449MTmSKFtBRfAdSeN5EzuouIfu\n' +
      'or5x3tDQ92fhDxiVDbmyH6j9qpl6aICjVDBvacuUG0pvqWy3qTUTBhcEDEZXMdz2\n' +
      'aF8Z6oLrm0MSU2SlR4C106eMVuOd21qQkMsP5W/pJySxU9Whjwf+aRmMKg4BS1WM\n' +
      'u8FimLV06CDpEA/LpUjWjDHDHP3yNYG9VMe3pqlncA0m0aDgComhMqkLl76CfKeY\n' +
      'aZk80ewWEWa+Wf8Ny6YUZxudwc5/5erEo7Pf+4h0VtxZci2gT35wHAbAtDu0Sw9F\n' +
      'yIr/PxzmWbkaQdYTnIZPAq1yTylsp7nPK+ZnZtj5POUXMT1nr5GdtbewRVf+O/mT\n' +
      'x6P161cvKxTQBcPpWRkj+RU/bM/Bpjo6CRRqoBktaKdyOBukhU28oBCR0IVNsUZJ\n' +
      'FcEEm/3WWLEiWhaevrd1TP9RinAcIcTOIom0Fh9XrM6ysq1p+WiMMYRqufhI8qmw\n' +
      'HJzE8d4obBwu2bHLORWIoEtCBEFSVzjtMrD6p4HpnzkBXMwURt/IWd5+p8DO2u0H\n' +
      '8qK7o/lRg4vU21LjdxuYjJ5jq1p1bDcU7sgtosvYwFnN/IADRRtYIOIJfdXMprNf\n' +
      'XAH++YGTOrmBpysVBWBj+amAZawdKL89Wt4DFKOnPcHtpN8hpWTH3fiRr19gttuE\n' +
      'RUUV+6lywaMrNv69srFMPZyXiC5b3ywpkZvVqFyP348XT6WcdFqEfDn+vyUmNTTe\n' +
      'ZtLLmvWHhdze8nWoII4iw5tdqGepAejG6FxLrEoK2E5YxhFxkWaaqanuynY3bEM4\n' +
      'o19NWSkhQ9EvEkmVIHxjDV6zitRyn8VAbwe75KEdtjRXhucMNajH74x1rpp3ONJb\n' +
      'Swgc3+GB0ReKuVV93qQ/qlEUzdGPEeoLL/zvYqRv/ZYM8Xege8t3GyHR5GLZiRys\n' +
      'K1gEIuJpsat+iiVgPbnuuWo49tolv8A5W1tZHqCZp5cun9RCykHU/w/x3Gq7la3a\n' +
      'Hc2NM+OQrSR0F9hYLXKAOg4KpFAP81MtSYplXX3221mVyYjAm1ky0mx8xPC3lXr2\n' +
      '1FhSw1Hjs2wk02uh3+8FYAxDpWWHuYzJGWtL8DdWFYJEwr+onI10uY4eiYr0T1l0\n' +
      'JofD/tzsbkYFvBV58xu4R4WdLNODIJ3tEn+EK2hKgdAPvnaHo/BZCg30RXu/nFDv\n' +
      'lrir9q6p9WIo4Robi+PTJC/IGO3u9vPWmXWKt4mAG146OFCQBQ4cQUaUrliLjw67\n' +
      '2j+o1v/O+PZCSdVODg==\n' +
      '-----END ENCRYPTED PRIVATE KEY-----\n',
    PBES2: '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
      '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\n' +
      '2V0=\n' +
      '-----END ENCRYPTED PRIVATE KEY-----\n'
  },
  EC: {
    PBES1: '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
      'MIIBGDAbBgkqhkiG9w0BBQMwDgQISy9JE6yGmwQCAggABIH4hu8J27mtLPUk3/t+\n' +
      '4dbV8jnXTUy85DcnmYTyrqya7Bc3j0l7z0HtfGZ05gAVG0n+ZA1gGQ0/0hnJSuUH\n' +
      'LYg9VPF0Gq+Y4rusbtG0L8VEk9MTSeTBa91ILRa9EPOIcJn4hnL24i/Y6WSnZbfg\n' +
      'pkgPpmZxAJBK23BUbaIVyCkuhxTTsjPGkCsY6tGsG7wxjAgCF2SQvjfwVMUko+4M\n' +
      'ykVu8VbisyhcZ8u2l7CRpNDfCfdiaOQTKoweJNQHKC2gbKjyg40aBquXFJp2bMwA\n' +
      'WcYrFbyGR+xpnuYsTRtUgRIWDFeG650wTc1rJf2mqiHqKul0c+/2RbqYgB4=\n' +
      '-----END ENCRYPTED PRIVATE KEY-----\n',
    PBES2: '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
      'MIIBPTBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIUCblbIm3+nUCAggA\n' +
      'MBQGCCqGSIb3DQMHBAh2pJlAmJb2WwSB+CHzl96B9aa+cnQueNOx/8Bo0YBygPGp\n' +
      'K1t6sIYhZYv36CXQp+B0c0m5SgQ+yXKcKbsQzpjpELPDCqmSCN+yGo6gzGZwxblF\n' +
      'ELadNSFX7VtgiqAdG7gRv0DZkLBPhy+KLs+0r5FOMJBIYZXQAdB1IXuBssHJ3ZMa\n' +
      'uuumH19goa2v8RxCb+kfxp/udoxFXb7xtcUL2Ih73M80cbwpJoKBfIwf4RkzIxuu\n' +
      'qdRitvzyw8cJJaQ6IAgNCh8gHjWxi63CtBYFPibqkhmylq1FGByL14ofeCjuJNjk\n' +
      'E8qeIXmrGbtjSo/X9ot3nV9l+uoRHjz4sjrFz3csAW+l\n' +
      '-----END ENCRYPTED PRIVATE KEY-----'
  }
};

export default sample;
