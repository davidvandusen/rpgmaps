const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

module.exports = {
  devtool: 'source-map',
  entry: {
    edit: path.resolve(__dirname, 'src/edit-index.jsx'),
    play: path.resolve(__dirname, 'src/play-index.jsx')
  },
  output: {
    filename: `[name]-${packageJson.version}.js`,
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
      APP_VERSION: JSON.stringify(packageJson.version)
    })
  ]
};
