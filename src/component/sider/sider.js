import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import { connect } from 'react-redux';
import request from '../../lib/request'
import { deepExistMenu } from '../../lib/lib'
import { setInfo, removeInfo } from "../../redux/info.redux";
import { setMenus } from "../../redux/menus.redux";
import { routerConfig } from '../../router/config'
import imgSouce from '../../imgSouce/imgSouce'
import './sider.scss'

@connect(
  state => state,
  { setInfo, setMenus, removeInfo }
)

export default class Sider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoginPage: this.props.history.location.pathname === '/web_login'
    }
  }

  componentDidMount () {
    document.documentElement.scrollTop = 0;
    document.querySelector('.SiderNav').style.minHeight = document.body.clientWidth + 'px';
    this.spin()
  }

  componentDidUpdate () {
    document.querySelector('.SiderNav').style.minHeight = document.body.clientWidth + 'px';
  }

  spin = () => {
    const { isLoginPage,hasGetInfo} = this.state
    if ((!this.props.info || !this.props.info.info || this.props.info.info.id === undefined) && !isLoginPage) {
      this.getInfo()
    }
  }

  getInfo = () => {
    request({
      url: '/webApi/base/user/info',
      method: 'get',
    }).then(res => {
      this.props.setInfo(res)
      this.props.setMenus(deepExistMenu(res.menus.children, routerConfig))
    }).catch(err => {
       console.log(err)
    })
  }

  logOut = () => {
    request({
      url: '/login_out',
      method: 'get',
    }).then(res => {
      this.props.removeInfo();
      this.getInfo()
    }).catch(err => {

    })
  }

  render () {
    const { ownerName,nick} = (this.props.info&&this.props.info.info)||{};
    let activePath = this.props.history && this.props.history.location && this.props.history.location.pathname;
    let arr = activePath && activePath.split('/');
    if (arr.length > 2) {
      activePath = `/${arr[1]}`
    }
    const config = this.props.menus && this.props.menus.menus && Array.isArray(this.props.menus.menus) && this.props.menus.menus.filter(v => !v.hidden).sort((a, b) => a.sort - b.sort);
    const uesHover = this.props.uesHover !== undefined ? this.props.uesHover : true;
    const { isLoginPage } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>
          <span className="siderNav_header_Nav" onClick={this.logOut}>退出登录</span>
        </Menu.Item>
        <Menu.Item>
        <Link to='/system/setPass' replace>
           <span className="siderNav_header_Nav">修改密码</span>
        </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="siderNav_box">
        <div className="SiderNav" style={{ minHeight: this.props.minHeight ? this.props.minHeight : '800px', display: isLoginPage ? 'none' : 'block' }}>
          <ul>
            {
              config.map(v =>
                <li key={v.id || v.path} className={activePath === v.path||activePath === v.Redirect ? 'active' : null}>
                  <Link to={v.Redirect||v.path} replace>
                    <img src={activePath === v.path||activePath === v.Redirect? imgSouce[`${v.icon}_click`] : imgSouce[v.icon]} alt="" />
                    <span>{v.name}</span>
                  </Link>
                  {
                    v.children && uesHover &&
                    <div className="li_hover">
                      <ul>
                        {
                          v.children.sort((a, b) => a.sort - b.sort).map(item =>
                            <li key={item.id || item.path}>
                              <Link to={item.path} replace>
                                {item.name}
                              </Link>
                            </li>
                          )
                        }
                      </ul>
                    </div>
                  }
                </li>)
            }
          </ul>
        </div>

        <div className="logonHeader" style={{ paddingLeft: isLoginPage ? '0' : '50px' }}>
          <header id="header">
            <div className="header-logo" style={{ paddingLeft: isLoginPage ? '24px' : '20px' }}>
              <img src={imgSouce['logo']} alt="" />
              {
                !isLoginPage &&
                <span>川山甲 SAASERP</span>
              }
              {
                isLoginPage &&
                <div className="logo_text">
                  <h3>川山甲 SAASERP</h3>
                  <span>协同供应链 .仓配一体化 .仓储租赁</span>
                </div>
              }
            </div>
            {
              !isLoginPage &&
              <div className="header-set">
                <Dropdown overlay={menu}>
                  <span className="ant-dropdown-link header_set_content" >
                    <p className="user-area">
                      <span className="user-name">{nick}</span>
                      <span className="company-name">{ownerName}</span>
                    </p>
                    <Icon type="down" />
                  </span>
                </Dropdown>
              </div>
            }
          </header>
        </div>
      </div>
    )
  }
}
