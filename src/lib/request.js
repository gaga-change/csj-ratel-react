import axios from 'axios'
import { message} from 'antd';
// 创建axios实例
const request = axios.create({
  baseURL: '', 
  timeout: 60000 
})

request.interceptors.response.use(
  response => {
    if(response.status===200){
       if(response.data&&response.data.success){
         return Promise.resolve(response.data)
       } else{
         message.error(response.data&&response.data.errorMsg|'请求异常！',2)
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

export default request
