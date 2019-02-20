import React from 'react';
import Sider from '../../component/sider/sider'
import './customer.scss'

export default class Customer extends React.Component {
  render() {
    return (
      <div className="Customer">
         <Sider history={this.props.history} />
          客户业务页面正在开发...
      </div>
    );
  }
}

