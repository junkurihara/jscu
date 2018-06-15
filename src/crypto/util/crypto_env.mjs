/**
 * crypto_env.mjs
 */

import defaultParams from './params.mjs';

export function dynamicModuleLoad(module) {
  if (Object.keys(module).length === 1 && module.default) module = module.default;  // for node --experimental-modules
  return module;
}

export function getEnvLogOptions () { // TODO add some NODE_ENV options for development and production mode
  let _window; // eslint-disable-line no-unused-vars
  const logOptions = defaultParams.logOptions;
  try { // running on browser
    _window = window;
  } catch (error) { // running on node.js
    delete logOptions.browser;
  }

  return logOptions;
}

export async function getEnvWebCrypto () {
  let _window; // eslint-disable-line no-unused-vars
  let crypto;
  try{ // runnning on browser
    _window = window;
    crypto = window.crypto;
  } catch (error) { //running on node.js
    // crypto = dynamicModuleLoad(await import('node-webcrypto-ossl'));
    // crypto = new crypto();
    crypto = undefined;
  }
  return crypto;
}

export async function getEnvNodeCrypto(){
  if(typeof window !== 'undefined') return undefined;
  else return require('crypto');
}