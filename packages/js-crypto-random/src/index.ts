/**
 * index.js
 */

import * as random from './random';

export const getRandomBytes = random.getRandomBytes;
export const getRandomAsciiString = random.getRandomAsciiString;
export const getRandomString = random.getRandomString;
export const getRandomSampledString = random.getRandomSampledString;

export default {getRandomBytes, getRandomAsciiString, getRandomString, getRandomSampledString};
