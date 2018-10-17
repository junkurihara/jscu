"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Key = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _converter = require("./converter.js");

var _thumbprint = require("./thumbprint.js");

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _util = require("./util.js");

/**
 * key.js
 */

/**
 * Key class
 */
var Key =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @param format
   * @param key
   * @param options
   */
  function Key(format, key) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2.default)(this, Key);
    this._jwk = {};
    this._der = null;
    this._oct = {}; // only for EC keys

    this._current = {
      jwk: false,
      der: false,
      oct: false
    };

    if (format === 'jwk') {
      this._setJwk(key);
    } else if (format === 'der' || format === 'pem') {
      if (format === 'der' && !(key instanceof Uint8Array)) throw new Error('DerKeyMustBeUint8Array');
      if (format === 'pem' && typeof key !== 'string') throw new Error('PemKeyMustBeString');

      this._setAsn1(key, format);
    } else if (format === 'oct') {
      if (typeof options.namedCurve !== 'string') throw new Error('namedCurveMustBeSpecified');
      if (!(key instanceof Uint8Array)) throw new Error('OctetKeyMustBeUint8Array');

      this._setSec1(key, options.namedCurve);
    } else throw new Error('UnsupportedType');
  } ///////////////////////////////////////////////////////////
  // private method handling instance variables
  // all instance variables must be set via these methods


  (0, _createClass2.default)(Key, [{
    key: "_setJwk",
    value: function _setJwk(jwkey) {
      this._type = (0, _util.getJwkType)(jwkey); // this also check key format

      this._jwk = jwkey;
      if (this._isEncrypted) this._der = null;
      this._isEncrypted = false;

      this._setCurrentStatus();
    }
  }, {
    key: "_setAsn1",
    value: function _setAsn1(asn1key, format) {
      this._type = (0, _util.isAsn1Public)(asn1key, format) ? 'public' : 'private'; // this also check key format

      this._isEncrypted = (0, _util.isAsn1Encrypted)(asn1key, format);
      this._der = format === 'pem' ? _jsEncodingUtils.default.formatter.pemToBin(asn1key) : asn1key;

      if (this._isEncrypted) {
        this._jwk = {};
        this._oct = {};
      }

      this._setCurrentStatus();
    }
  }, {
    key: "_setSec1",
    value: function _setSec1(sec1key, namedCurve) {
      this._type = (0, _util.getSec1KeyType)(sec1key, namedCurve); // this also check key format

      this._oct = {
        namedCurve: namedCurve,
        key: sec1key
      };
      if (this._isEncrypted) this._der = null;
      this._isEncrypted = false;

      this._setCurrentStatus();
    }
  }, {
    key: "_setCurrentStatus",
    value: function _setCurrentStatus() {
      this._current.jwk = typeof this._jwk.kty === 'string' && (this._jwk.kty === 'RSA' || this._jwk.kty === 'EC');
      this._current.der = typeof this._der !== 'undefined' && this._der instanceof Uint8Array && this._der.length > 0;
      this._current.oct = typeof this._oct.key !== 'undefined' && this._oct.key instanceof Uint8Array && this._oct.key.length > 0 && typeof this._oct.namedCurve === 'string';
    } ///////////////////////////////////////////////////////////
    // (pseudo) public methods allowed to be accessed from outside

    /**
     * Wrapper of converter. Imported key must be basically decrypted except the case where the key is exported as-is.
     * @param format {string}: 'jwk', 'pem', 'der' or 'oct'
     * @param options {object}:
     * - options.outputPublic {boolean}: (optional) [format = *]
     *     derive public key from private key when options.outputPublic = true.
     * - options.compact {boolean}: (optional) [format = 'der', 'pem' or 'oct', only for EC key]
     *     generate compressed EC public key.
     * - options.encryptParams {object}: (optional) [format = 'der' or 'pem'] options to generate encrypted der/pem private key.
     *     * encryptParams.passphrase {string}: (mandatory if encOption is specified).
     *          (re-)generate encrypted der/pem with the given passphrase
     *     * encryptParams.algorithm {string}: (optional) 'pbes2' (default), 'pbeWithMD5AndDES-CBC' or 'pbeWithSHA1AndDES'
     *     * encryptParams.prf {string}: (optional) [encOptions.algorithm = 'pbes2'],
     *         'hmacWithSHA256' (default), 'hmacWithSHA384', 'hmacWithSHA512' or 'hmacWithSHA1'
     *     * encryptParams.iterationCount {integer}: 2048 (default)
     *     * encryptParams.cipher {string}: 'aes256-cbc' (default), 'aes128-cbc' or 'des-ede3-cbc'
     * @return {Promise<*>}
     */

  }, {
    key: "export",
    value: function () {
      var _export2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var format,
            options,
            jwkey,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                format = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'jwk';
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};

                if (!(['pem', 'der', 'jwk', 'oct'].indexOf(format) < 0)) {
                  _context.next = 4;
                  break;
                }

                throw new Error('UnsupportedFormat');

              case 4:
                if (!((format === 'der' || format === 'pem') && Object.keys(options).length === 0 && this._isEncrypted === true && this._type === 'private' && this._current.der)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", format === 'pem' ? _jsEncodingUtils.default.formatter.binToPem(this._der, 'encryptedPrivate') : this._der);

              case 6:
                if (!this._isEncrypted) {
                  _context.next = 8;
                  break;
                }

                throw new Error('DecryptionRequired');

              case 8:
                if (!this._current.jwk) {
                  _context.next = 12;
                  break;
                }

                jwkey = this._jwk;
                _context.next = 26;
                break;

              case 12:
                if (!this._current.oct) {
                  _context.next = 18;
                  break;
                }

                _context.next = 15;
                return (0, _converter.toJwkFrom)('oct', this._oct.key, {
                  namedCurve: this._oct.namedCurve
                });

              case 15:
                jwkey = _context.sent;
                _context.next = 25;
                break;

              case 18:
                if (!this._current.der) {
                  _context.next = 24;
                  break;
                }

                _context.next = 21;
                return (0, _converter.toJwkFrom)('der', this._der);

              case 21:
                jwkey = _context.sent;
                _context.next = 25;
                break;

              case 24:
                throw new Error('InvalidStatus');

              case 25:
                this._setJwk(jwkey); // store jwk if the exiting private key is not encrypted


              case 26:
                if (!(format === 'der' || format === 'pem')) {
                  _context.next = 33;
                  break;
                }

                if (typeof options.encryptParams === 'undefined') options.encryptParams = {};
                _context.next = 30;
                return (0, _converter.fromJwkTo)(format, jwkey, {
                  outputPublic: options.outputPublic,
                  compact: options.compact,
                  passphrase: options.encryptParams.passphrase,
                  encOptions: options.encryptParams
                });

              case 30:
                return _context.abrupt("return", _context.sent);

              case 33:
                if (!(format === 'oct')) {
                  _context.next = 39;
                  break;
                }

                _context.next = 36;
                return (0, _converter.fromJwkTo)(format, jwkey, {
                  outputPublic: options.outputPublic,
                  format: options.output,
                  compact: options.compact
                });

              case 36:
                return _context.abrupt("return", _context.sent);

              case 39:
                return _context.abrupt("return", jwkey);

              case 40:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function _export() {
        return _export2.apply(this, arguments);
      };
    }()
    /**
     * Encrypt stored key and set the encrypted key to this instance.
     * @param passphrase {string}
     * @return {Promise<boolean>}
     */

  }, {
    key: "encrypt",
    value: function () {
      var _encrypt = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(passphrase) {
        var options;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this._isEncrypted) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('AlreadyEncrypted');

              case 2:
                options = {
                  encryptParams: {
                    passphrase: passphrase
                  }
                };
                _context2.t0 = this;
                _context2.next = 6;
                return this.export('der', options);

              case 6:
                _context2.t1 = _context2.sent;

                _context2.t0._setAsn1.call(_context2.t0, _context2.t1, 'der');

                return _context2.abrupt("return", true);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function encrypt(_x) {
        return _encrypt.apply(this, arguments);
      };
    }()
    /**
     * Decrypted stored key and set the decrypted key in JWK to this instance.
     * @param passphrase {string}
     * @return {Promise<boolean>}
     */

  }, {
    key: "decrypt",
    value: function () {
      var _decrypt = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(passphrase) {
        var jwkey;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this._isEncrypted) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('NotEncrypted');

              case 2:
                if (!(this._current.der && typeof passphrase === 'string')) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 5;
                return (0, _converter.toJwkFrom)('der', this._der, {
                  passphrase: passphrase
                });

              case 5:
                jwkey = _context3.sent;
                _context3.next = 9;
                break;

              case 8:
                throw new Error('FailedToDecrypt');

              case 9:
                this._setJwk(jwkey);

                return _context3.abrupt("return", true);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function decrypt(_x2) {
        return _decrypt.apply(this, arguments);
      };
    }()
  }, {
    key: "getJwkThumbprint",
    value: function () {
      var _getJwkThumbprint2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4() {
        var alg,
            output,
            _args4 = arguments;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                alg = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 'SHA-256';
                output = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 'binary';

                if (!this._isEncrypted) {
                  _context4.next = 4;
                  break;
                }

                throw new Error('DecryptionRequired');

              case 4:
                _context4.t0 = _thumbprint.getJwkThumbprint;
                _context4.next = 7;
                return this.export('jwk');

              case 7:
                _context4.t1 = _context4.sent;
                _context4.t2 = alg;
                _context4.t3 = output;
                _context4.next = 12;
                return (0, _context4.t0)(_context4.t1, _context4.t2, _context4.t3);

              case 12:
                return _context4.abrupt("return", _context4.sent);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function getJwkThumbprint() {
        return _getJwkThumbprint2.apply(this, arguments);
      };
    }() // getters

  }, {
    key: "keyType",
    get: function get() {
      var _this = this;

      if (this._isEncrypted) throw new Error('DecryptionRequired');
      return new Promise(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee5(resolve, reject) {
          var jwkey;
          return _regenerator.default.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return _this.export('jwk').catch(function (e) {
                    reject(e);
                  });

                case 2:
                  jwkey = _context5.sent;
                  resolve(jwkey.kty);

                case 4:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        return function (_x3, _x4) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "jwkThumbprint",
    get: function get() {
      return this.getJwkThumbprint();
    }
  }, {
    key: "isEncrypted",
    get: function get() {
      return this._isEncrypted;
    }
  }, {
    key: "isPrivate",
    get: function get() {
      return this._type === 'private';
    }
  }, {
    key: "der",
    get: function get() {
      return this.export('der');
    }
  }, {
    key: "pem",
    get: function get() {
      return this.export('pem');
    }
  }, {
    key: "jwk",
    get: function get() {
      return this.export('jwk');
    }
  }, {
    key: "oct",
    get: function get() {
      return this.export('oct', {
        output: 'string'
      });
    }
  }]);
  return Key;
}();

exports.Key = Key;