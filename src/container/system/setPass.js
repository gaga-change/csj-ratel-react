import React from 'react'
import { Card } from 'antd'
import Sider from '../../component/sider/sider'
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
      this.child.handleRest()
    }).catch(err => {
      this.setState({
        submitLoding: false
      })
    })
  }

  ref = (child) => {
    this.child = child
  }

  render() {
    return (
      <div className="setPass">
        <Sider history={this.props.history} />
        <Card title="修改密码" className="changePass">
          <SetPassForm onSubmit={this.onSubmit} onRef={this.ref} loading={this.state.submitLoding} />
        </Card>
      </div>
    )
  }
}

