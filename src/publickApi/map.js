import request from '@lib/request'

export function warehouseMap(){
  return request({
    url:'/webApi/base/warehouse/list'
  })
}

