import React from 'react';
import { Spin } from 'antd';
import request from '../../lib/request'
import imgSouce from '../../imgSouce/imgSouce'
import Sider from '../../component/sider/sider'
import NormalLoginForm from './components/form'
import './login.scss'

export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loginLoding:false,
    }
    this.onSubmit=this.onSubmit.bind(this);
  }
  componentDidMount(){
    document.querySelector('body').style.overflow='hidden';
  }
  componentWillUnmount(){
    document.querySelector('body').style.overflow='auto'
  }

  onSubmit(json){
    this.setState({loginLoding:true})
    request({
      method:'post',
      url:'/login',
      data:json
    }).then(res=>{
       this.setState({
         loginLoding:false,
       })
    }).catch(err=>{
       this.setState({loginLoding:false})
    })
  }
  render() {
    const { loginLoding }=this.state;
    return (
      <div className="Login">
          <Sider history={this.props.history} />
          <div className="LoginContaner">
            <main>
               <img src={imgSouce.banner} alt=''/>
               <div className="loginArert">
                  <div className="loginArertContaner">
                      <div className="loginArert_left">
                          <div className="opcity_loginArert_left"></div>
                          <div className="content_loginArert_left">
                            <h3>Welcome!</h3>
                            <h3>川山互动 天下共甲</h3>
                          </div>
                      </div>
                      <div className="loginArert_right">
                        <Spin tip="正在请求登录..." spinning={loginLoding}>
                          <NormalLoginForm onSubmit={this.onSubmit} />
                        </Spin>
                      </div>
                  </div>
               </div>
            </main>
          
            <footer>

            </footer>
          </div>
      </div>
    );
  }
}

