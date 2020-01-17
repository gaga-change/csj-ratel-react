import React from 'react'
import { Spin } from 'antd'
import imgSouce from 'imgSouce/imgSouce'
import NormalLoginForm from './components/form'
import { login } from 'api'
import { connect } from 'react-redux'
import './login.scss'

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
    return (
      <div className="Login">
        <div className="header-logo" style={{ paddingLeft: '24px' }}>
          <img src={imgSouce['logo']} alt="" />
          <div className="logo_text">
            <h3>川山甲 货主平台</h3>
            <span>协同供应链 .仓配一体化 .仓储租赁</span>
          </div>
        </div>
        <div className="LoginContaner">
          <main>
            <img src={imgSouce.banner} alt='' />
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
        </div>
        <div className="beian">
          <a
            href="http://www.beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
          >浙ICP备14018558号-1 </a>
          <span style={{ color: '#000' }}>| 系统版本： {version}</span>
        </div>
      </div>
    )
  }
}

export default connect()(Login)

