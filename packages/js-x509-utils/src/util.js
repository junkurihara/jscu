/**
 * util.js
 */

export const getKeyFromOid = (oid, dict) => Object.keys(dict).filter(
  (key) => dict[key].oid.toString() === oid.toString()
);