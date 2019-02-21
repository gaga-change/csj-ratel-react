import axios from 'axios'
import { message} from 'antd';
import  moment from 'moment'
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
         selectMessage('success','数据请求成功！')
         return Promise.resolve(response.data&&response.data.data)
       } else{
         selectMessage('error','请求异常！')
         return Promise.reject(response.data)
       }
    } else {
      selectMessage('error','请求异常！')
      return Promise.reject(response.data)
    } 
  },
  error => {
    selectMessage('error','请求异常！')
    return Promise.reject(error)
  }
)

function selectMessage(type,tip){
  let dom=document.querySelector('.ant-message span span');
  if(!dom||!dom.innerHTML===tip){
    message[type](tip,2)
  }
}


function request({ url, method='get',data}){
  let json={method,url};
  if(method==='get'||method==='GET'){
  let stringifyData=stringify(data);
  json['url']=`${url}?${stringifyData}&fetchTime=${moment().valueOf()}`;
  } else{
    json['url']=`${url}?fetchTime=${moment().valueOf()}`;
    json['data']=data;
  }
  return service(json)
}

export default request
