const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/scraper/app.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'scraper.js'
  },
  target: 'node',
  externals: [nodeExternals()],
  stats: {
    colors: true
  }
}
