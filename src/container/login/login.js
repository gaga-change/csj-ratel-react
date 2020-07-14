import React from 'react'
import { Spin, } from 'antd'
import { EnvironmentOutlined, MessageOutlined } from '@ant-design/icons';

import imgSouce from 'imgSouce/imgSouce'
import NormalLoginForm from './components/form'
import { login } from 'api'
import { connect } from 'react-redux'
import './login.scss'

const week = ['一', '二', '三', '四', '五', '六', '日',]
class Login extends React.Component {

  state = {
    loginLoding: false,
    version: ''
  }

  componentDidMount() {
    if (window.socket) window.socket.disconnect()
    document.querySelector('body').style.overflow = 'hidden'

    this.setState({ version: process.env.IMAGE_TAG })
  }

  componentWillUnmount() {
    document.querySelector('body').style.overflow = 'auto'
    this.setState = (state, callback) => {
      return
    }
  }

  onSubmit = (json) => {
    this.setState({ loginLoding: true })
    login(json).then(res => {
      this.setState({ loginLoding: false })
      if (res) {
        this.props.history.push('/sys')
      }
    })
  }

  render() {
    const { loginLoding, version } = this.state
    const date = new Date();
    return (
      <div className="Login">
        <div className="login-bg"></div>
        <div className="header-logo" style={{ paddingLeft: '24px' }}>
          <div>
            <img src={imgSouce['logo2']} alt="" />
            <div className="logo_text">
              <h3>川山甲供应链协同平台</h3>
            </div>
            <p>您好，欢迎来到川山甲供应链协同平台！今天是{date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日 星期{week[date.getDay() - 1]}</p>
          </div>
        </div>
        <div className="LoginContaner">
          <main>
            <div className="loginArert">
              <div className="loginArertContaner">
                <div className="loginArert_left">
                  <div className="opcity_loginArert_left"></div>
                </div>
                <div className="loginArert_right">
                  <Spin tip="正在请求登录..." spinning={loginLoding}>
                    <NormalLoginForm onSubmit={this.onSubmit} />
                  </Spin>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className="beian">
          <div className="msg">
            <div className="left-area">
              <div>
                <img src={imgSouce['qrcode']} alt="" />
                <p>官方微信</p>
              </div>

            </div>
            <div className="line"></div>
            <div className="right-area">
              <p> <EnvironmentOutlined className="mr5" /> 地址：浙江省杭州市滨江区川山甲创业园</p>
              <p><MessageOutlined className="mr5" />邮箱：kefu@csjscm.com</p>
            </div>
          </div>
          <div className="version">
            <span className="mr20">
              版权所有：川山甲供应链管理股份有限公司
            </span>
            <a
              href="http://www.beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
            >浙ICP备14018558号-1 </a>
            {/* <span style={{ color: '#000' }}>| 系统版本： {version}</span> */}
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Login)

