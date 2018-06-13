/**
 * encoder.mjs
 */

import * as env from './env.mjs';

export async function encodeBase64Url(data) {
  let str = '';
  if (typeof data === 'string') {
    str = data;
  }
  else if (data instanceof Uint8Array) {
    str = String.fromCharCode.apply(null, data);
  }
  const btoa = await env.getEnvBtoa();
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function decodeBase64Url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // str = str + "=".repeat(str.length % 4); // this sometimes causes error...
  const atob = await env.getEnvAtob();
  const binary = atob(str);
  let data = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    data[i] = binary.charCodeAt(i);
  }

  data = getAsciiIfAscii(data);

  return data;
}

function getAsciiIfAscii(data) {
  if (data instanceof Uint8Array) {
    let flag = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > 0x7e || (data[i] < 0x20 && data[i] !== 0x0d && data[i] !== 0x0a)) {
        flag = false;
        break;
      }
    }
    let returnData = null;
    if (flag) {
      returnData = '';
      for (let i = 0; i < data.length; i++) returnData += String.fromCharCode(data[i]);
    }
    else returnData = data;
    return returnData;
  }
  else throw new Error('input data must be uint8array');
}
