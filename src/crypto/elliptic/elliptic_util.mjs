/**
 * elliptic_util.mjs
 */

import cryptoUtil from '../util/index.mjs';
const curveList = cryptoUtil.defaultParams.curves;
const signatureList = cryptoUtil.defaultParams.signatureAlgorithms;

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

export function getSignatureOid(signatureAlgorithm){
  const oid = signatureList[signatureAlgorithm].oid;
  if(!oid) throw new Error('unsupported signature algorithm');
  return oid;
}

export function getSignatureHash(signatureAlgorithm){
  const hash = signatureList[signatureAlgorithm].hash;
  if(!hash) throw new Error('unsupported signature algorithm');
  return hash;
}