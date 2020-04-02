
const webpack = require('webpack')
const path = require('path')
var Client = require('scp2')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
class HelloWorldPlugin {
 constructor (options) {
   this.options = options
 }
 apply (compiler) {
   compiler.hooks.done.tap('done', () => {
     if (process.env.NODE_ENV === 'production') {
 
       Client.scp('dist/', {
           host: '192.168.0.192',
           port: 22,
           username: 'zhaowei',
           password: 'hgw@2019',
           path:process.env.VUE_APP_SERVER_DIR||'/home/zhaowei/erp_test/frontend/'
       }, function(err) {
           if(err){
             console.log(err)
           }else{
             console.log('已上传到测试服务器')
           }
       })
     }
   })
 }
}
module.exports = {
  lintOnSave:false,
  productionSourceMap:false,
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@assets/style/variables.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        return options
      })
  },
  configureWebpack: config => {
    let conf = {
      resolve: {
        alias: {
          '@assets': '@/assets',
          '@imgs': '@/assets/imgs',
          '@c': '@/components',
          '@public': path.resolve(__dirname, './public')
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        }),
        new HelloWorldPlugin()
      ]
    }
    if (process.env.NODE_ENV === 'production') {
      conf.plugins.push(
        new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            })
        );
    }
    return conf
  },
  devServer: { 
    port:8081
 },
}
