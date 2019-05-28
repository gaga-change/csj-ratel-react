import axios from 'axios'
import { message } from 'antd'
const base = '/webApi'

// 响应拦截器
axios.interceptors.response.use(function (response) {
  let data = response.data
  if (data.code !== '200') {
    data.errorMsg && message.error(data.errorMsg)
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
