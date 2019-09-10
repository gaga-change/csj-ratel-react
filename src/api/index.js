import http from './http'
const base = '/webApi'

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
/** 客户列表 */
export const custList = params => http.get(`${base}/base/cust/list`, { params })
/** 分类目录 */
export const skuCategoryTrees = params => http.get(`/api/sku/category/trees`, { params })
/** 客户地址列表 */
export const customerAddrList = params => http.get(`${base}/customer/addr/list`, { params })
/** 客户地址 设置默认 */
export const customerAddrDefault = params => http.get(`${base}/customer/addr/default`, { params })
/** 菜单 列表 */
export const selectAllMenu = params => http.get(`${base}/base/menu/selectAllMenu`, { params })
/** 菜单 删除 */
export const menuDelete = params => http.get(`${base}/base/menu/delete`, { params })
/** 角色 - 菜单 */
export const roleSelectMenus = params => http.get(`${base}/base/role/selectMenus`, { params })

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
/** 客户地址列表 */
export const custAddrList = params => http.post(`${base}/base/custAddr/list`, params)
/** 客户 保存 */
export const customerSave = params => http.post(`${base}/customer/save`, params)
/** 客户地址 保存 */
export const customerAddrSave = params => http.post(`${base}/customer/addr/save`, params)
/** 客户地址 修改 */
export const customerAddrUpdate = params => http.post(`${base}/customer/addr/update`, params)
/** 角色添加权限 */
export const roleAddMenu = params => http.post(`${base}/base/role/addMenu`, params)

/** 删除商品 */
export const skuInfoDel = (ownerCode, skuCode) => http.delete(`${base}/sku/info/delete/${ownerCode}/${skuCode}`)
/** 删除客户 */
export const customerDel = (customerCode) => http.delete(`${base}/customer/del/${customerCode}`)
/** 删除入库业务单 */
export const deleteBusiBill = (billNo) => http.delete(`${base}/in/bill/deleteBusiBill/${billNo}`)
/** 删除供应商 */
export const providerDel = (providerCode) => http.delete(`${base}/provider/del/${providerCode}`)
/** 删除出库业务单 */
export const outBillDel = (billNo) => http.delete(`${base}/out/bill/deleteBusiBill/${billNo}`)

