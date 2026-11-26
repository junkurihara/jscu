const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.config.base');

const config = {
  // Bundle the tsc output of `pnpm babel` instead of the TS sources: ts-loader cannot run on
  // TypeScript 7, whose `typescript` package no longer exposes the compiler API.
  entry: ['./dist/index.js'],

  output: {
    filename: `${base.libName}.bundle.js`,
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: path.resolve(__dirname, './dist'),
    library: base.libName,
    libraryTarget: 'umd',
    globalObject: 'this' // for node js import
  },
  resolve: {
    extensions: ['.js', '.jsx' ],
    modules: ['node_modules']
  },
  externals: {
    crypto: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ]
};

module.exports = (env, argv) => {
  config.mode = (typeof argv.mode !== 'undefined' && argv.mode === 'production') ? argv.mode : 'development';

  if (config.mode === 'production') console.log('Webpack for production');
  else{
    console.log('Webpack for development');
    config.devtool = 'inline-source-map'; // add inline source map
  }

  return config;
};
