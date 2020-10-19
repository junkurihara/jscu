// Karma configuration
// Generated on Tue Oct 13 2020 22:00:08 GMT+0900 (Japan Standard Time)

module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'dist/**/*.bundle.js'},
      { pattern: 'src/**/*.ts' },
      { pattern: 'test/**/*.ts' },
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'karma-typescript'],
    karmaTypescriptConfig: {
      bundlerOptions: {
        constants: {
          'process.env': (typeof process.env.TEST_ENV !== 'undefined') ? { TEST_ENV: process.env.TEST_ENV } : {},
        },
        addNodeGlobals:{
          Buffer: true
        }
      },
      coverageOptions:{
        exclude: /(test\/.*|\.(d|spec|test)\.ts)/i,
      },
      reports:
        {
          'html': {
            directory: 'coverage',
            subdirectory: 'karma/html'
          },
          'text':'',
          'lcovonly': {
            directory: 'coverage',
            subdirectory: 'karma'
          },
        }
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    // autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['ChromeHeadless'],
    browsers: ['Chrome-headless'],
    customLaunchers: {
      'Chrome-headless': {
        base: 'Chrome',
        flags: ['--headless', '--remote-debugging-port=9222', '--no-sandbox']
      }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
