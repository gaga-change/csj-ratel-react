import React from 'react';
import { Button, Modal } from 'antd';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import RoleForm from './components/roleForm'
import roleConfig from './config/roleConfig'
import './style/role.scss'

export default class Role extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource:[{id:1},{id:2}],
      columns: roleConfig.columns,
      pagination: {
   
      },
      loading:false,
      visible:false
    }
  }

  componentDidMount(){
    let {columns}=this.state;
    columns=columns.map(v=>{
       if(v.render===''){
          v.render=(ext, record, index)=>{
             return <span className="Dropdown_Menu_box">
               <span>删除</span> 
               <span>操作权限</span> 
             </span>
          }
       }
       return v
    })
    this.setState({columns})
    this.fetch()
  }

  fetch = ()=>{
    
  }

  /**
   * 搜索表单提交
   */
  handleFormSubmit = (val) => {
    console.log(val)
  }

  /**
   * 添加对象按钮
   */
  handleAdd = () => {

  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }

  render () {
    const { dataSource,columns,visible }=this.state;
    console.log(columns)
    return (
      <div className="Role">
        <Sider history={this.props.history} />
        <RoleForm onSubmit={this.handleFormSubmit}></RoleForm>
        <div className="alert_Btn">
          <Button type="primary" onClick={this.handleAdd}>创建角色</Button>
        </div>
        <FetchTable
          dataSource={dataSource}
          columns={columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange} />
      </div>
    );
  }
}

