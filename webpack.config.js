const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: path.join(path.resolve(__dirname, 'src'), 'main.js'),
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js&/,
        loader: 'babel-loader',
        query: {
          preset: ['env']
        }
      }
    ]
  },
  devtool: 'sourcemaps',
  stats: {
    colors: true
  },
  watch: true
}
