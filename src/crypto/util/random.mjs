/**
 * random.mjs
 */
import * as env from './crypto_env.mjs';

import pino from 'pino';
// log options
const logOptions = env.getEnvLogOptions();
const logger = pino(Object.assign(logOptions, {name: 'random'}));

export async function getRandomAsciiString(len) {
  const array = await getRandomBytes(len);
  let finalString = '';

  // Ascii code excluding control characters are in 0x20 -- 0x7e
  for (let i = 0; i < len; i++) {
    array[i] = (array[i] % 0x5e) + 0x20;
    finalString += String.fromCharCode(array[i]);
  }

  return finalString;
}


export async function getRandomBytes(len) {
  const webCrypto = await env.getEnvWebCrypto(); // web crypto api
  const nodeCrypto = await env.getEnvNodeCrypto(); // implementation on node.js
  let array = new Uint8Array(len);

  if (typeof webCrypto !== 'undefined' && typeof webCrypto === 'object' && typeof webCrypto.getRandomValues === 'function') {
    logger.debug('modern webcrypto is available');
    webCrypto.getRandomValues(array); // for modern browsers
  }
  else if (typeof nodeCrypto !== 'undefined' ) { // for node
    logger.debug('node crypto is available');
    array = new Uint8Array(nodeCrypto.randomBytes(len));
  }
  else if (typeof window !== 'undefined' && typeof window.msCrypto === 'object' && typeof window.msCrypto.getRandomValues === 'function') {
    // for legacy ie 11
    logger.debug('mscrypto is available');
    window.msCrypto.getRandomValues(array);
  } else {
    logger.error('web/ms crypto api is not supported and secure random generator is unavailable!');
    throw new Error('web/ms crypto api is not supported and secure random generator is unavailable!');
  }

  return array;
}