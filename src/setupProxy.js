const proxy = require("http-proxy-middleware");

// const ip = "http://192.168.2.167:8686" // 修浩
const ip = "http://172.16.81.26:8686" // 苗

module.exports = function (app) {
  app.use(
    proxy(['/webApi', '/login'], { target: ip, changeOrigin: true })
  )
}
