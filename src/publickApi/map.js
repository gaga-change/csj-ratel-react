import request from '@lib/request'

export function arrivalMap(){
  return request({
    url:'/webApi/base/cust/list'
  })
}