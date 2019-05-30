import React from 'react'
import { Card, message } from 'antd'
import SetPassForm from './components/setPassForm'
import request from '../../lib/request'
import './style/setPass.scss'

export default class SetPass extends React.Component {

  state = {
    submitLoding: false, // 加载中状态
  }

  onSubmit = (value) => {
    this.setState({
      submitLoding: true
    })
    let user = sessionStorage.getItem('info')
    user = user ? JSON.parse(user) : {}
    request({
      url: '/webApi/base/user/updatePwd',
      method: 'post',
      data: {
        userId: user.id,
        ...value
      }
    }).then(res => {
      message.info('密码修改成功,即将跳转登录页面', 1.5, () => {
        this.setState({
          submitLoding: false
        })
        this.child.handleRest()
        this.props.history.push('/web_login')
      })
    }).catch(err => {
      this.setState({
        submitLoding: false
      })
    })
  }

  ref = (child) => {
    this.child = child
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    return (
      <div className="setPass">
        <Card title="修改密码" className="changePass">
          <SetPassForm onSubmit={this.onSubmit} onRef={this.ref} loading={this.state.submitLoding} />
        </Card>
      </div>
    )
  }
}

