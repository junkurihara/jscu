"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encryptEncryptedPrivateKeyInfo = encryptEncryptedPrivateKeyInfo;
exports.decryptEncryptedPrivateKeyInfo = decryptEncryptedPrivateKeyInfo;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireWildcard(require("./params.js"));

var _asn1def = require("./asn1def.js");

var _des = _interopRequireDefault(require("des.js"));

var _buffer = _interopRequireDefault(require("buffer"));

var _asn = _interopRequireDefault(require("asn1.js"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _index = _interopRequireDefault(require("js-crypto-hash/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-hmac/dist/index.js"));

var _index3 = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

var _asn1def2 = require("./asn1def");

/**
 * rfc8081
 */
var Buffer = _buffer.default.Buffer;
var BN = _asn.default.bignum;

function encryptEncryptedPrivateKeyInfo(_x, _x2) {
  return _encryptEncryptedPrivateKeyInfo.apply(this, arguments);
} ///////////////////////////////////////////////////////////////////


function _encryptEncryptedPrivateKeyInfo() {
  _encryptEncryptedPrivateKeyInfo = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(binKey, passphrase) {
    var options,
        kdfAlgorithm,
        encryptedPBES2,
        encryptedPBES1,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            // default params
            if (typeof options.algorithm === 'undefined') options.algorithm = 'pbes2';
            if (typeof options.iterationCount === 'undefined') options.iterationCount = 2048;

            if (!(options.algorithm === 'pbes2')) {
              _context.next = 15;
              break;
            }

            if (typeof options.cipher === 'undefined') options.cipher = 'des-ede3-cbc';
            if (typeof options.prf === 'undefined') options.prf = 'hmacWithSHA256';
            kdfAlgorithm = 'pbkdf2'; // TODO: currently only pbkdf2 is available

            _context.next = 9;
            return encryptPBES2(binKey, passphrase, kdfAlgorithm, options.prf, options.iterationCount, options.cipher);

          case 9:
            encryptedPBES2 = _context.sent;
            _context.next = 12;
            return encodePBES2(encryptedPBES2);

          case 12:
            return _context.abrupt("return", _context.sent);

          case 15:
            _context.next = 17;
            return encryptPBES1(binKey, passphrase, options.algorithm, options.iterationCount);

          case 17:
            encryptedPBES1 = _context.sent;
            encryptedPBES1.encryptionAlgorithm.algorithm = _params.default.passwordBasedEncryptionSchemes[encryptedPBES1.encryptionAlgorithm.algorithm].oid;
            encryptedPBES1.encryptionAlgorithm.parameters = _asn1def.PBEParameter.encode(encryptedPBES1.encryptionAlgorithm.parameters, 'der');
            return _context.abrupt("return", _asn1def2.EncryptedPrivateKeyInfo.encode(encryptedPBES1, 'der'));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _encryptEncryptedPrivateKeyInfo.apply(this, arguments);
}

function decryptEncryptedPrivateKeyInfo(_x3, _x4) {
  return _decryptEncryptedPrivateKeyInfo.apply(this, arguments);
} //////////////////////////////


function _decryptEncryptedPrivateKeyInfo() {
  _decryptEncryptedPrivateKeyInfo = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(decoded, passphrase) {
    var encryptionAlgorithm;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // encryptionAlgorithm.algorithm
            encryptionAlgorithm = (0, _params.getAlgorithmFromOidStrict)(decoded.encryptionAlgorithm.algorithm, _params.default.passwordBasedEncryptionSchemes);
            decoded.encryptionAlgorithm.algorithm = encryptionAlgorithm;

            if (encryptionAlgorithm === 'pbes2') {
              decoded = decodePBES2(decoded);
            } else {
              decoded.encryptionAlgorithm.parameters = _asn1def.PBEParameter.decode(decoded.encryptionAlgorithm.parameters, 'der');
            } // decrypt


            if (!(decoded.encryptionAlgorithm.algorithm === 'pbes2')) {
              _context2.next = 9;
              break;
            }

            _context2.next = 6;
            return decryptPBES2(decoded, passphrase);

          case 6:
            return _context2.abrupt("return", _context2.sent);

          case 9:
            _context2.next = 11;
            return decryptPBES1(decoded, passphrase);

          case 11:
            return _context2.abrupt("return", _context2.sent);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _decryptEncryptedPrivateKeyInfo.apply(this, arguments);
}

function encodePBES2(decoded) {
  // algorithm
  var algorithmOid = _params.default.passwordBasedEncryptionSchemes[decoded.encryptionAlgorithm.algorithm].oid;
  decoded.encryptionAlgorithm.algorithm = algorithmOid; // kdf

  var kdf = decoded.encryptionAlgorithm.parameters.keyDerivationFunc;

  if (kdf.algorithm === 'pbkdf2') {
    kdf.algorithm = _params.default.keyDerivationFunctions[kdf.algorithm].oid;
    kdf.parameters.prf.algorithm = _params.default.pbkdf2Prfs[kdf.parameters.prf.algorithm].oid;
    kdf.parameters = _asn1def.PBKDF2Params.encode(kdf.parameters, 'der');
  } else throw new Error('UnsupportedKDF');

  decoded.encryptionAlgorithm.parameters.keyDerivationFunc = kdf; // encryptionScheme

  var eS = decoded.encryptionAlgorithm.parameters.encryptionScheme;

  if (Object.keys(_asn1def.PBES2ESParams).indexOf(eS.algorithm) >= 0) {
    eS.parameters = _asn1def.PBES2ESParams[eS.algorithm].encode(eS.parameters, 'der');
  } else throw new Error('UnsupportedCipher');

  eS.algorithm = _params.default.encryptionSchemes[eS.algorithm].oid;
  decoded.encryptionAlgorithm.parameters.encryptionScheme = eS;
  decoded.encryptionAlgorithm.parameters = _asn1def.PBES2Params.encode(decoded.encryptionAlgorithm.parameters, 'der');
  return _asn1def2.EncryptedPrivateKeyInfo.encode(decoded, 'der');
}

function decodePBES2(decoded) {
  var pbes2Params = _asn1def.PBES2Params.decode(decoded.encryptionAlgorithm.parameters, 'der'); // keyDerivationFunc


  var kdfAlgorithm = (0, _params.getAlgorithmFromOidStrict)(pbes2Params.keyDerivationFunc.algorithm, _params.default.keyDerivationFunctions);
  pbes2Params.keyDerivationFunc.algorithm = kdfAlgorithm;

  if (kdfAlgorithm === 'pbkdf2') {
    var pbkdf2Params = _asn1def.PBKDF2Params.decode(pbes2Params.keyDerivationFunc.parameters, 'der');

    var pbkdf2Prf = (0, _params.getAlgorithmFromOidStrict)(pbkdf2Params.prf.algorithm, _params.default.pbkdf2Prfs);
    pbkdf2Params.prf.algorithm = pbkdf2Prf;
    pbes2Params.keyDerivationFunc.parameters = pbkdf2Params;
  } else throw new Error('UnsupportedKDF'); //encryptionScheme


  var encryptionScheme = (0, _params.getAlgorithmFromOidStrict)(pbes2Params.encryptionScheme.algorithm, _params.default.encryptionSchemes);
  pbes2Params.encryptionScheme.algorithm = encryptionScheme;

  if (Object.keys(_asn1def.PBES2ESParams).indexOf(encryptionScheme) >= 0) {
    pbes2Params.encryptionScheme.parameters = _asn1def.PBES2ESParams[encryptionScheme].decode(pbes2Params.encryptionScheme.parameters, 'der');
  } else throw new Error('UnsupportedCipher'); // TODO: Other Encryption Scheme


  decoded.encryptionAlgorithm.parameters = pbes2Params;
  return decoded;
} //////////////////////
// PBES2 RFC8081 Section 6.2.1


function encryptPBES2(_x5, _x6, _x7, _x8, _x9, _x10) {
  return _encryptPBES.apply(this, arguments);
} //////////////////////////////
// PBES2 RFC8081 Section 6.2.2


function _encryptPBES() {
  _encryptPBES = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(binKey, passphrase, kdfAlgorithm, prf, iterationCount, cipher) {
    var pBuffer, salt, keyLength, key, iv, encryptedData, CBC, ct;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // kdf
            pBuffer = _jsEncodingUtils.default.encoder.stringToArrayBuffer(passphrase);
            _context3.next = 3;
            return _index3.default.getRandomBytes(_params.default.keyDerivationFunctions[kdfAlgorithm].defaultSaltLen);

          case 3:
            salt = _context3.sent;
            // TODO: currently only salt length of 8 is available
            keyLength = _params.default.encryptionSchemes[cipher].keyLength; // get keyLength

            if (!(kdfAlgorithm === 'pbkdf2')) {
              _context3.next = 11;
              break;
            }

            _context3.next = 8;
            return pbkdf2(pBuffer, salt, iterationCount, keyLength, _params.default.pbkdf2Prfs[prf].hash);

          case 8:
            key = _context3.sent;
            _context3.next = 12;
            break;

          case 11:
            throw new Error('UnsupportedKDF');

          case 12:
            if (!(cipher === 'des-ede3-cbc')) {
              _context3.next = 23;
              break;
            }

            _context3.t0 = Buffer;
            _context3.next = 16;
            return _index3.default.getRandomBytes(_params.default.encryptionSchemes[cipher].ivLength);

          case 16:
            _context3.t1 = _context3.sent;
            iv = _context3.t0.from.call(_context3.t0, _context3.t1);
            CBC = _des.default.CBC.instantiate(_des.default.EDE);
            ct = CBC.create({
              type: 'encrypt',
              key: Buffer.from(key),
              iv: iv
            });
            encryptedData = Buffer.from(ct.update(binKey).concat(ct.final()));
            _context3.next = 24;
            break;

          case 23:
            throw new Error('UnsupportedCipher');

          case 24:
            return _context3.abrupt("return", {
              encryptedData: encryptedData,
              encryptionAlgorithm: {
                algorithm: 'pbes2',
                parameters: {
                  keyDerivationFunc: {
                    algorithm: kdfAlgorithm,
                    parameters: {
                      salt: {
                        type: 'specified',
                        value: Buffer.from(salt)
                      },
                      iterationCount: new BN(iterationCount),
                      prf: {
                        algorithm: prf,
                        parameters: Buffer.from([0x05, 0x00])
                      }
                    }
                  },
                  encryptionScheme: {
                    algorithm: cipher,
                    parameters: iv
                  }
                }
              }
            });

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _encryptPBES.apply(this, arguments);
}

function decryptPBES2(_x11, _x12) {
  return _decryptPBES.apply(this, arguments);
}

function _decryptPBES() {
  _decryptPBES = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(decoded, passphrase) {
    var kdf, eS, keyLength, key, pBuffer, salt, iterationCount, prf, out, iv, CBC, pt;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            kdf = decoded.encryptionAlgorithm.parameters.keyDerivationFunc;
            eS = decoded.encryptionAlgorithm.parameters.encryptionScheme; // pbkdf2

            keyLength = _params.default.encryptionSchemes[eS.algorithm].keyLength; // get keyLength

            if (!(kdf.algorithm === 'pbkdf2')) {
              _context4.next = 15;
              break;
            }

            pBuffer = _jsEncodingUtils.default.encoder.stringToArrayBuffer(passphrase);

            if (!(kdf.parameters.salt.type !== 'specified')) {
              _context4.next = 7;
              break;
            }

            throw new Error('UnsupportedSaltSource');

          case 7:
            salt = new Uint8Array(kdf.parameters.salt.value);
            iterationCount = kdf.parameters.iterationCount.toNumber();
            prf = kdf.parameters.prf.algorithm;
            _context4.next = 12;
            return pbkdf2(pBuffer, salt, iterationCount, keyLength, _params.default.pbkdf2Prfs[prf].hash);

          case 12:
            key = _context4.sent;
            _context4.next = 16;
            break;

          case 15:
            throw new Error('UnsupportedKDF');

          case 16:
            if (!(eS.algorithm === 'des-ede3-cbc')) {
              _context4.next = 23;
              break;
            }

            iv = eS.parameters;
            CBC = _des.default.CBC.instantiate(_des.default.EDE);
            pt = CBC.create({
              type: 'decrypt',
              key: key,
              iv: iv
            });
            out = Buffer.from(pt.update(decoded.encryptedData).concat(pt.final()));
            _context4.next = 24;
            break;

          case 23:
            throw new Error('UnsupportedEncryptionAlgorithm');

          case 24:
            return _context4.abrupt("return", _asn1def.OneAsymmetricKey.decode(out, 'der'));

          case 25:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _decryptPBES.apply(this, arguments);
}

function pbkdf2(_x13, _x14, _x15, _x16, _x17) {
  return _pbkdf.apply(this, arguments);
}

function _pbkdf() {
  _pbkdf = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee6(p, s, c, dkLen, hash) {
    var hLen, l, r, funcF, Tis, DK, i, TisResolved;
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // const crypto = require('crypto');
            // const key = crypto.pbkdf2Sync(p, s, c, dkLen, 'sha1');
            // console.log(key.toString('hex'));
            hLen = _params.default.hashes[hash].hashSize;
            l = Math.ceil(dkLen / hLen);
            r = dkLen - (l - 1) * hLen;

            funcF =
            /*#__PURE__*/
            function () {
              var _ref = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee5(i) {
                var seed, u, outputF, j;
                return _regenerator.default.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        seed = new Uint8Array(s.length + 4);
                        seed.set(s);
                        seed.set(nwbo(i + 1, 4), s.length);
                        _context5.next = 5;
                        return _index2.default.compute(p, seed, hash);

                      case 5:
                        u = _context5.sent;
                        outputF = new Uint8Array(u);
                        j = 1;

                      case 8:
                        if (!(j < c)) {
                          _context5.next = 16;
                          break;
                        }

                        _context5.next = 11;
                        return _index2.default.compute(p, u, hash);

                      case 11:
                        u = _context5.sent;
                        outputF = u.map(function (elem, idx) {
                          return elem ^ outputF[idx];
                        });

                      case 13:
                        j++;
                        _context5.next = 8;
                        break;

                      case 16:
                        return _context5.abrupt("return", {
                          index: i,
                          value: outputF
                        });

                      case 17:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, this);
              }));

              return function funcF(_x29) {
                return _ref.apply(this, arguments);
              };
            }();

            Tis = [];
            DK = new Uint8Array(dkLen);

            for (i = 0; i < l; i++) {
              Tis.push(funcF(i));
            }

            _context6.next = 9;
            return Promise.all(Tis);

          case 9:
            TisResolved = _context6.sent;
            TisResolved.forEach(function (elem) {
              if (elem.index !== l - 1) DK.set(elem.value, elem.index * hLen);else DK.set(elem.value.slice(0, r), elem.index * hLen);
            });
            return _context6.abrupt("return", DK);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return _pbkdf.apply(this, arguments);
}

function nwbo(num, len) {
  var arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = 0xFF && num >> (len - i - 1) * 8;
  }

  return arr;
} //////////////////////////////
// PBES1 RFC8081 Section 6.1.1


function encryptPBES1(_x18, _x19, _x20, _x21) {
  return _encryptPBES2.apply(this, arguments);
} //////////////////////////////
// PBES1 RFC8081 Section 6.1.2


function _encryptPBES2() {
  _encryptPBES2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee7(binKey, passphrase, algorithm, iterationCount) {
    var pBuffer, salt, hash, keyIv, key, iv, encrypt, out, CBC, ct;
    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            // pbkdf1
            pBuffer = _jsEncodingUtils.default.encoder.stringToArrayBuffer(passphrase);
            _context7.next = 3;
            return _index3.default.getRandomBytes(8);

          case 3:
            salt = _context7.sent;
            // defined as 8 octet
            hash = _params.default.passwordBasedEncryptionSchemes[algorithm].hash;
            _context7.next = 7;
            return pbkdf1(pBuffer, salt, iterationCount, 16, hash);

          case 7:
            keyIv = _context7.sent;
            key = keyIv.slice(0, 8);
            iv = keyIv.slice(8, 16); // decryption

            encrypt = _params.default.passwordBasedEncryptionSchemes[algorithm].encrypt;

            if (!(encrypt === 'DES-CBC')) {
              _context7.next = 17;
              break;
            }

            CBC = _des.default.CBC.instantiate(_des.default.DES);
            ct = CBC.create({
              type: 'encrypt',
              key: key,
              iv: iv
            });
            out = Buffer.from(ct.update(binKey).concat(ct.final()));
            _context7.next = 18;
            break;

          case 17:
            throw new Error('UnsupportedEncryptionAlgorithm');

          case 18:
            return _context7.abrupt("return", {
              encryptionAlgorithm: {
                algorithm: algorithm,
                parameters: {
                  salt: Buffer.from(salt),
                  iterationCount: new BN(iterationCount)
                }
              },
              encryptedData: out
            });

          case 19:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return _encryptPBES2.apply(this, arguments);
}

function decryptPBES1(_x22, _x23) {
  return _decryptPBES2.apply(this, arguments);
}

function _decryptPBES2() {
  _decryptPBES2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee8(decoded, passphrase) {
    var pBuffer, salt, hash, iterationCount, keyIv, key, iv, encrypt, out, CBC, ct;
    return _regenerator.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            // pbkdf1
            pBuffer = _jsEncodingUtils.default.encoder.stringToArrayBuffer(passphrase);
            salt = new Uint8Array(decoded.encryptionAlgorithm.parameters.salt);
            hash = _params.default.passwordBasedEncryptionSchemes[decoded.encryptionAlgorithm.algorithm].hash;
            iterationCount = decoded.encryptionAlgorithm.parameters.iterationCount.toNumber();
            _context8.next = 6;
            return pbkdf1(pBuffer, salt, iterationCount, 16, hash);

          case 6:
            keyIv = _context8.sent;
            key = keyIv.slice(0, 8);
            iv = keyIv.slice(8, 16); // decryption

            encrypt = _params.default.passwordBasedEncryptionSchemes[decoded.encryptionAlgorithm.algorithm].encrypt;

            if (!(encrypt === 'DES-CBC')) {
              _context8.next = 16;
              break;
            }

            CBC = _des.default.CBC.instantiate(_des.default.DES);
            ct = CBC.create({
              type: 'decrypt',
              key: key,
              iv: iv
            });
            out = Buffer.from(ct.update(decoded.encryptedData).concat(ct.final()));
            _context8.next = 17;
            break;

          case 16:
            throw new Error('UnsupportedEncryptionAlgorithm');

          case 17:
            return _context8.abrupt("return", _asn1def.OneAsymmetricKey.decode(out, 'der'));

          case 18:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return _decryptPBES2.apply(this, arguments);
}

function pbkdf1(_x24, _x25, _x26, _x27, _x28) {
  return _pbkdf2.apply(this, arguments);
}

function _pbkdf2() {
  _pbkdf2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee9(p, s, c, dkLen, hash) {
    var seed, i;
    return _regenerator.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (!(dkLen > _params.default.hashes[hash].hashSize)) {
              _context9.next = 2;
              break;
            }

            throw new Error('TooLongIntendedKeyLength');

          case 2:
            seed = new Uint8Array(p.length + s.length);
            seed.set(p);
            seed.set(s, p.length);
            i = 0;

          case 6:
            if (!(i < c)) {
              _context9.next = 13;
              break;
            }

            _context9.next = 9;
            return _index.default.compute(seed, hash);

          case 9:
            seed = _context9.sent;

          case 10:
            i++;
            _context9.next = 6;
            break;

          case 13:
            return _context9.abrupt("return", seed.slice(0, dkLen));

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));
  return _pbkdf2.apply(this, arguments);
}