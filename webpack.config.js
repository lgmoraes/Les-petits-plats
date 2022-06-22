const path = require('path')
const postcssPresetEnv = require('postcss-preset-env')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const dev = process.argv.indexOf('--mode=development') !== -1

module.exports = {
  entry: {
    polyfill: 'babel-polyfill',
    index: './js/pages/index.js',
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'dist/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Extract CSS in a separate file
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Auto prefixer
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv()],
              },
            },
          },
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'dist/style.css',
    }),
  ],
  devtool: dev ? 'source-map' : false,
  devServer: {
    static: './',
    open: true,
  },
}
