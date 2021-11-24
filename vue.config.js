module.exports = {
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        proxy: {
            '/api': {
                target: 'https://localhost:5001/', // 对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
    },
    publicPath: './',
}
