const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/token", {
            target: "https://nid.naver.com",
            pathRewrite: {
                "^/token": "",
            },
            changeOrigin: true,
        })
    );

    app.use(
        createProxyMiddleware("/profile", {
            target: "https://openapi.naver.com",
            pathRewrite: {
                "^/profile": "",
            },
            changeOrigin: true,
        })
    );
};
