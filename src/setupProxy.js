const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://54.248.66.164:8080',
            changeOrigin: true,
        })
    );
};