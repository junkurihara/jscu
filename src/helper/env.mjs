/**
 * this module handles the difference between window (browser) and node js for specific functions and libraries.
 * crypto_env.mjs
 */

export function dynamicModuleLoad(module){
  if(Object.keys(module).length === 1 && module.default) module = module.default;  // for node --experimental-modules
  return module;
}

export async function getEnvBtoa(){
  let _window; // eslint-disable-line no-unused-vars
  let btoa;
  try { // running on browser
    _window = window;
    btoa = window.btoa;
  } catch (error) { // running on node.js
    btoa = dynamicModuleLoad(await import('btoa'));
  }
  return btoa;
}

export async function getEnvAtob(){
  let _window; // eslint-disable-line no-unused-vars
  let atob;
  try { // running on browser
    _window = window;
    atob = window.atob;
  } catch (error) { // running on node.js
    atob = dynamicModuleLoad(await import('atob'));
  }
  return atob;
}
