// Karma configuration
// Generated on Wed Jun 13 2018 13:09:34 GMT+0900 (JST)

const webpackConfig = require('./webpack.config.js');
const babelExtraPlugins = ['babel-plugin-istanbul'];
const getWebpackConfig = () => {
  const config = webpackConfig(null, {mode: 'development'});
  config.mode = 'development';
  delete config.entry;
  delete config.output;
  delete config.plugins;

  config.module.rules = config.module.rules.map( (elem) => {
    if(elem.use[0].loader === 'babel-loader'){
      elem.use[0].options.plugins.push(...babelExtraPlugins);
    }
    return elem;
  });

  return config;
};


module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'test/**/*.spec.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/**/*.js': ['coverage'],
      './test/**/*.spec.js': ['webpack']
    },
    // TODO Merge with webpack.config.js
    webpack: getWebpackConfig(),

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],
    coverageReporter: { type: 'lcov' },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],
    // browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};

