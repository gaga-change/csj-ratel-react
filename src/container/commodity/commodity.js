import React from 'react';
import Sider from '../../component/sider/sider'
import'./commodity.scss'

export default class Commodity extends React.Component {
  render() {
    return (
      <div className="Commodity">
          <Sider history={this.props.history} />
          商品页面正在开发...
      </div>
    );
  }
}

