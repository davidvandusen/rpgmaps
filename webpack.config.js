const path = require('path');

module.exports = {
  devtool: "source-map",
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.scss$/,
      include: [path.resolve(__dirname, "styles")],
      use: [{loader: "style-loader"}, {loader: "css-loader"}, {loader: "sass-loader"}]
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [path.resolve(__dirname, "src")],
      query: {presets: ['env']}
    }]
  }
};
