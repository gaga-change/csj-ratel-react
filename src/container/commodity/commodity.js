import React from 'react';
import { Button,Modal,Menu,Dropdown,Icon } from 'antd';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig } from './component/config'
import CommodityForm from './component/form'
import AddForm from './component/addform'

import'./commodity.scss'
export default class Commodity extends React.Component {

  constructor(props){
    super(props);
    this.state={
      dataSource:[{id:1}],
      columns:indexTableColumnsConfig,
      pagination: {
   
      },
      loading:false,
      visible:false
    }

  }


  componentDidMount(){
    let {columns}=this.state;
    columns.map(v=>{
       if(v.render!==undefined){
          v.render=(ext, record, index)=>{
             return <span className="Dropdown_Menu_box">
               <span>查看</span> 
               <Dropdown overlay={
                  <Menu className="Dropdown_Menu">
                    <Menu.Item>
                      <span>查看</span>
                    </Menu.Item>
                    <Menu.Item>
                      <span>删除</span>
                    </Menu.Item>
                    <Menu.Item>
                      <span>调价</span>
                    </Menu.Item>
                  </Menu>
                }>
                <span className="Dropdown_base">
                    <span>更多操作</span> 
                    <Icon type="down" />
                </span>
                </Dropdown>
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

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }

  onSubmit = (type,value)=>{
    console.log(type,value)
    this.setState({visible:false})
    this.child.handleRest()
  }

  addCommodity = ()=>{
    this.setState({visible:true})
  }

  handleCancel = ()=>{
     this.setState({visible:false})
  }

  handleOk = (e)=>{
    this.child.handleSubmit(e)
  }

  ref = (res)=>{
    this.child=res
  }

  render() {
    const { dataSource,columns,visible }=this.state;
    return (
        <div className="Commodity"  >
            <Sider history={this.props.history} /> 
            <CommodityForm onSubmit={this.onSubmit.bind(this,'select')}/>
            <div className="Commodity_addBtn">
              <Button type="primary" onClick={this.addCommodity}>创建商品</Button>
            </div>
            <FetchTable 
              dataSource={dataSource} 
              columns={columns}
              loading={this.state.loading}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}/>

            <Modal
              title="创建商品"
              okText="保存"
              centered={true}
              bodyStyle={{paddingBottom:0}}
              visible={visible}
              onCancel={this.handleCancel}
              onOk={this.handleOk}>
               <AddForm 
                  onRef={this.ref}
                  onSubmit={this.onSubmit.bind(this,'add')}/>
            </Modal>
        </div>
    );
  }
}

