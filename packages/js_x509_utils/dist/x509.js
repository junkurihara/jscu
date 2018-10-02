"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromJwk = fromJwk;
exports.toJwk = toJwk;
exports.parse = parse;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _params = _interopRequireDefault(require("./params.js"));

var ecdsa = _interopRequireWildcard(require("./ec.js"));

var _bn = _interopRequireDefault(require("bn.js"));

var _asn = _interopRequireDefault(require("asn1.js-rfc5280"));

var _jsEncodingUtils = _interopRequireDefault(require("js-encoding-utils"));

var _index = _interopRequireDefault(require("js-crypto-random/dist/index.js"));

var _index2 = _interopRequireDefault(require("js-crypto-key-utils/dist/index.js"));

var _buffer = _interopRequireDefault(require("buffer"));

/**
 * x509.js
 */
var Buffer = _buffer.default.Buffer;
/**
 * Convert jwk to X509 pem
 * @param publicJwk
 * @param privateJwk
 * @param format
 * @param options
 * @return {Promise<*>}
 */

function fromJwk(_x, _x2) {
  return _fromJwk.apply(this, arguments);
}
/**
 * Convert X.509 certificate to JWK
 * @param certX509
 * @param format
 * @return {Promise<void>}
 */


function _fromJwk() {
  _fromJwk = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(publicJwk, privateJwk) {
    var format,
        options,
        version,
        rand,
        serialNumber,
        signature,
        issuer,
        current,
        validity,
        subject,
        spkiDer,
        subjectPublicKeyInfo,
        tbsCertificate,
        signatureAlgorithm,
        encodedTbsCertificate,
        signatureValue,
        certBin,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            format = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'pem';
            options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            // default values
            if (typeof options.signature === 'undefined') options.signature = 'ecdsa-with-sha256';
            if (typeof options.days === 'undefined') options.days = 3650;
            if (typeof options.issuer === 'undefined') options.issuer = {
              organizationName: 'Self'
            };
            if (typeof options.subject === 'undefined') options.subject = {
              organizationName: 'Self'
            }; ///////////////////////////////
            // elements of TBSCertificate
            ///////////////////////////////

            version = 0; // default, TODO: other versions?
            // random serial numbers

            _context.next = 9;
            return _index.default.getRandomBytes(20);

          case 9:
            rand = _context.sent;
            // max 20 octets
            serialNumber = new _bn.default(rand);
            signature = {
              algorithm: _params.default.signatureAlgorithms[options.signature].oid
            };
            issuer = {
              type: 'rdnSequence',
              value: setRDNSequence(options.issuer)
            };
            current = Date.now() / 1000 * 1000;
            validity = {
              notBefore: {
                type: 'utcTime',
                value: current
              },
              notAfter: {
                type: 'utcTime',
                value: current + options.days * 86400 * 1000
              }
            };
            subject = {
              type: 'rdnSequence',
              value: setRDNSequence(options.subject)
            };
            spkiDer = Buffer.from(_index2.default.fromJwkTo('der', publicJwk, 'public', {
              compact: false
            })); // {compact: false} is active only for ecc keys

            subjectPublicKeyInfo = _asn.default.SubjectPublicKeyInfo.decode(spkiDer, 'der'); // elements of Certificate

            tbsCertificate = {
              version: version,
              serialNumber: serialNumber,
              signature: signature,
              issuer: issuer,
              validity: validity,
              subject: subject,
              subjectPublicKeyInfo: subjectPublicKeyInfo
            };
            signatureAlgorithm = tbsCertificate.signature; // This must be the same as tbsCertificate.signature field (as specified in RFC).
            // generate signature value

            encodedTbsCertificate = _asn.default.TBSCertificate.encode(tbsCertificate, 'der');

            if (!(privateJwk.kty === 'EC')) {
              _context.next = 27;
              break;
            }

            _context.next = 24;
            return ecdsa.getAsn1Signature(encodedTbsCertificate, privateJwk, options.signature);

          case 24:
            signatureValue = _context.sent;
            _context.next = 32;
            break;

          case 27:
            if (!(privateJwk.kty === 'RSA')) {
              _context.next = 31;
              break;
            }

            throw new Error('RSAUnsupported');

          case 31:
            throw new Error('UnsupportedKeyType');

          case 32:
            // construct Certificate
            certBin = _asn.default.Certificate.encode({
              tbsCertificate: tbsCertificate,
              signatureAlgorithm: signatureAlgorithm,
              signature: signatureValue
            }, 'der');

            if (!(format === 'pem')) {
              _context.next = 37;
              break;
            }

            return _context.abrupt("return", _jsEncodingUtils.default.formatter.binToPem(certBin, 'certificate'));

          case 37:
            if (!(format === 'der')) {
              _context.next = 41;
              break;
            }

            return _context.abrupt("return", certBin);

          case 41:
            throw new Error('InvalidFormatSpecification');

          case 42:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _fromJwk.apply(this, arguments);
}

function toJwk(certX509) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'pem';
  var x509bin;
  if (format === 'pem') x509bin = _jsEncodingUtils.default.formatter.pemToBin(certX509);else if (format === 'der') x509bin = certX509;else throw new Error('InvalidFormatSpecification');
  var binKeyBuffer = Buffer.from(x509bin); // This must be Buffer object to get decoded;

  var decoded = _asn.default.Certificate.decode(binKeyBuffer, 'der'); // decode binary x509-formatted public key to parsed object


  var binSpki = _asn.default.SubjectPublicKeyInfo.encode(decoded.tbsCertificate.subjectPublicKeyInfo, 'der');

  return _index2.default.toJwkFrom('der', binSpki, 'public');
}
/**
 * Parse X.509 certificate and return DER-encoded TBSCertificate and DER encoded signature
 * @param certX509
 * @param format
 * @return {{tbsCertificate: *, signatureValue: *, signatureAlgorithm: *, hash: *}}
 */


function parse(certX509) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'pem';
  var x509bin;
  if (format === 'pem') x509bin = _jsEncodingUtils.default.formatter.pemToBin(certX509);else if (format === 'der') x509bin = certX509;else throw new Error('InvalidFormatSpecification');
  var binKeyBuffer = Buffer.from(x509bin); // This must be Buffer object to get decoded;

  var decoded = _asn.default.Certificate.decode(binKeyBuffer, 'der'); // decode binary x509-formatted public key to parsed object


  var sigOid = decoded.signatureAlgorithm.algorithm;
  var filter = Object.keys(_params.default.signatureAlgorithms).filter(function (name) {
    return _params.default.signatureAlgorithms[name].oid.toString() === sigOid.toString();
  });
  if (filter.length <= 0) throw new Error('UnsupportedSignatureAlgorithm');
  var signatureAlgorithm = filter[0];
  var hash = _params.default.signatureAlgorithms[signatureAlgorithm].hash;

  var binTBSCertificate = _asn.default.TBSCertificate.encode(decoded.tbsCertificate, 'der');

  return {
    tbsCertificate: new Uint8Array(binTBSCertificate),
    signatureValue: new Uint8Array(decoded.signature.data),
    signatureAlgorithm: signatureAlgorithm,
    hash: hash
  };
}
/**
 * Set RDN sequence for issuer and subject fields
 * @param options
 * @return {{type: *, value: *}[][]}
 */


function setRDNSequence(options) {
  var encodedArray = Object.keys(options).map(function (k) {
    if (Object.keys(attributeTypeOIDMap).indexOf(k) < 0) throw new Error('InvalidOptionSpecification');
    var type = attributeTypeOIDMap[k];
    var value;

    if (['dnQualifier, countryName, serialNumber'].indexOf(k) >= 0) {
      if (k === 'countryName' && options[k].length !== 2) throw new Error('InvalidCountryNameCode');
      value = _asn.default.DirectoryString.encode({
        type: 'printableString',
        value: options[k]
      }, 'der');
    } else value = _asn.default.DirectoryString.encode({
      type: 'utf8String',
      value: options[k]
    }, 'der');

    return {
      type: type,
      value: value
    };
  });
  return [encodedArray];
} // https://tools.ietf.org/html/rfc5280#appendix-A


var attributeTypeOIDMap = {
  // X509name DirectoryName
  name: [2, 5, 4, 41],
  surname: [2, 5, 4, 4],
  givenName: [2, 5, 4, 42],
  initials: [2, 5, 4, 43],
  generationQualifier: [2, 5, 4, 44],
  commonName: [2, 5, 4, 3],
  // DirectoryName
  localityName: [2, 5, 4, 7],
  // DirectoryName
  stateOrProvinceName: [2, 5, 4, 8],
  // DirectoryName
  organizationName: [2, 5, 4, 10],
  // DirectoryName
  organizationalUnitName: [2, 5, 4, 11],
  // DirectoryName
  title: [2, 5, 4, 12],
  // DirectoryName
  dnQualifier: [2, 5, 4, 46],
  // PrintableString
  countryName: [2, 5, 4, 6],
  // PrintableString(2)
  serialNumber: [2, 5, 4, 5],
  // PrintableString
  pseudonym: [2, 5, 4, 65],
  // DirectoryName
  domainComponent: [0, 9, 2342, 19200300, 100, 1, 25] // IA5String https://tools.ietf.org/html/rfc4519

};