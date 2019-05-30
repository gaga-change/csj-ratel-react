import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import { connect } from 'react-redux'
import { setUser } from 'actions'
import { userInfo } from 'api'
import MyContent from './Content'
import imgSouce from 'imgSouce/imgSouce'
import './Sys.scss'
const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

class App extends Component {
  state = {
    collapsed: true,
  }

  toggle = () => {
    // this.setState({
    //   collapsed: !this.state.collapsed,
    // })
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

  render() {
    const { user } = this.props
    const menus = (user && user.menus) || {}
    let menusRoot = [...menus.children]
    menusRoot.unshift({
      id: 0,
      text: '首页',
      path: '/home',
      icon: 'home'
    })
    return (
      <div className="Sys">
        <Layout>
          <Sider className="Sider" trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            <Menu mode="inline" defaultSelectedKeys={['0']}>
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
                      <Menu.Item key={999} onClick={this.handleMenuClick.bind(this, { path: '/system/menu' })}>
                        {/* <Icon type="user" /> */}
                        <span>菜单管理</span>
                      </Menu.Item>
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
          </Sider>
          <Layout>
            <Header >
              {/* <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              /> */}
              川山甲
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