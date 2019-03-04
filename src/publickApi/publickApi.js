import request from '@lib/request'

export function custList(){
  return request({
    url:'/webApi/base/cust/list'
  })
}

