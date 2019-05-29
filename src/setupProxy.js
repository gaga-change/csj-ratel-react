const proxy = require("http-proxy-middleware");

// const ip = "http://192.168.2.167:8686" // 修浩
// const ip = "http://172.16.81.26:8686" // 苗
const ip = "http://192.168.2.126:8686" // 雷
// 

module.exports = function (app) {
  app.use(
    proxy(['/webApi', '/login', '/api'], { target: ip, changeOrigin: true })
  )
}
