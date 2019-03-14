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
         return Promise.resolve(response.data&&response.data.data)
       } else if(response.data&&response.data.code==='ratel-512'){
         if(!window.location.href.includes('web_login')){
           selectMessage('error','用户未登陆或登录失效 !')
           window.location.href=`${window.location.origin}/web_login`
           sessionStorage.clear()
         }
       } else {
         selectMessage('error',`${response.data.errorMsg||'请求异常'},报错接口${response.config.url}`)
         return Promise.reject(response.data)
       }
    } else {
      selectMessage('error',`请求异常,接口${response.config.url}`)
      return Promise.reject(response.data)
    }
  },
  error => {
    selectMessage('error',`请求异常!`)
    return Promise.reject(error)
  }
)

function selectMessage(type,tip){
  let dom=document.querySelector('.ant-message span span');
  if(!dom||!dom.innerHTML===tip){
    message[type](tip,2)
  }
}


function request({ url, method='get',data,...rest}={}){
  let json={method,url,...rest};
  if(method==='get'||method==='GET'){
    let stringifyData=stringify(data);
    if(typeof data === 'object'){
      json['url']=`${url}?${stringifyData}`;
    } else if(typeof data === 'undefined'){
      json['url']=url;
    } else {
      json['url']=`${url}/${data}`;
    }
  } else{
    json['url']=url;
    json['data']=data;
  }
  return service(json)
}

export default request
