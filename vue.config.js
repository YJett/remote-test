const name = "test"; // 标题
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
  }
module.exports = {
    devServer: {
        open: true,
        host: 'localhost',
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
              }
        },
    },
    configureWebpack: {
        name: name,
        resolve: {
          alias: {
            "@": resolve("src")
          }
        }
      },
    publicPath: './',
}
