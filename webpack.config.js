// for webpack2
// https://github.com/Stanko/react-redux-webpack2-boilerplate/blob/master/webpack.config.js

var webpack = require('webpack');
var path = require('path');

var prod = process.argv.indexOf('-p') !== -1;

var PATH = {
  SRC: path.join(__dirname, './src'),
  DEST: path.join(__dirname, './dest'),
  IMG: path.join(__dirname, './src/assets/img'),
}

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DashboardPlugin = require('webpack-dashboard/plugin');
var autoprefixer = require('autoprefixer');

// Plugins
var defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify( prod ? 'production' : 'development'),
  }),
  new HtmlWebpackPlugin({
    template: path.join(PATH.SRC, 'index.html'),
    filename: path.join(__dirname, 'index.html'),
    inject: false,
    alwaysWriteToDisk: true
  }),
  new ExtractTextPlugin({
    filename: '[name].bundle.css',
    allChunks: true,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.js',
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          browsers: [
            'last 3 version',
            'ie >= 10',
          ],
        }),
      ],
      context: PATH.SRC,
    },
  }),
]

var prodPlugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    output: {
      comments: false,
    },
  }),
  new ExtractTextPlugin('style-[hash].css')
]

var devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new DashboardPlugin()
]

var plugins = prod ? defaultPlugins.concat(prodPlugins) : defaultPlugins.concat(devPlugins)

// rules
var defaultRules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
    ],
  },
  {
    test: /\.(png|gif|jpg|svg)$/,
    include: PATH.IMG,
    use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]',
  },
];

var prodRules = [
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader!postcss-loader!sass-loader',
    }),
  }
]

var devRules = [
  {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: [
      'style-loader',
      // Using source maps breaks urls in the CSS loader
      // https://github.com/webpack/css-loader/issues/232
      // This comment solves it, but breaks testing from a local network
      // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
      // 'css-loader?sourceMap',
      'css-loader',
      'postcss-loader',
      'sass-loader?sourceMap',
    ],
  }
]

module.exports = {
  devtool: prod ? 'eval' : 'source-map',

  entry: {
    react: path.join(PATH.SRC, './index.js'),
    vendor: [
      'babel-polyfill',
      'react-dom',
      'react',
      path.join(__dirname, './setup.js'),
    ]
  },

  output: {
    path: PATH.DEST,
    publicPath: '/dest/',
    filename: '[name].js',
  },

  module: {
    rules: prod ? defaultRules.concat(prodRules) : defaultRules.concat(devRules)
  },

  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      PATH.SRC
    ]
  },

  plugins: prod ? defaultPlugins.concat(defaultPlugins) : defaultPlugins.concat(devPlugins),

  devServer: {
    contentBase: prod ? PATH.DEST : PATH.SRC,
    // contentBase: __dirname,
    historyApiFallback: true,
    port: 3000,
    compress: prod,
    inline: !prod,
    hot: !prod,
    host: '0.0.0.0',
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      },
    },
  },
};
