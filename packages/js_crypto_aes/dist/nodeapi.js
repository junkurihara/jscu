"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _params = _interopRequireDefault(require("./params.js"));

/**
 * nodeapi.js
 */
function encrypt(msg, key, _ref, nodeCrypto) {
  var _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'AES-GCM' : _ref$name,
      iv = _ref.iv,
      additionalData = _ref.additionalData,
      tagLength = _ref.tagLength;
  var alg = _params.default.ciphers[name].nodePrefix;
  alg = "".concat(alg, "-").concat((key.byteLength * 8).toString(), "-");
  alg = alg + _params.default.ciphers[name].nodeSuffix;
  var cipher;

  switch (name) {
    case 'AES-GCM':
      {
        cipher = nodeCrypto.createCipheriv(alg, key, iv, {
          authTagLength: tagLength
        });
        cipher.setAAD(additionalData);
        break;
      }

    case 'AES-CBC':
      {
        cipher = nodeCrypto.createCipheriv(alg, key, iv);
        break;
      }

    default:
      throw new Error('UnsupportedCipher');
  }

  var body = new Uint8Array(cipher.update(msg));
  var final = new Uint8Array(cipher.final());
  var tag = new Uint8Array([]);
  if (name === 'AES-GCM') tag = new Uint8Array(cipher.getAuthTag());
  var data = new Uint8Array(body.length + final.length + tag.length);
  data.set(body);
  data.set(final, body.length);
  data.set(tag, body.length + final.length);
  return data;
}

function decrypt(data, key, _ref2, nodeCrypto) {
  var _ref2$name = _ref2.name,
      name = _ref2$name === void 0 ? 'AES-GCM' : _ref2$name,
      iv = _ref2.iv,
      additionalData = _ref2.additionalData,
      tagLength = _ref2.tagLength;
  var alg = _params.default.ciphers[name].nodePrefix;
  alg = "".concat(alg, "-").concat((key.byteLength * 8).toString(), "-");
  alg = alg + _params.default.ciphers[name].nodeSuffix;
  var decipher;
  var body;

  switch (name) {
    case 'AES-GCM':
      {
        decipher = nodeCrypto.createDecipheriv(alg, key, iv, {
          authTagLength: tagLength
        });
        decipher.setAAD(additionalData);
        body = data.slice(0, data.length - tagLength);
        var tag = data.slice(data.length - tagLength);
        decipher.setAuthTag(tag);
        break;
      }

    case 'AES-CBC':
      {
        decipher = nodeCrypto.createDecipheriv(alg, key, iv);
        body = data;
        break;
      }

    default:
      throw new Error('UnsupportedCipher');
  }

  var decryptedBody = decipher.update(body);
  var final;

  try {
    final = decipher.final();
  } catch (e) {
    throw new Error('DecryptionFailure');
  }

  var msg = new Uint8Array(final.length + decryptedBody.length);
  msg.set(decryptedBody);
  msg.set(final, decryptedBody.length);
  return msg;
}