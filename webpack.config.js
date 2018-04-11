var path = require('path')
var webpack = require('webpack')
const vuxLoader = require('vux-loader')
let webpackConfig = {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: 'dist/',
      filename: 'build.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ],
        },      {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
            }
            // other vue-loader options go here
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        },
        {
              test: /\.less$/,

              loader: "style-loader!css-loader!less-loader",
          },
          {
            test: /\.(png|jpg|gif|svg|woff|ttf|eot|woff2)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
        },
          {
            test: /vux.src.*?js$/,
            loader: 'babel'
          }

      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ['*', '.js', '.vue', '.json','.less']
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true
    },
    performance: {
      hints: false
    },
    // devtool: '#cheap-module-source-map'
}

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [{name:'vux-ui'},{name: 'duplicate-style'}]
})

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
