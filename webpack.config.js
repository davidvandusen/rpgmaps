const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    filename: 'bundle.js',
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
  }
};
