"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkLength = checkLength;
exports.emeOaepEncode = emeOaepEncode;
exports.emeOaepDecode = emeOaepDecode;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireDefault(require("./params.js"));

var _index = _interopRequireDefault(require("js-crypto-hash/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

/**
 * oaep.js
 */
// RFC3447 https://tools.ietf.org/html/rfc3447

/*
      # Encryption
      a. If the length of L is greater than the input limitation for the
         hash function (2^61 - 1 octets for SHA-1), output "label too
         long" and stop.

      b. If mLen > k - 2hLen - 2, output "message too long" and stop.

      # Decryption
      a. If the length of L is greater than the input limitation for the
         hash function (2^61 - 1 octets for SHA-1), output "decryption
         error" and stop.

      b. If the length of the ciphertext C is not k octets, output
         "decryption error" and stop.

      c. If k < 2hLen + 2, output "decryption error" and stop.
 */
function checkLength(mode, _ref) {
  var k = _ref.k,
      label = _ref.label,
      hash = _ref.hash,
      mLen = _ref.mLen,
      cLen = _ref.cLen;

  if (mode === 'encrypt') {
    if (label.length > (1 << _params.default.hashes[hash].maxInput) - 1) throw new Error('LabelTooLong');
    if (mLen > k - 2 * _params.default.hashes[hash].hashSize - 2) throw new Error('MessageTooLong');
  } else if (mode === 'decrypt') {
    if (label.length > (1 << _params.default.hashes[hash].maxInput) - 1) throw new Error('DecryptionError');
    if (cLen !== k || k < 2 * _params.default.hashes[hash].hashSize + 2) throw new Error('DecryptionError');
  } else throw new Error('InvalidMode');
}
/*
      a. If the label L is not provided, let L be the empty string. Let
         lHash = Hash(L), an octet string of length hLen (see the note
         below).

      b. Generate an octet string PS consisting of k - mLen - 2hLen - 2
         zero octets.  The length of PS may be zero.

      c. Concatenate lHash, PS, a single octet with hexadecimal value
         0x01, and the message M to form a data block DB of length k -
         hLen - 1 octets as

            DB = lHash || PS || 0x01 || M.

      d. Generate a random octet string seed of length hLen.

      e. Let dbMask = MGF(seed, k - hLen - 1).

      f. Let maskedDB = DB \xor dbMask.

      g. Let seedMask = MGF(maskedDB, hLen).

      h. Let maskedSeed = seed \xor seedMask.

      i. Concatenate a single octet with hexadecimal value 0x00,
         maskedSeed, and maskedDB to form an encoded message EM of
         length k octets as

            EM = 0x00 || maskedSeed || maskedDB.
 */


function emeOaepEncode(_x, _x2, _x3) {
  return _emeOaepEncode.apply(this, arguments);
}
/*
      a. If the label L is not provided, let L be the empty string. Let
         lHash = Hash(L), an octet string of length hLen (see the note
         in Section 7.1.1).

      b. Separate the encoded message EM into a single octet Y, an octet
         string maskedSeed of length hLen, and an octet string maskedDB
         of length k - hLen - 1 as

            EM = Y || maskedSeed || maskedDB.

      c. Let seedMask = MGF(maskedDB, hLen).

      d. Let seed = maskedSeed \xor seedMask.

      e. Let dbMask = MGF(seed, k - hLen - 1).

      f. Let DB = maskedDB \xor dbMask.

      g. Separate DB into an octet string lHash' of length hLen, a
         (possibly empty) padding string PS consisting of octets with
         hexadecimal value 0x00, and a message M as

            DB = lHash' || PS || 0x01 || M.

         If there is no octet with hexadecimal value 0x01 to separate PS
         from M, if lHash does not equal lHash', or if Y is nonzero,
         output "decryption error" and stop.  (See the note below.)
 */


function _emeOaepEncode() {
  _emeOaepEncode = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(msg, label, k) {
    var hash,
        hashSize,
        ps,
        lHash,
        db,
        seed,
        dbMask,
        maskedDb,
        seedMask,
        maskedSeed,
        em,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hash = _args.length > 3 && _args[3] !== undefined ? _args[3] : 'SHA-256';
            hashSize = _params.default.hashes[hash].hashSize;
            ps = new Uint8Array(k - msg.length - 2 * hashSize - 2);
            ps = ps.map(function () {
              return 0x00;
            });
            _context.next = 6;
            return _index.default.compute(label, hash);

          case 6:
            lHash = _context.sent;
            db = new Uint8Array(k - hashSize - 1);
            db.set(lHash);
            db.set(ps, hashSize);
            db.set(new Uint8Array([0x01]), k - msg.length - hashSize - 2);
            db.set(msg, k - msg.length - hashSize - 1);
            _context.next = 14;
            return _index2.default.getRandomBytes(hashSize);

          case 14:
            seed = _context.sent;
            _context.next = 17;
            return mgf1(seed, k - hashSize - 1, hash);

          case 17:
            dbMask = _context.sent;
            maskedDb = db.map(function (elem, idx) {
              return 0xFF & (elem ^ dbMask[idx]);
            });
            _context.next = 21;
            return mgf1(maskedDb, hashSize, hash);

          case 21:
            seedMask = _context.sent;
            maskedSeed = seed.map(function (elem, idx) {
              return 0xFF & (elem ^ seedMask[idx]);
            });
            em = new Uint8Array(k);
            em.set(new Uint8Array([0x00]));
            em.set(maskedSeed, 1);
            em.set(maskedDb, hashSize + 1);
            return _context.abrupt("return", em);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _emeOaepEncode.apply(this, arguments);
}

function emeOaepDecode(_x4, _x5, _x6) {
  return _emeOaepDecode.apply(this, arguments);
}
/**
 * mask generation function 1 (MGF1)
 * @param seed
 * @param len
 * @param hash
 * @return {Promise<Uint8Array>}
 */


function _emeOaepDecode() {
  _emeOaepDecode = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(em, label, k) {
    var hash,
        hashSize,
        lHash,
        y,
        maskedSeed,
        maskedDb,
        seedMask,
        seed,
        dbMask,
        db,
        lHashPrime,
        offset,
        i,
        separator,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hash = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : 'SHA-256';
            hashSize = _params.default.hashes[hash].hashSize;
            _context2.next = 4;
            return _index.default.compute(label, hash);

          case 4:
            lHash = _context2.sent;
            // must be equal to lHashPrime
            y = em[0]; // must be zero

            if (!(y !== 0x00)) {
              _context2.next = 8;
              break;
            }

            throw new Error('DecryptionError');

          case 8:
            maskedSeed = em.slice(1, hashSize + 1);
            maskedDb = em.slice(hashSize + 1, em.length);
            _context2.next = 12;
            return mgf1(maskedDb, hashSize, hash);

          case 12:
            seedMask = _context2.sent;
            seed = maskedSeed.map(function (elem, idx) {
              return 0xFF & (elem ^ seedMask[idx]);
            });
            _context2.next = 16;
            return mgf1(seed, k - hashSize - 1, hash);

          case 16:
            dbMask = _context2.sent;
            db = maskedDb.map(function (elem, idx) {
              return 0xFF & (elem ^ dbMask[idx]);
            });
            lHashPrime = db.slice(0, hashSize);

            if (!(lHashPrime.toString() !== lHash.toString())) {
              _context2.next = 21;
              break;
            }

            throw new Error('DecryptionError');

          case 21:
            i = hashSize;

          case 22:
            if (!(i < db.length)) {
              _context2.next = 29;
              break;
            }

            if (!(db[i] !== 0x00)) {
              _context2.next = 26;
              break;
            }

            offset = i;
            return _context2.abrupt("break", 29);

          case 26:
            i++;
            _context2.next = 22;
            break;

          case 29:
            separator = db[offset];

            if (!(separator !== 0x01)) {
              _context2.next = 32;
              break;
            }

            throw new Error('DecryptionError');

          case 32:
            return _context2.abrupt("return", db.slice(offset + 1, db.length));

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _emeOaepDecode.apply(this, arguments);
}

function mgf1(_x7, _x8) {
  return _mgf.apply(this, arguments);
}

function _mgf() {
  _mgf = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(seed, len) {
    var hash,
        hashSize,
        blockLen,
        t,
        i,
        c,
        x,
        y,
        _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            hash = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 'SHA-256';
            hashSize = _params.default.hashes[hash].hashSize;
            blockLen = Math.ceil(len / hashSize);
            t = new Uint8Array(blockLen * hashSize);
            i = 0;

          case 5:
            if (!(i < blockLen)) {
              _context3.next = 17;
              break;
            }

            c = i2osp(i, 4);
            x = new Uint8Array(seed.length + 4);
            x.set(seed);
            x.set(c, seed.length);
            _context3.next = 12;
            return _index.default.compute(x, hash);

          case 12:
            y = _context3.sent;
            t.set(y, i * hashSize);

          case 14:
            i++;
            _context3.next = 5;
            break;

          case 17:
            return _context3.abrupt("return", t.slice(0, len));

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _mgf.apply(this, arguments);
}

function i2osp(x, len) {
  var r = new Uint8Array(len);
  r.forEach(function (elem, idx) {
    var y = 0xFF & x >> idx * 8;
    r[len - idx - 1] = y;
  });
  return r;
}