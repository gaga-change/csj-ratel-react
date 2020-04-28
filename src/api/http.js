import axios from 'axios'
import { message } from 'antd'

// 响应拦截器
axios.interceptors.response.use(function (response) {
  let data = response.data
  // 用户未登录拦截
  if (data.code === 'ratel-512') {
    window.location.href = '/web_login'
  }
  else if (~['ratel-40620008'].findIndex(v => v === data.code)) {
    // 白名单
  }
  // 系统异常提示（返回的数据为 null）
  else if (data.code !== '200') {
    data.errorMsg && message.warning(data.errorMsg)
    data = null
  }
  return data
}, function (error) {
  let data = error.response.data
  let msg = data.message || error.message || ''
  if (msg === 'timeout of 1500ms exceeded')
    msg = '请求超时，请稍后再试！'
  message.error(msg)
  return Promise.reject(error)
})


export default {
  get(...params) {
    return axios.get(...params).then(res => res).catch(err => null)
  },
  post(...params) {
    return axios.post(...params).then(res => res).catch(err => null)
  },
  delete(...params) {
    return axios.delete(...params).then(res => res).catch(err => null)
  },
  put(...params) {
    return axios.put(...params).then(res => res).catch(err => null)
  }
}
