const path = require('path');
const fs = require('fs');

const entry = {};

fs.readdirSync(path.resolve(__dirname, 'demo')).forEach(demoName =>
  entry[demoName] = path.resolve(__dirname, 'demo', demoName, 'index.js')
);

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.scss$/,
      include: [path.resolve(__dirname, 'styles')],
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'demo')
      ],
      loader: 'babel-loader'
    }]
  }
};
