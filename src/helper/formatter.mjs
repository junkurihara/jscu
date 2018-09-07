/**
 * formatter.mjs
 */

import * as env from './env.mjs';

export async function pemToBin(keydataB64Pem) {
  const keydataB64 = dearmorPem(keydataB64Pem);
  const atob = await env.getEnvAtob();
  const keydataS = atob(keydataB64);
  return stringToArrayBuffer(keydataS);
}

export async function binToPem(keydata, type) {
  const keydataS = arrayBufferToString(keydata);
  const btoa = await env.getEnvBtoa();
  const keydataB64 = btoa(keydataS);
  return formatAsPem(keydataB64, type);
}

export function arrayBufferToHexString(arr){
  const type = Object.prototype.toString.call(arr).slice(8, -1);
  if (!arr || !(type === 'ArrayBuffer' || type === 'Uint8Array')) throw new Error('input arg must be non-null array buffer');
  if (type === 'ArrayBuffer') arr = new Uint8Array(arr);

  let hexStr = '';
  for (let i = 0; i < arr.length; i++) {
    let hex = (arr[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? `0${hex}` : hex;
    hexStr += hex;
  }
  return hexStr;
}

export function hexStringToArrayBuffer(str) {
  if (!str || !(typeof str === 'string')) throw new Error('input arg must be non-null string');
  const arr = [];
  const len = str.length;
  for (let i = 0; i < len; i+=2) arr.push(parseInt(str.substr(i,2),16));
  return new Uint8Array(arr);
}

export function arrayBufferToString(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

export function stringToArrayBuffer(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function formatAsPem(str, type) {
  let typeString;
  if (type === 'public') typeString = 'PUBLIC KEY';
  else if (type === 'private') typeString = 'PRIVATE KEY';
  else if (type === 'certificate') typeString = 'CERTIFICATE';

  let finalString = `-----BEGIN ${typeString}-----\n`;


  while (str.length > 0) {
    finalString += `${str.substring(0, 64)}\n`;
    str = str.substring(64);
  }

  finalString = `${finalString}-----END ${typeString}-----`;

  return finalString;
}

function dearmorPem(str) {
  // const beginRegExp = RegExp('^-----[\s]*BEGIN[^-]*KEY-----$', 'gm');
  // const endRegExp = RegExp('^-----[\s]*END[^-]*KEY-----$', 'gm');
  const beginRegExp = RegExp('^-----[\s]*BEGIN[^-]*-----$', 'gm');
  const endRegExp = RegExp('^-----[\s]*END[^-]*-----$', 'gm');

  // check if the object starts from 'begin'
  try {
    let dearmored = str.split(beginRegExp)[1].split(endRegExp)[0];
    dearmored = dearmored.replace(/\r?\n/g, '');

    return dearmored;
  } catch (e) {
    throw new Error('Invalid format as PEM');
  }
}

