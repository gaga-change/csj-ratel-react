import React from 'react';
import Sider from '../../component/sider/sider'
import imgSouce from '../../imgSouce/imgSouce'
import { Row, Col } from 'antd';

import './home.scss';
export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 头部数据显示
      dataMsg: [
        {
          icon: imgSouce.home_in,
          hint: '本周入库',
          unitNum: '101',
          pieceNum: '300'
        },
        {
          icon: imgSouce.home_out,
          hint: '本周出库',
          unitNum: '10',
          pieceNum: '300'
        },
        {
          icon: imgSouce.home_repo,
          hint: '商品库存',
          unitNum: '',
          pieceNum: '3000'
        }
      ],
      // 快捷入口
      quickEntry: [
        {
          icon: imgSouce.client_list,
          hint: '客户列表',
          url: ''
        },
        {
          icon: imgSouce.warehousing_business,
          hint: '入库业务',
          url: ''
        },
        {
          icon: imgSouce.outbound_business,
          hint: '出库业务',
          url: ''
        },
        {
          icon: imgSouce.user_management,
          hint: '用户管理',
          url: ''
        },
        {
          icon: imgSouce.change_password,
          hint: '修改密码',
          url: ''
        },
        {
          icon: imgSouce.stock_search,
          hint: '库存查询',
          url: ''
        },
        {
          icon: imgSouce.commodity_management,
          hint: '商品管理',
          url: ''
        },
        {
          icon: imgSouce.role_management,
          hint: '角色管理',
          url: ''
        },
      ]
    }
  }
  componentDidMount() {
    // console.log('mount')
  }
  render () {
    return (
      <div className="Home">
        <Sider history={this.props.history} />
        {/* 头部区域 */}
        <div className="data-items">
          {
            this.state.dataMsg.map((item, index) => (
              <div className="data-item" key={index}>
                <img className="logo" src={item.icon} alt={item.hint} />
                <div className="right-area">
                  <p className="num-area">
                    {item.unitNum && (
                      <span className="num-item">
                        <span className="num">{item.unitNum}</span><span>单</span>
                      </span>
                    )}
                    {item.pieceNum && (
                      <span className="num-item">
                        <span className="num">{item.pieceNum}</span><span>件</span>
                      </span>
                    )}
                  </p>
                  <p className="hint-area">
                    {item.hint}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
        {/* 快捷入口 */}
        <div className="quick-area">
          <h4 className="quick-title">
            快捷入口
          </h4>
          <div className="quick-items">
            <Row>
              {
                this.state.quickEntry.map((item, index) => (
                  <Col xs={24} md={6} key={index}>
                    <div className="quick-item">
                      <img className="quick-logo" src={item.icon} alt={item.hint} />
                      <p className="hint-area">
                        {item.hint}
                      </p>
                    </div>
                  </Col>
                ))
              }
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

