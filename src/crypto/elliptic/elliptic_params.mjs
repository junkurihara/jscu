/**
 * elliptic_params.mjs
 */


export const curveList = {
  'P-256': {name: 'p256', payloadSize: 32, oid: [1, 2, 840, 10045, 3, 1, 7]},
  'P-384': {name: 'p384', payloadSize: 48, oid: [1, 3, 132, 0, 34]},
  'P-521': {name: 'p521', payloadSize: 66, oid: [1, 3, 132, 0, 35]}
};
