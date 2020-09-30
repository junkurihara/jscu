/**
 * webpack.dev.js
 */
const common = require('./webpack.common.js');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');
const jsdom = require('jsdom');

const path = require('path');

// webpack main configration
const webpackConfig = {
  mode: 'development',
  plugins:[
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 1000}),
    new webpack.DefinePlugin({
      'process.env': {
        TEST_ENV: JSON.stringify(process.env.TEST_ENV),
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [ path.resolve(__dirname, 'test') ],
        enforce: 'post',
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        }
      }
    ]
  },
  devtool: 'inline-source-map' // add inline source map
};

// export main configuration adjusted to various environments
module.exports = (env, argv) => {
  if (argv.mode !== 'development') throw new Error('Not development mode!!');
  ////////////////////////////////////////////////////////////////////////
  // library build setting
  const config = merge.merge(common.webpackConfig, webpackConfig);

  ////////////////////////////////////////////////////////////////////////
  // test bundle build setting
  if(process.env.TEST_ENV){

    // when NODE_ENV = html is set, only test bundles are generated.
    // this is only the case where the bundled js files are generated for test using html file.
    // NOTE Karma does not refer to config.entry, and it pre-process the spec files written in karma.conf.js
    if(process.env.NODE_ENV === 'html'){
      config.entry = getEntriesForHTMLTest(config);
      createNewHtml(config.entry); // Edit HTML here
    }

    // for require through dynamic variables in webpack
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        RegExp('./src'), RegExp(common.entryName)// only src/index.js is allowed to get imported.
      ),
      new webpack.ContextReplacementPlugin(
        RegExp('./dist'), RegExp(common.bundleName)// only dist/xxx.bundle.js is allowed to get imported.
      )
    );
  }

  return config;
};

const typeList = {
  source: {filePrefix: ''},
  bundle: {filePrefix: 'fromBundled'},
  window: {filePrefix: 'fromWindow'},
};
const testHtmlName = './test/html/test.html';

// get test file names for test with static html
function getEntriesForHTMLTest (config) {
  const parentDir = './test';
  const testFiles = getFilteredFileList(parentDir, new RegExp('.*\\.spec\\.ts$'));

  config.entry = {};
  testFiles.map( (file) => {
    const prefix = file.slice(0, -8);
    config.entry[`.${parentDir}/html/${prefix}`] = [ `${parentDir}/${file}` ];
  });

  if(process.env.TEST_ENV === 'bundle'){
    const newEntry = {};
    Object.keys(config.entry).map( (key) => {
      const newKey = `${key}.${typeList['bundle'].filePrefix}`;
      newEntry[newKey] = config.entry[key];
    });
    config.entry = newEntry;
  }
  else if(process.env.TEST_ENV === 'window'){
    const newEntry = {};
    Object.keys(config.entry).map( (key) => {
      const newKey = `${key}.${typeList['window'].filePrefix}`;
      newEntry[newKey] = config.entry[key];
    });
    config.entry = newEntry;
  }
  return config.entry;
}

function createNewHtml(newEntry){
  // list new test bundle files
  const files = Object.keys(newEntry).map( (elem) => {
    const x = elem.split('/');
    return `${x[x.length-1]}.bundle.js`;
  });

  // filter existing test bundle files
  const newList = getFilteredFileList('./test/html', new RegExp('.*\\.bundle\\.js$'));

  // merge existing and new file lists
  files.map( (f) => { if (newList.indexOf(f) < 0) newList.push(f); });

  // create dom
  const domForTest= new jsdom.JSDOM(testHtmlTemplate);

  // import test bundle files
  newList.map( (f) => {
    const p = domForTest.window.document.createElement('p');

    // get test bundle file type
    const type = (f.match(/Bundled/)) ? 'bundle'
      : (f.match(/Window/)) ? 'window' : 'source';

    // window import
    if (type === 'window') {
      const bundleScript = domForTest.window.document.createElement('script');
      bundleScript.src = `../../dist/${common.bundleName}`;
      p.appendChild(bundleScript);
    }

    // script import
    const script = domForTest.window.document.createElement('script');
    script.src = `./${f}`;
    p.appendChild(script);
    domForTest.window.document.body.querySelector('#test').appendChild(p);
  });

  // generate html
  const html = domForTest.window.document.documentElement.outerHTML;
  fs.writeFileSync(testHtmlName, html, 'utf8');
}

function getFilteredFileList(parentDir, fileRegExp){
  const files = fs.readdirSync(parentDir);
  return files.filter((file) => fs.statSync(`${parentDir}/${file}`).isFile() && fileRegExp.test(file));
}

const testHtmlTemplate =
  '<!DOCTYPE html>\n' +
  '<html lang="en">\n' +
  '<head>\n' +
  '  <meta charset="UTF-8">\n' +
  '  <title>Title</title>\n' +
  '  <link href="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css" rel="stylesheet" />\n' +
  '  <script src="../../node_modules/@babel/polyfill/browser.js"></script>\n' +
  '</head>\n' +
  '<body>\n' +
  '<div id="mocha"></div>\n' +
  '<script src="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.js"></script>\n' +
  '<script>mocha.setup(\'bdd\')</script>\n' +
  '<div id="test"></div>\n' +
  '<script>mocha.run();</script>\n' +
  '</body>\n' +
  '</html>';
