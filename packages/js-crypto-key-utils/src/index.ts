/**
 * index
 */

// import {fromJwkTo, toJwkFrom} from './converter.js';
// import {getJwkThumbprint} from './thumbprint.js';
// import {isAsn1Encrypted} from './util.js';
import * as key from './key';

// export default {fromJwkTo, toJwkFrom, getJwkThumbprint, isAsn1Encrypted, Key};
// export {fromJwkTo, toJwkFrom, getJwkThumbprint, isAsn1Encrypted, Key};

export const Key = key.Key;

export default {Key};
