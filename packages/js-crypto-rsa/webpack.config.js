const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.config.base');

const config = {
  entry: ['./src/index.ts'],

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
    extensions: ['.ts', '.tsx', '.js', '.jsx' ],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'webpack.tsconfig.json', // for tree shaking https://mizchi.dev/202006101314-switch-tsconfig-on-webpack
          },
        },
        exclude: path.join(__dirname, 'node_modules') // exclude: /node_modules/
      },
    ],
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
