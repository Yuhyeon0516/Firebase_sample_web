const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api", {
            // target: "https://us-central1-fir-starter-5ad7c.cloudfunctions.net",
            target: "http://127.0.0.1:5001/fir-starter-5ad7c/us-central1",
            pathRewrite: {
                "^/api": "",
            },
            changeOrigin: true,
        })
    );
};
