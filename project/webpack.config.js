var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'eval',
  watch: true,
  //devtool: 'source-map',
  debug: true,
  // entry: {
    // app: './webapp/scripts/main.react.js',
  // },
  // output: {
    // filename: 'dist/scripts/main.react.js',
  // },
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './webapp/scripts/main.react.js'
  ],
  output: {
    path: path.join(__dirname, 'dist', 'scripts'),
    filename: 'scripts/main.react.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/vertx/)//, // https://github.com/webpack/webpack/issues/353
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.optimize.OccurenceOrderPlugin()//,
    //new webpack.optimize.AggressiveMergingPlugin()
  ],
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {test: /.*\.json$/, loader: 'json'},
      {test: /.*\.md$/, loader: 'file'},
      {test: /\.css$/, loader: 'style-loader!css-loader' },
      {test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: 'file-loader'},
      {test: /\.styl$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus')},
      {test: /\.jsx|\.react\.js$/, exclude: /node_modules/, loaders: ['react-hot-loader', 'babel-loader']}//,
      //{test: /\.jsx$|\.js$/, exclude: /node_modules/, loader: 'babel-loader'}//,//'jsx-loader?harmony' }
      // {
        // test: /\.react\.js?$/,
        // loaders: ['react-hot', 'babel'],
        // include: path.join(__dirname, 'webapp', 'scripts')
      // }]
    ]
  }
};
