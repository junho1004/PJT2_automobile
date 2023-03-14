// ws 프로토콜을 사용해야하니 설정해주는 것!
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "ws",
    createProxyMiddleware({
      target: "https://i8c110.p.ssafy.io",
      ws: true,  // 웹소켓을 사용하겠다!
    })
  );
};
