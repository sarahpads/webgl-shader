const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'file-loader'
        }
      },

      {
        test: /\.glsl$/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin()
  ]
};