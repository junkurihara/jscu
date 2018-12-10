/**
 * util.js
 */

/**
 *
 * @param {Array} oid - ASN.1 object identifier.
 * @param {Object} dict - dictionary to be searched.
 * @returns {string[]} - Returns array of keys that match the oid.
 */
export const getKeyFromOid = (oid, dict) => Object.keys(dict).filter(
  (key) => dict[key].oid.toString() === oid.toString()
);