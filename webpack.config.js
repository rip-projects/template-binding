const webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'development';

function getPlugins () {
  let plugins = [];

  if (ENV === 'production') {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    );
  }

  return plugins;
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: ENV === 'production' ? 't.min.js' : 't.js',
  },
  devtool: 'source-map',
  plugins: getPlugins(),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: require.resolve('babel-loader'),
        query: {
          presets: ['es2015'],
          cacheDirectory: true,
        },
      },
    ],
  },
};
