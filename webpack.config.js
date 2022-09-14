
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
}