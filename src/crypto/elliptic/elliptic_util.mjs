/**
 * elliptic_util.mjs
 */

import cryptoUtil from '../util/index.mjs';
const curveList = cryptoUtil.defaultParams.curves;

export function getCurveName(algoCurve) {
  const curve = curveList[algoCurve].name;
  if (!curve) throw new Error('unsupported curve is specified');
  return curve;
}

export function getPayloadSize(algoCurve) {
  const size = curveList[algoCurve].payloadSize;
  if (!size) throw new Error('unsupported curve is specified');
  return size;
}

export function getCurveList(){
  return curveList;
}