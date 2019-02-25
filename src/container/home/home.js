import React from 'react';
import {connect} from 'react-redux';
import  { Link }  from  'react-router-dom';
import { depthForEachIndex } from '@lib/lib'
import Sider from '../../component/sider/sider'
import imgSouce from '../../imgSouce/imgSouce'
import { priceChange_config } from './components/config'
import { Row, Col } from 'antd';

import './home.scss';

@connect(
  state=>state.menus
)

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
      ]
    }
  }

  render () {
    const menu=depthForEachIndex(this.props.menus);
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
                menu.map((item, index) => (
                  <Col xs={24} md={6} key={index}>
                   <Link to={item.path} replace >
                      <div className="quick-item">
                          <img className="quick-logo" src={imgSouce[item.icon]} alt={item.name} />
                          <p className="hint-area">
                            {item.name}
                          </p>
                      </div>
                    </Link>
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

