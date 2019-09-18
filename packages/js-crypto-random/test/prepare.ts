/**
 * prepare.ts
 */
const common = require('../webpack.common.js');

import lib from '../src/index';

interface TestEnv {
  envName: 'Bundle'|'Window'|'Source'|'Source (Not Window)',
  library: typeof lib,
  message: string
}

export const getTestEnv = () : TestEnv => {
  const env: TestEnv = {
    envName: 'Source',
    library: require(`../src/${common.entryName}`),
    message: '**This is a test with source codes in src.**'
  };

  if(process.env.TEST_ENV === 'bundle'){
    env.envName = 'Bundle';
    env.message = '**This is a test with a bundled library**';
    env.library = require(`../dist/${common.bundleName}`);
  }
  else if (process.env.TEST_ENV === 'window'){
    if(typeof window !== 'undefined' && typeof (<any>window)[common.libName] !== 'undefined'){
      env.envName = 'Window';
      env.library = (<any>window)[common.libName];
      env.message = '**This is a test with a library imported from window.**';
    }
    else{
      env.envName = 'Source (Not Window)';
      env.library = require(`../src/${common.entryName}`);
      env.message = '**This is a test with source codes in src.**';
    }
  }

  return env;
};
