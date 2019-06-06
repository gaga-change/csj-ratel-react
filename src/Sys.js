import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown } from 'antd'
import { connect } from 'react-redux'
import { setUser } from 'actions'
import { userInfo } from 'api'
import { Link } from 'react-router-dom'
import MyContent from './Content'
import imgSouce from 'imgSouce/imgSouce'
import { loginOut } from 'api'
import { deep } from 'lib'
import './Sys.scss'

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
      DEV: !!window.localStorage.getItem('DEV')
    }
  }

  componentDidMount() {
    userInfo().then(res => {
      res && this.props.dispatch(setUser(res.data))
    })
  }

  /** 菜单点击 */
  handleMenuClick(menu) {
    this.props.history.replace(`/sys` + menu.path)
  }

  /** 退出登录 */
  logOut = () => {
    this.props.history.push('/web_login')
    loginOut()
  }

  render() {
    const { pathname } = this.props.location
    const { user } = this.props
    const { ownerName, nick } = user || {}
    const menus = (user && user.menus) || {}
    let menusRoot = [...(menus.children || [])]
    const defaultSelectedKeys = []
    deep(menus, 'children', v => {
      if (('/sys' + v.path) === pathname) {
        defaultSelectedKeys.push(v.id)
      }
    })
    if (pathname === '/sys/home') {
      defaultSelectedKeys.push('0')
    } else if (pathname === '/sys/system/menu') {
      defaultSelectedKeys.push('999')
    }

    menusRoot.unshift({
      id: 0,
      text: '首页',
      path: '/home',
      icon: 'home'
    })

    const menu = (
      <Menu>
        <Menu.Item>
          <span className="siderNav_header_Nav" onClick={this.logOut}>退出登录</span>
        </Menu.Item>
        <Menu.Item>
          <Link to='/sys/system/setPass' replace>
            <span className="siderNav_header_Nav">修改密码</span>
          </Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="Sys">
        <Layout>
          <Sider className="Sider" trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            {
              defaultSelectedKeys.length && <Menu mode="inline" defaultSelectedKeys={defaultSelectedKeys}>
                {
                  menusRoot.map(menuFa =>
                    (menuFa.children && menuFa.children.length) ? (
                      <SubMenu
                        key={menuFa.id}
                        title={
                          <span className="menu-item">
                            <img src={imgSouce[`${menuFa.icon}_click`]} alt="" />
                            <span>{menuFa.text}</span>
                          </span>
                        }
                      >
                        {menuFa.children.map(menu =>
                          <Menu.Item key={menu.id} onClick={this.handleMenuClick.bind(this, menu)}>
                            {/* <Icon type="user" /> */}
                            <span>{menu.text}</span>
                          </Menu.Item>
                        )}
                        {this.state.DEV && <Menu.Item key={999} onClick={this.handleMenuClick.bind(this, { path: '/system/menu' })}>
                          {/* <Icon type="user" /> */}
                          <span>菜单管理</span>
                        </Menu.Item>}
                      </SubMenu>
                    ) : (
                        <Menu.Item key={menuFa.id} onClick={this.handleMenuClick.bind(this, menuFa)}>
                          {/* <Icon type="user" /> */}
                          <span className="menu-item">
                            <img src={imgSouce[`${menuFa.icon}_click`]} alt="" />
                            <span>{menuFa.text}</span>
                          </span>
                        </Menu.Item>
                      )
                  )
                }
              </Menu>
            }
          </Sider>
          <Layout>
            <Header >
              <div className="header-logo">
                <img src={imgSouce['logo']} alt="" />
                <span>川山甲 SAASERP</span>
              </div>
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
            </Header>
            <Content>
              <MyContent />
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(App)