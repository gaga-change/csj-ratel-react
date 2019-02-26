import React from 'react';
import { Card } from 'antd';
import Sider from '../../component/sider/sider'
import SetPassForm from './components/setPassForm'
import './style/setPass.scss'

export default class SetPass extends React.Component {
  render() {
    return (
      <div className="setPass">
          <Sider history={this.props.history}/>
          <Card title="修改密码" className="changePass">
             <SetPassForm/>
          </Card>
      </div>
    );
  }
}

