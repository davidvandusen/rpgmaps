const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

module.exports = {
  entry: {
    edit: path.resolve(__dirname, 'src/edit-index.jsx'),
    play: path.resolve(__dirname, 'src/play-index.jsx')
  },
  output: {
    filename: `[name]-${packageJson.version}.min.js`,
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.scss$/,
      include: [path.resolve(__dirname, 'styles')],
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.jsx?$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_AUTHOR: JSON.stringify(packageJson.author),
      APP_DESCRIPTION: JSON.stringify(packageJson.description),
      APP_VERSION: JSON.stringify(packageJson.version),
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  ]
};
