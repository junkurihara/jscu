/**
 * prepare.ts
 */

const base = require('../webpack.config.base');


export const getTestEnv = () => {
  let envName;
  let message;
  let library;
  console.log(process.env.TEST_ENV);

  if (process.env.TEST_ENV === 'window'){
    if(typeof window !== 'undefined' && typeof (<any>window)[base.libName] !== 'undefined'){
      envName = 'Window';
      library = (<any>window)[base.libName];
      message = '**This is a test with a library imported from window.**';
    }
    else throw new Error('The library is not loaded in window object.');
  }
  else {
    envName = 'Source';
    library = require('../src/index');
    message = '**This is a test with source codes in src.**';
  }

  return {library, envName, message};
};
