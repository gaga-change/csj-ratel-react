const proxy = require("http-proxy-middleware");

// let ip = "http://192.168.2.167:8686" // 修浩
// let ip = "http://172.16.81.26:8686" // 苗
// let ip = "http://172.16.81.219:8686" // 龙
// let ip = "http://192.168.2.126:8686" // 雷
let ip = "http://testratel.csjmro.com" // 测试环境
// let ip = "http://ratel.csjmro.com" // 正式环境

try {
  let df = require('./setupProxy_default.js')
  ip = df.ip
} catch (err) { }


module.exports = function (app) {
  app.use(
    proxy(['/webApi', '/login', '/api'], { target: ip, changeOrigin: true })
  )
}
