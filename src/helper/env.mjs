/**
 * this module handles the difference between window (browser) and node js for specific functions and libraries.
 * crypto_env.mjs
 */

// export function dynamicModuleLoad(module){
//   if(Object.keys(module).length === 1 && module.default) module = module.default;  // for node --experimental-modules
//   return module;
// }

export async function getEnvBtoa(){
  if(typeof window !== 'undefined') return window.btoa; // browser
  else return nodeBtoa; // node
}

export async function getEnvAtob(){
  if(typeof window !== 'undefined') return window.atob; // browser
  else return nodeAtob; // node
}

const nodeBtoa = (str) => {
  const Buffer = require('Buffer').Buffer;
  let buffer;
  if (Buffer.isBuffer(str)) {
    buffer = str;
  }
  else {
    buffer = new Buffer(str.toString(), 'binary');
  }

  return buffer.toString('base64');
};

const nodeAtob = (str) => {
  const Buffer = require('Buffer').Buffer;
  return new Buffer(str, 'base64').toString('binary');
};