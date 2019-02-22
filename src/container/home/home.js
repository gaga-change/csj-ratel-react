import React from 'react';
import Sider from '../../component/sider/sider'
import imgSouce from '../../imgSouce/imgSouce'

import './home.scss';
export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 头部数据显示
      dataMsg: [
        {
          icon: '',
          hint: '本周入库',
        },
        {
          icon: '',
          hint: '本周出库',
        },
        {
          icon: '',
          hint: '商品库存'
        }
      ],
      // 快捷入口
      quickEntry: [
        {
          icon: '',
          hint: '客户列表',
          url: ''
        },
        {
          icon: '',
          hint: '入库业务',
          url: ''
        },
        {
          icon: '',
          hint: '出库业务',
          url: ''
        },
        {
          icon: '',
          hint: '用户管理',
          url: ''
        },
        {
          icon: '',
          hint: '修改密码',
          url: ''
        },
        {
          icon: '',
          hint: '库存查询',
          url: ''
        },
        {
          icon: '',
          hint: '商品管理',
          url: ''
        },
        {
          icon: '',
          hint: '角色管理',
          url: ''
        },
      ]
    }
  }

  render () {
    return (
      <div className="Home">
        <Sider history={this.props.history} />
        {/* 头部区域 */}
        <div className="data-items">
          {
            this.state.dataMsg.map((item, index) => (
              <div className="data-item" key={index}>{item.hint}</div>
            ))
          }
        </div>
        {/* 快捷入口 */}
        <div className="quick-area">
          <h4 className="quick-title">
            快捷入口
          </h4>
          <div className="quick-items">
            {
              this.state.quickEntry.map((item, index) => (
                <div className="quick-item" key={index}>{item.hint}</div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

