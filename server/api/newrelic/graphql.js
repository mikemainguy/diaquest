const {createProxyMiddleware} = require("http-proxy-middleware");
module.exports = createProxyMiddleware(
    { target: 'https://api.newrelic.com',
        pathRewrite: {'^/api/newrelic': ''},
    changeOrigin: true});