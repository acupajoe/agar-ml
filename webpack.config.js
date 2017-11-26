const path = require('path')
const fs = require('fs')

var nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = [
  {
    entry: {
      neat: path.join(path.resolve(__dirname, 'src/neat/client'), 'main.js'),
      qlearning: path.join(path.resolve(__dirname, 'src/qlearning/client'), 'main.js')
    },
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
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
    }
  },
  {
    entry: {
      'neat-server': path.join(path.resolve(__dirname, 'src/neat/server'), 'server.js'),
      'qlearning-server': path.join(path.resolve(__dirname, 'src/qlearning/server'), 'server.js')
    },
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
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
      ],
      rules: [
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {
              attrs: [':data-src']
            }
          }
        }
      ]
    },
    devtool: 'sourcemaps',
    stats: {
      colors: true
    },
    node: {
      __dirname: true
    },
    externals: nodeModules
  }
]
