import request from '@lib/request'

//仓库枚举
export function warehouseMap(){
  return request({
    url:'/webApi/base/warehouse/list'
  })
}

