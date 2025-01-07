module.exports = {
    devServer: {
        port: 8080,
        open: true,
        host: "0.0.0.0",
        // proxy: {
        //     '/api': {
        //         target: 'http://43.136.178.202/:8088', // 目标服务器地址
        //         changeOrigin: true, // 是否允许跨域
        //     }
        // },

    }
}