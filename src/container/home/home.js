import React from 'react'
import { Link } from 'react-router-dom'
import imgSouce from 'imgSouce/imgSouce'
import { priceChange_config } from './components/config'
import { Row, Col } from 'antd'
import { connect } from 'react-redux'
import { homeTotalNum, messageTotalNum } from 'api'
import './home.scss'
const quickItemText = {
  '/warehousing': {
    text: '入库业务',
    icon: 'warehousing_business',
  },
  '/outgoing': {
    text: '出库业务',
    icon: 'outbound_business',
  },
  '/commodity': {
    text: '商品管理',
    icon: 'commodity_management',
  },
  '/stock': {
    text: '库存查询',
    icon: 'stock_search',
  },
  '/customer': {
    text: '客户列表',
    icon: 'commodity_management',
  },
  '/provider': {
    text: '供应商管理',
    icon: 'commodity_management',
  },
  '/system/role': {
    text: '角色管理',
    icon: 'role_management',
  },
  '/system/user': {
    text: '用户管理',
    icon: 'user_management',
  },
  // '/system/setPass': {
  //   text: '修改密码',
  //   icon: 'change_password',
  // },
}
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 头部数据显示
      Total_dataSource: {},
      Total_message:null
    }
  }

  componentDidMount() {
    homeTotalNum().then(res => {
      res && this.setState({ Total_dataSource: res.data })
    })
    messageTotalNum().then(res => {
      res && this.setState({ Total_message: res.data })
    })
  }

  componentWillUnmount() {
    this.setState = () => { }
  }

  render() {
    const { Total_dataSource } = this.state
    const { Total_message } = this.state
    const { user } = this.props
    let menus = (user && user.menus) || null
    let menu = []
    const _deep = arr => {
      arr && arr.forEach(v => {
        if (v.children && v.children.length) {
          _deep(v.children)
        } else {
          menu.push({ ...v, children: null })
        }
      })
    }
    menus && _deep(menus.children)
    return (
      <div className="Home">
        {/* 头部区域 */}
        <div className="data-items">
          {
            priceChange_config.map((item, index) => (
              <div className="data-item" key={index}>
                <img className="logo" src={imgSouce[item.icon]} alt={item.name} />
                <div className="right-area">
                  { item.orderNumber_dataIndex!=='Total_message'? (
                    <p className="num-area">
                    {
                      Total_dataSource && Total_dataSource[item.orderNumber_dataIndex] !== undefined ? (
                        <span className="num-item">
                          <span className="num">{Total_dataSource[item.orderNumber_dataIndex]}</span><span>{item.orderNumber_Company || '单'}</span>
                        </span>
                      ) : null
                    }
                    {
                      Total_dataSource && Total_dataSource[item.orderPiece_dataIndex] !== undefined ? (
                        <span className="num-item">
                          <span className="num">{Total_dataSource[item.orderPiece_dataIndex]}</span><span>{item.orderPiece_Company || '件'}</span>
                        </span>
                      ) : null
                    }
                  </p>
                    ): (
                    <p className="num-area">
                      <span className="num-item">
                        <Link to={`/sys/message`} replace ><span className="num">{Total_message}</span><span>条</span></Link>
                       </span>
                    </p>
                    ) }
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
                  !!quickItemText[item.path] && <Col xs={24} md={6} key={index}>
                    <Link to={`/sys${item.path}`} replace >
                      <div className="quick-item">
                        {quickItemText[item.path] && <img className="quick-logo" src={imgSouce[quickItemText[item.path].icon]} alt={item.name} />}
                        <p className="hint-area">
                          {quickItemText[item.path] && quickItemText[item.path].text}
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
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(Home)