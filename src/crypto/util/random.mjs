/**
 * random.mjs
 */
import * as env from './crypto_env.mjs';

import pino from 'pino';
// log options
const logOptions = env.getEnvLogOptions();
const logger = pino(Object.assign(logOptions, {name: 'random'}));


export async function getRandomBytes(len) {
  const crypto = await env.getEnvWebCrypto(); // web crypto api or its implementation on node.js
  const array = new Uint8Array(len);

  if (typeof crypto !== 'undefined' && typeof crypto === 'object' && typeof crypto.getRandomValues === 'function') {
    logger.debug('modern webcrypto is available');
    crypto.getRandomValues(array); // for modern browsers
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