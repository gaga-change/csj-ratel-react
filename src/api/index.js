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
  let message = error.message || ''
  if (message === 'timeout of 1500ms exceeded') message = '请求超时，请稍后再试！'
  message.error(message)
  return Promise.reject(error)
})


const http = {
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


/** 退出登录 */
export const loginOut = params => http.get(`/login_out`, { params })
/** 登录 */
export const login = params => http.post(`/login`, params)
/** 获取商品列表 */
export const skuInfoList = params => http.get(`${base}/sku/info/list`, { params })
/** 用户信息 */
export const userInfo = params => http.get(`${base}/base/user/info`, { params })
/** 获取首页统计数值 */
export const homeTotalNum = params => http.get(`${base}/home/index`, { params })
/** 供应商列表查询 */
export const providerList = params => http.get(`${base}/provider/list`, { params })
/** 客户列表查询 */
export const customerList = params => http.get(`${base}/customer/list`, { params })
/** 供应商地址列表 */
export const providerAddrList = params => http.get(`${base}/provider/addr/list`, { params })
/** 供应商默认地址设置 */
export const providerAddrDefault = params => http.get(`${base}/provider/addr/default`, { params })
/** 供应商默认地址删除 */
export const providerAddrDel = params => http.get(`${base}/provider/addr/del`, { params })
/** 供应商商品信息详情 */
export const skuInfoSelectProDetail = params => http.get(`${base}/sku/info/selectProDetail`, { params })
/** 客户商品信息详情 */
export const skuInfoSelectCustDetail = params => http.get(`${base}/sku/info/selectCustDetail`, { params })
/** 仓库列表 */
export const warehouseList = params => http.get(`${base}/base/warehouse/list`, { params })
/** 获取所有商品 */
export const stockList = params => http.get(`${base}/stock/list`, { params })
/** 添加商品 */
export const skuInfoAdd = params => http.post(`${base}/sku/info/add`, params)
/** 添加供应商 */
export const providerAdd = params => http.post(`${base}/provider/save`, params)
/** 修改供应商 */
export const providerUpdate = params => http.post(`${base}/provider/update`, params)
/** 供应商地址保存 */
export const providerAddrSave = params => http.post(`${base}/provider/addr/save`, params)
/** 供应商地址修改 */
export const providerAddrUpdate = params => http.post(`${base}/provider/addr/update`, params)
/** 新增or修改供应商商品 */
export const skuInfoAddSkuPro = params => http.post(`${base}/sku/info/updateSkuPro`, params)
/** 新增or修改客户商品 */
export const skuInfoAddSkuCustomer = params => http.post(`${base}/sku/info/updateSkuCustomer`, params)
/** 根据供应商筛选商品 */
export const selectSkuByProviderCode = params => http.post(`${base}/sku/info/selectSkuByProviderCode`, params)
/** 创建入库业务单 */
export const saveInBill = params => http.post(`${base}/in/bill/saveInBill`, params)
/** 根据客户筛选商品 */
export const selectSkuByCustomerCode = params => http.post(`${base}/sku/info/selectSkuByCustomerCode`, params)
/** 创建入库业务单 */
export const saveOutBill = params => http.post(`${base}/out/bill/saveOutBill`, params)
/** 删除商品 */
export const skuInfoDel = (ownerCode, skuCode) => http.delete(`${base}/sku/info/delete/${ownerCode}/${skuCode}`)
/** 删除客户 */
export const customerDel = (customerCode) => http.delete(`${base}/customer/del/${customerCode}`)
/** 删除入库业务单 */
export const deleteBusiBill = (billNo) => http.delete(`${base}/in/bill/deleteBusiBill/${billNo}`)
/** s删除供应商 */
export const providerDel = (providerCode) => http.delete(`${base}/provider/del/${providerCode}`)
/** 删除出库业务单 */
export const outBillDel = (billNo) => http.delete(`${base}/out/bill/deleteBusiBill/${billNo}`)
/** 客户地址列表 */
export const custAddrList = params => http.post(`${base}/base/custAddr/list`, params)
/** 客户列表 */
export const custList = params => http.get(`${base}/base/cust/list`, { params })
