
const webpack = require('webpack')
const path = require('path')
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
        console.log('Hello World!')
      }
    })
  }
}

module.exports = {
  lintOnSave:false,
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
    return {
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
        new HelloWorldPlugin({ setting: true })
      ]
    }
  }
}
