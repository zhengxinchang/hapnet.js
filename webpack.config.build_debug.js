
const HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require("path")
const { library } = require('webpack')
module.exports = {
  entry: './src/hapnet.js', //打包文件入口
  output: {               //打包文件出口
    path: path.resolve(__dirname, './web'),
    filename: 'hap-net.js',
    library: {
      // name: 'hap-net',
      type: 'module',
      // export: 'default'
    },
    globalObject: 'this'
  },
  experiments: {
    outputModule: true // 允许 Webpack 生成 ES Module 格式
  },
  // devServer: {
  //     static: path.resolve(__dirname, "./examples"),
  //     port:7002,
  //     host:'0.0.0.0'
  // },
  mode: "production",
  // plugins: [
  //     new HtmlWebpackPlugin({
  //         filename:'index.html',
  //         template:'./test/index.html'
  //     }),
  //
  // ],
  module: {
    rules: [
      {
        test: /\.css$/, //正则表达式，匹配文件类型
        use: [
          { loader: 'style-loader' }, //申明使用什么loader进行处理
          { loader: 'css-loader' }, //申明使用什么loader进行处理
        ]
      },
      {
        test: /\.(svg|eot|woff|ttf|woff2?)$/,
        type: "asset",
        // generator: {
        //   filename: "static/media/[hash:8][ext][query]",
        // },
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024 * 100
          }
        }
      }
    ]
  },
  optimization: {
    minimize: false, // 不压缩代码
    usedExports: true, // 启用 Tree Shaking
    sideEffects: false // 进一步优化未使用的模块
  }

}