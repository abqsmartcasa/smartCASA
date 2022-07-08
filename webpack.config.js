const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
	entry: './src/index.js',
	optimization: {
		minimize: true,
		minimizer: [ new TerserPlugin() ]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.ejs',
      version: pkg.version,
      sentryDns: 'https://b7c67c111d834a39a1eb96417f76616b@sentry.io/1411397',
      inject: false,
      files: {
        js: ['bundle.js', 'vendor.bundle.js'],
        chunks: {
          vendor: {
            entry: 'vendor.bundle.js'
          },
          bundle: {
            entry: 'bundle.js'
          }
        }
      }
    })
  ],

};
