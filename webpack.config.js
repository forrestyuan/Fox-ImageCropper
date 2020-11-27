const path = require('path'); 
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  mode:"development",
  devtool:'eval-source-map',
  entry: {
    index:'./src/js/index.js'
  },
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },

  module:{
    rules:[
      // {test:/\.css$/, use:['style-loader','css-loader']},
      {
        test:/\.css$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
       // 'transform-runtime' 插件告诉 Babel
      // 要引用 runtime 来代替注入。
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins:[
              ["@babel/plugin-proposal-class-properties",{"loose":true}],
              "@babel/plugin-transform-runtime"
            ]
          }
        }
      },
      {
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false
          }
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images/'
            }
          }
        ]
      },
    ]
  },
  plugins:[
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template:"./src/index.html",
      filename:"index.html",
      //压缩html文件
      minify:{
        removeAttributeQuotes:true, // 去除属性引号
        collapseWhitespace:true, //压缩成为一行
      },
      hash:true //添加hash戳
    })
  ],
  devServer:{
    port:3000,
    hot:true,
    host:'0.0.0.0',
    hotOnly:true,
    contentBase:"./dist",
    progress:true,
    compress:true
  }
};