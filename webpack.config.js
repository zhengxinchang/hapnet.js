
const HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require("path")
module.exports = {
    entry: './test/index.js', //打包文件入口
    output: {               //打包文件出口
        path: path.resolve(__dirname,'./dist'),
        filename: 'hap-net.js'
    },
    devServer: {
        static: path.resolve(__dirname, "./examples"),
        port:7002,
        host:'0.0.0.0'
    },
    mode:"development",
    plugins: [
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./test/index.html'
        }),
    
    ],
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
        parser:{
          dataUrlCondition:{
            maxSize : 100 * 1024 *100
          }
        }
      }
    ]
  }
}