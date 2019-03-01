import React from 'react';
import {connect} from 'react-redux';
import request from '@lib/request'
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
      Total_dataSource:{}
    }
  }

  componentDidMount(){
    request({
      url:'/webApi/home/index',
    }).then(res=>{
      this.setState({Total_dataSource:res})  
    }).catch(err=>{
      console.log(err)
    })
  }

  render () {
    const menu=depthForEachIndex(this.props.menus);
    const { Total_dataSource }=this.state;
    return (
      <div className="Home">
        <Sider history={this.props.history} />
        {/* 头部区域 */}
        <div className="data-items">
          {
            priceChange_config.map((item, index) => (
              <div className="data-item" key={index}>
                <img className="logo" src={imgSouce[item.icon]} alt={item.name} />
                <div className="right-area">
                  <p className="num-area">
                    {
                      Total_dataSource&&Total_dataSource[item.orderNumber_dataIndex]!==undefined?(
                      <span className="num-item">
                        <span className="num">{Total_dataSource[item.orderNumber_dataIndex]}</span><span>单</span>
                      </span>
                     ):null
                    }
                    {
                       Total_dataSource&&Total_dataSource[item.orderPiece_dataIndex]!==undefined?(
                      <span className="num-item">
                        <span className="num">{Total_dataSource[item.orderPiece_dataIndex]}</span><span>件</span>
                      </span>
                     ):null
                    }
                  </p>
                  <p className="hint-area">
                    {item.name}
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

