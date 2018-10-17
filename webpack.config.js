/**
 * webpack.config.js
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

// port babelrc from .babelrc
const getBabelWebOpt = () => {
  const pluginExclude = []; // add here node-specific plugins
  const envBrowserTargets = [
    'last 2 chrome versions',
    'last 2 firefox versions',
    'IE 11',
    'last 2 Edge versions'
  ];
  const babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
  babelrc.babelrc = false;
  babelrc.presets = babelrc.presets.map( (elem) => {
    if (elem instanceof Array){
      if(elem[0] === '@babel/preset-env'){
        elem[1].targets.browsers = envBrowserTargets;
        elem[1].modules = false; // for browsers. if true, import statements will be transpiled to CommonJS 'require', and webpack tree shaking doesn't work.
      }
    }
    return elem;
  });
  babelrc.plugins = babelrc.plugins.filter( (elem) => pluginExclude.indexOf(elem) < 0);
  return babelrc;
};

const webConfig = {
  target: 'web',
  entry: {
    jscu: ['./src/index.js'],
    // test: ['./test/api.hkdf.spec.ms']
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: path.resolve(__dirname, 'dist'),
    library: 'jscu',
    libraryTarget: 'umd',
    globalObject: 'this' // for node js import
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(m|)js$/,
        use: [{
          loader: 'babel-loader',
          options: getBabelWebOpt()
        }],
        exclude: path.join(__dirname, 'node_modules') // exclude: /node_modules/
      }
    ]
  },
  plugins:[
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 1000}),

  ],
  externals: {
    'crypto': true
  },
  node: {
    fs: 'empty'
  }
};

module.exports = (env, argv) => {
  const config = webConfig;
  if (argv.mode === 'development'){
    config.devtool = 'inline-source-map'; // add inline source map
    Object.assign(config.entry, {
      'encrypt': ['./test/api.encrypt.spec.js'],
      'sign': ['./test/api.sign.spec.js']
    });
  }
  // else if(argv.mode === 'production'){
  // }
  return config;
};