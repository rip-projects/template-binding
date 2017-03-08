const BabiliPlugin = require('babili-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';

function getPlugins () {
  let plugins = [];

  if (ENV === 'production') {
    plugins.push(
      new BabiliPlugin()
    );
  }

  return plugins;
}

module.exports = {
  entry: './index.js',
  output: {
    path: './dist',
    filename: ENV === 'production' ? 't.min.js' : 't.js',
  },
  devtool: 'source-map',
  plugins: getPlugins(),
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       exclude: /(node_modules|bower_components)/,
  //       use: {
  //         loader: 'babel-loader',
  //         query: {
  //           presets: [ 'babel-presets-es2015' ],
  //           cacheDirectory: true,
  //         },
  //       },
  //     },
  //   ],
  // },
};
