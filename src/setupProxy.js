const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        // Log the request being proxied
        console.log(`Proxying request: ${req.method} ${req.path} -> ${proxyReq.getHeader('host')}${req.path}`);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error', details: err.message });
      }
    })
  );
};
