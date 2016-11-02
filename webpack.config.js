const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ENV = process.env.NODE_ENV || 'development';
const ANALYZE = process.env.ANALYZE;

function getPlugins () {
  let plugins = [];

  if (ENV === 'production') {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new webpack.optimize.DedupePlugin()
    );
  } else {
    if (ANALYZE) {
      plugins.push(new BundleAnalyzerPlugin());
    }
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
        loader: 'babel',
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
};
