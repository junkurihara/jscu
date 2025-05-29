/**
 * prepare.ts
 */


// Get library name from package name
function getLibraryName() {
  const packageName = 'js-crypto-ec';
  // Convert package name to library name (e.g., js-crypto-hash -> jscu)
  return 'jscu'; // Default library name
}

export const getTestEnv = async () => {
  let envName;
  let message;
  let library;
  console.log(process.env.TEST_ENV);

  if (process.env.TEST_ENV === 'window'){
    if(typeof window !== 'undefined' && typeof (<any>window)[getLibraryName()] !== 'undefined'){
      envName = 'Window';
      library = (<any>window)[getLibraryName()];
      message = '**This is a test with a library imported from window.**';
    }
    else throw new Error('The library is not loaded in window object.');
  }
  else {
    envName = 'Source';
    library = await import('../src/index');
    message = '**This is a test with source codes in src.**';
  }

  return {library, envName, message};
};
