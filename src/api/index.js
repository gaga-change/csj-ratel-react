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
/** 用户信息 */
export const userInfo = params => axios.get(`${base}/base/user/info`, { params })
/** 获取首页统计数值 */
export const homeTotalNum = params => axios.get(`${base}/home/index`, { params })
/** 供应商列表查询 */
export const providerList = params => axios.get(`${base}/provider/list`, { params })
/** 供应商地址列表 */
export const providerAddrList = params => axios.get(`${base}/provider/addr/list`, { params })
/** 登录 */
export const login = params => axios.post(`/login`, params)
/** 添加商品 */
export const skuInfoAdd = params => axios.post(`${base}/sku/info/add`, params)
/** 添加供应商 */
export const providerAdd = params => axios.post(`${base}/provider/save`, params)
/** 修改供应商 */
export const providerUpdate = params => axios.post(`${base}/provider/update`, params)
/** 供应商地址保存 */
export const providerAddrSave = params => axios.post(`${base}/provider/addr/save`, params)
/** 供应商地址修改 */
export const providerAddrUpdate = params => axios.post(`${base}/provider/addr/update`, params)
/** 删除商品 */
export const skuInfoDel = skuId => axios.delete(`${base}/sku/info/delete/${skuId}`)

