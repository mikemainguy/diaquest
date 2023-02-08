const {createProxyMiddleware} = require("http-proxy-middleware");
module.exports = createProxyMiddleware({ target: 'https://api.newrelic.com', changeOrigin: true});