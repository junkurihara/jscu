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

            if (!(typeof webCrypto !== 'undefined' && typeof webCrypto.digest === 'function')) {
              _context.next = 14;
              break;
            }

            _context.next = 11;
            return webCrypto.digest(hash, msg);

          case 11:
            msgHash = _context.sent;
            _context.next = 29;
            break;

          case 14:
            if (!(typeof nodeCrypto !== 'undefined')) {
              _context.next = 21;
              break;
            }

            // for node
            alg = _params.default.hashes[hash].nodeName;
            hashFunc = nodeCrypto.createHash(alg);
            hashFunc.update(msg);
            msgHash = hashFunc.digest();
            _context.next = 29;
            break;

          case 21:
            if (!(typeof msCrypto !== 'undefined' && typeof msCrypto.digest === 'function')) {
              _context.next = 28;
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

            _context.next = 25;
            return msdigest(hash, msg);

          case 25:
            msgHash = _context.sent;
            _context.next = 29;
            break;

          case 28:
            throw new Error('UnsupportedEnvironment');

          case 29:
            return _context.abrupt("return", new Uint8Array(msgHash));

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _compute.apply(this, arguments);
}