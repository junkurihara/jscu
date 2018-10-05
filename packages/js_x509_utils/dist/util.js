"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeyFromOid = void 0;

/**
 * util.js
 */
var getKeyFromOid = function getKeyFromOid(oid, dict) {
  return Object.keys(dict).filter(function (key) {
    return dict[key].oid.toString() === oid.toString();
  });
};

exports.getKeyFromOid = getKeyFromOid;