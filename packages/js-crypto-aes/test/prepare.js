/**
 * prepare.js
 */
const common = require('../webpack.common.js');

export function getTestEnv(){
  let envName;
  let message;
  let library;
  if(process.env.TEST_ENV === 'bundle'){
    envName = 'Bundle';
    message = '**This is a test with a bundled library';
    library = require(`../dist/${common.bundleName}`);
  }
  else if (process.env.TEST_ENV === 'window'){
    if(typeof window !== 'undefined' && typeof window[common.libName] !== 'undefined'){
      envName = 'Window';
      library = window[common.libName];
      message = '**This is a test with a library imported from window.**';
    }
    else{
      envName = 'Source (Not Window)';
      library = require(`../src/${common.entryName}`);
      message = '**This is a test with source codes in src.**';
    }
  }
  else {
    envName = 'Source';
    library = require(`../src/${common.entryName}`);
    message = '**This is a test with source codes in src.**';

  }

  return {library, envName, message};
}
