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
  }

  componentDidMount() {
    document.querySelector('body').style.overflow = 'hidden'
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
    const { loginLoding } = this.state
    return (
      <div className="Login">
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
      </div>
    )
  }
}

export default connect()(Login)

