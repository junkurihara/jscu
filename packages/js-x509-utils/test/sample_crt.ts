const params: {
  [index: string]: {
    [index: string]: string
  }
} = {
  // the below are given from openssl
  rsa: {
    certificatePKCS1v1_5: '-----BEGIN CERTIFICATE-----\n' +
      'MIIDSjCCAjICCQDJLWBBtQal/jANBgkqhkiG9w0BAQsFADBnMQswCQYDVQQGEwJK\n' +
      'UDEOMAwGA1UECAwFVG9reW8xEDAOBgNVBAcMB0NoaXlvZGExDTALBgNVBAoMBFNl\n' +
      'bGYxETAPBgNVBAsMCFJlc2VhcmNoMRQwEgYDVQQDDAtleGFtcGxlLmNvbTAeFw0x\n' +
      'ODEwMDUwNTQwNTRaFw0yODEwMDIwNTQwNTRaMGcxCzAJBgNVBAYTAkpQMQ4wDAYD\n' +
      'VQQIDAVUb2t5bzEQMA4GA1UEBwwHQ2hpeW9kYTENMAsGA1UECgwEU2VsZjERMA8G\n' +
      'A1UECwwIUmVzZWFyY2gxFDASBgNVBAMMC2V4YW1wbGUuY29tMIIBIjANBgkqhkiG\n' +
      '9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtrxIuJ18ejrM/flC0IcqpNMEOFy0xl8GBu0O\n' +
      'o5jdMbW5BTqdeyOo9rdUfFeS9FwjMJ8MW5GImocrMj5pSrtvqZrSlXMS0Ho275jG\n' +
      '02h1/5L+LL6wQEqvRfEgEueYMmSBMLw2UFJnaITdKsGsUTwW2TeVMTmJohRf378F\n' +
      'toT+0imz2HvWk00Nm5kf1iTDLEtkAmTSaIO7YihFZbGkpFDtM79oKiABS18atGt6\n' +
      'Fvl69uaa4LJgmltYt181QQ6/QKHtUQGQ9L28z3mYuUpXEF7lGrL3wIZ6NaU15XwC\n' +
      'A3BplnfcpBuzaVtha5n7GEBCiSZ24qDaFOJsifHpqbBju8wPAwIDAQABMA0GCSqG\n' +
      'SIb3DQEBCwUAA4IBAQAzPtDUaEQR4lyaP6B9JLfQkzsfL+P69EHFb2EA59Rmlstm\n' +
      'ls11iTITzhcufVGIqaDwGiYEQMjYOs2gm9DujUrXHpix/isiWy0pXv+M3PtgIUXm\n' +
      'vwq2XuodTJLW5xliTKw3BEn2xA58+54FUixZfbcJZqo8pdNtmY+yeFrJ8C76HB2/\n' +
      'hJfwiKy3k7rm9yHPifHsh4pVRhxDwcUXu43mTgA5LFenlHHyogbvH5WCjHRWhoeH\n' +
      'lwNmlPctyNt5GIz5AIYY2hXD6CTqStaS00lsD8GjaEvOPs44EM64Uiw7nOKzmKBH\n' +
      'zQglLym+aLPQttMdFhRV4zDkygA8gYU8N8TG7Kdb\n' +
      '-----END CERTIFICATE-----',
    publicKey: '-----BEGIN PUBLIC KEY-----\n' +
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtrxIuJ18ejrM/flC0Icq\n' +
      'pNMEOFy0xl8GBu0Oo5jdMbW5BTqdeyOo9rdUfFeS9FwjMJ8MW5GImocrMj5pSrtv\n' +
      'qZrSlXMS0Ho275jG02h1/5L+LL6wQEqvRfEgEueYMmSBMLw2UFJnaITdKsGsUTwW\n' +
      '2TeVMTmJohRf378FtoT+0imz2HvWk00Nm5kf1iTDLEtkAmTSaIO7YihFZbGkpFDt\n' +
      'M79oKiABS18atGt6Fvl69uaa4LJgmltYt181QQ6/QKHtUQGQ9L28z3mYuUpXEF7l\n' +
      'GrL3wIZ6NaU15XwCA3BplnfcpBuzaVtha5n7GEBCiSZ24qDaFOJsifHpqbBju8wP\n' +
      'AwIDAQAB\n' +
      '-----END PUBLIC KEY-----',
    privateKey: '-----BEGIN PRIVATE KEY-----\n' +
      'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2vEi4nXx6Osz9\n' +
      '+ULQhyqk0wQ4XLTGXwYG7Q6jmN0xtbkFOp17I6j2t1R8V5L0XCMwnwxbkYiahysy\n' +
      'PmlKu2+pmtKVcxLQejbvmMbTaHX/kv4svrBASq9F8SAS55gyZIEwvDZQUmdohN0q\n' +
      'waxRPBbZN5UxOYmiFF/fvwW2hP7SKbPYe9aTTQ2bmR/WJMMsS2QCZNJog7tiKEVl\n' +
      'saSkUO0zv2gqIAFLXxq0a3oW+Xr25prgsmCaW1i3XzVBDr9Aoe1RAZD0vbzPeZi5\n' +
      'SlcQXuUasvfAhno1pTXlfAIDcGmWd9ykG7NpW2FrmfsYQEKJJnbioNoU4myJ8emp\n' +
      'sGO7zA8DAgMBAAECggEAaL3hvRhgKjucFpOSja58bf+aMqhI4k/DR6MHuhQ77Wtp\n' +
      'QysG63dUOR56ac9Up4ZMkWkJD0+LCnAh/WmytqhbZ88bl5hfF2qGJK3ggXsl77mU\n' +
      'wZcHtcJZVvDQXqWrIm9jccjgJQgmx80obIKYv/N+cUGf3ZhKYMHm9nwqzSTMXy+Z\n' +
      '+5xkfaBA6jmN1vnYsgeup/jZA6Fn+S4maMiQOkrvZ0noe5BI4kw/EKhJRpNDNCZC\n' +
      'xVhYmVzXPoOdDKMOiDpmBYZx/270/PkVq7CZFbg7wyLhBnk5WB4L7SyMPYoh5gIF\n' +
      'd16XCdZnH+T0JVRA+4aEAZW+FL1TLvqqh9LkmK5/yQKBgQDh9OZTRSkVlnb3kvgP\n' +
      '7Bdx/vRIShbrOO27ElgEhmEl01MJjJFgLp7bSGO6lGKKsfEi7wsIC/hwVGJoNTCI\n' +
      'jAPXPL8rVr64Es7f9150F2WtH7Ztyb/HCpZN382/kkaNTNg/k8v9VL61XgpoZNyK\n' +
      'a/zS0HfHlq89csTMhOiWdIicbQKBgQDPCDmWLqhZummD4m7eK+0X7UR3zBlHgy1W\n' +
      'AGgdH29OqCQGT+rG2Vgnujb2O/2pDSRcsazP0y+mK88AVU+cmWt/dS8RAvchfwMs\n' +
      'k9ZqH2E+f+0hIq69do6tgGR+I7sIy2D9FRTVvwjtIf9//DeXRJAQhZeXTC0XjMm6\n' +
      'tqEMvABTLwKBgQDGcmXPAFDC6vD1IpjGsx0sOzSkQJ28XLU9tTCkWLj9lYm6O0B6\n' +
      'breJ8xvTg/q/wOP9QGA54vmA/junNf+4DPBamrlzAK5jz/Ds9r53ywy7bby005mg\n' +
      '4AV9w29aLsfT1Yee3tkrVsBfXYZahSrET28uX3SzT/38Q83fqWL0sMhCSQKBgFZD\n' +
      'XBNKj5ULiimMsJtb/CdLEotD/IiCjOJXuwnfbjZ88r26kN2X9BZhjcMdjfzhX/RL\n' +
      'h/D0UtdPS6oc4dYjStpJznmtHaHUVVM+qkl/l7o9/WUgGWUSQDLk23p/ktAARgJN\n' +
      'xWemeKat0tLWGaeqxshLkbVV5Tf5zphAvmwa7Zu7AoGBAK0j/TzjUSsFH6NF4cQe\n' +
      'btCVjW6bbWIz+QSnKijTDNe/gM5XqGSO3lFhCAbKVklMdAGfdi33GXEmM36Jf70Y\n' +
      'CKRdwHxHYh3vJW9Vvz2jzaRlCtLgaBtBwpj7tX0l0vo5GdJ9hvwPHhH3BAD4o10a\n' +
      'CgzvYNgmx1iCgkiWSyEcdVZm\n' +
      '-----END PRIVATE KEY-----'
  }
};

export default params;
