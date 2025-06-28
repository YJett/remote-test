const name = "test"; // 标题
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8071,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/api', // 对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      '/kg-api': {
        target: `http://localhost:8082`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + '/kg-api']: ""
        }
      },
      // 修改Flask后端代理配置
      '/flask-api': {
        target: 'http://202.120.84.249:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/flask-api': ''
        }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  publicPath: './'
}