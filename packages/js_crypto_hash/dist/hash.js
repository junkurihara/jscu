"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compute = compute;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var util = _interopRequireWildcard(require("./util.js"));

var _params = _interopRequireDefault(require("./params.js"));

var _md = _interopRequireDefault(require("md5"));

var _sha = _interopRequireDefault(require("sha.js"));

/**
 * hash.js
 */

/**
 * Compute Hash
 * @param hash
 * @param msg
 * @return {Promise<Uint8Array>}
 */
function compute(_x) {
  return _compute.apply(this, arguments);
}

function _compute() {
  _compute = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(msg) {
    var hash,
        webCrypto,
        nodeCrypto,
        msCrypto,
        msgHash,
        native,
        alg,
        hashFunc,
        msdigest,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hash = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'SHA-256';

            if (!(Object.keys(_params.default.hashes).indexOf(hash) < 0)) {
              _context.next = 3;
              break;
            }

            throw new Error('UnsupportedHashAlgorithm');

          case 3:
            if (msg instanceof Uint8Array) {
              _context.next = 5;
              break;
            }

            throw new Error('UnsupportedMessageType');

          case 5:
            webCrypto = util.getWebCrypto();
            nodeCrypto = util.getNodeCrypto();
            msCrypto = util.getMsCrypto();
            native = true;

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.digest === 'function' && typeof msCrypto === 'undefined')) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return webCrypto.digest(hash, msg).catch(function () {
              return native = false;
            });

          case 12:
            msgHash = _context.sent;
            _context.next = 27;
            break;

          case 15:
            if (!(typeof nodeCrypto !== 'undefined')) {
              _context.next = 19;
              break;
            }

            // for node
            try {
              alg = _params.default.hashes[hash].nodeName;
              hashFunc = nodeCrypto.createHash(alg);
              hashFunc.update(msg);
              msgHash = hashFunc.digest();
            } catch (e) {
              native = false;
            }

            _context.next = 27;
            break;

          case 19:
            if (!(typeof msCrypto !== 'undefined' && typeof msCrypto.digest === 'function')) {
              _context.next = 26;
              break;
            }

            // for legacy ie 11
            // WTF IE!!!
            msdigest = function msdigest(alg, m) {
              return new Promise(function (resolve, reject) {
                var op = window.msCrypto.subtle.digest(alg, m);

                op.oncomplete = function (evt) {
                  resolve(evt.target.result);
                };

                op.onerror = function (e) {
                  reject(e);
                };
              });
            };

            _context.next = 23;
            return msdigest(hash, msg).catch(function (e) {
              return native = false;
            });

          case 23:
            msgHash = _context.sent;
            _context.next = 27;
            break;

          case 26:
            native = false;

          case 27:
            if (native) {
              _context.next = 35;
              break;
            }

            _context.prev = 28;
            msgHash = purejs(hash, msg);
            _context.next = 35;
            break;

          case 32:
            _context.prev = 32;
            _context.t0 = _context["catch"](28);
            throw new Error('UnsupportedEnvironment');

          case 35:
            return _context.abrupt("return", new Uint8Array(msgHash));

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[28, 32]]);
  }));
  return _compute.apply(this, arguments);
}

function purejs(hash, msg) {
  var h;

  if (hash === 'MD5') {
    h = (0, _md.default)(Array.from(msg), {
      asBytes: true
    });
  } else if (Object.keys(_params.default.hashes).indexOf(hash) >= 0) {
    h = (0, _sha.default)(_params.default.hashes[hash].nodeName).update(msg).digest();
  } else throw new Error('UnsupportedHashInPureJs');

  return new Uint8Array(h);
}