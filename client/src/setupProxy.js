const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function(app) {
  const http_target = process.env.REACT_APP_SERVICE || '127.0.0.1';
  app.use('/api',
      createProxyMiddleware({
        'target': 'http://' + http_target + ':5000',
        'pathRewrite': {
          '^/api': '',
        },
      },
      ));
  app.use('/mind',
      createProxyMiddleware({
        'target': 'http://' + '127.0.0.1' + ':5020',
        'pathRewrite': {
          '^/mind': '',
        },
      },
      ));
};
