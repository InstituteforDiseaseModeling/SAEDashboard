const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function(app) {
  const http_target = process.env.REACT_APP_SERVICE || 'localhost';
  app.use('/api',
      createProxyMiddleware({
        'target': 'http://' + http_target + ':5000',
        'pathRewrite': {
          '^/api': '',
        },
      },
      ));
};
