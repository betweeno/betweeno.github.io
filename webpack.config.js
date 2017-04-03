// for webpack2

var webpack = require('webpack');
var path = require('path');

var prod = process.argv.indexOf('-p') !== -1;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: '../index.html',
  inject: 'body'
})


var DefinePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify( prod ? 'production' : 'development'),
})

var plugins = prod ?
[
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  DefinePlugin,
  HtmlWebpackPluginConfig
] :
[
  new (webpack.optimize.OccurenceOrderPlugin || webpack.optimize.OccurrenceOrderPlugin)(),
  new (webpack.NoErrorsPlugin || webpack.NoEmitOnErrorsPlugin)(),
  new webpack.HotModuleReplacementPlugin(),
  DefinePlugin,
  HtmlWebpackPluginConfig
];

module.exports = {
  // absolute path
  context: path.resolve(__dirname),

  entry: {
    app: ['babel-polyfill', './setup.js', './src/index.js'],
  },

  output: {
    path: path.resolve(__dirname, './bin'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
        }],
      },

      // Loaders for other file types can go here
    ],
  },

  resolve: {
    modules: [
      './src',
      'node_modules',
    ]
  },

  plugins: plugins,
};
