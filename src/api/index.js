import axios from 'axios'
import { message } from 'antd'
const base = '/webApi'

// 响应拦截器
axios.interceptors.response.use(function (response) {
  let data = response.data
  // 用户未登录拦截
  if (data.code === 'ratel-512') {
    window.location.href = '/web_login'
  }
  // 系统异常提示（返回的数据为 null）
  else if (data.code !== '200') {
    data.errorMsg && message.warning(data.errorMsg)
    data = null
  }
  return data
}, function (error) {
  return Promise.reject(error);
})
/** 获取商品列表 */
export const skuInfoList = params => axios.get(`${base}/sku/info/list`, { params })
/** 退出登录 */
export const loginOut = params => axios.get(`/login_out`, { params })
/** 登录 */
export const login = params => axios.post(`/login`, params)
/** 添加商品 */
export const skuInfoAdd = params => axios.post(`${base}/sku/info/add`, params)
