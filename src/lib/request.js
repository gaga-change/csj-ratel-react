import axios from 'axios'
import { message} from 'antd';
import {stringify} from 'qs';
// 创建axios实例
const service = axios.create({
  baseURL: '', 
  timeout: 60000 
})


service.interceptors.response.use(
  response => {
    if(response.status===200){
       if(response.data&&response.data.success){
         return Promise.resolve(response.data)
       } else{
         console.log(response.data.errorMsg)
         message.error((response.data&&response.data.errorMsg)||'请求异常！',2)
         return Promise.reject(response.data)
       }
    } else {
      message.error('请求异常！',2)
      return Promise.reject(response.data)
    } 
  },
  error => {
    message.error('请求异常！',2)
    return Promise.reject(error)
  }
)


function request({ url, method='get',data}){
  let json={method,url};
  if(method==='get'||method==='GET'){
  let stringifyData=stringify(data);
  json['url']=`${url}?${stringifyData}`;
  } else{
    json['data']=data;
  }
  return service(json)
}

export default request
