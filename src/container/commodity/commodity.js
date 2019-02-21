import React from 'react';
import { Button,Modal  } from 'antd';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig } from './component/config'
import CommodityForm from './component/form'
import AddForm from './component/addform'

import'./commodity.scss'
export default class Commodity extends React.Component {
  state={
    dataSource:[],
    columns:indexTableColumnsConfig,
    pagination: {
 
    },
    loading:false,
    visible:false
  }

  componentDidMount(){
    let {columns}=this.state;
    columns.map(v=>{
       if(v.render!==undefined){
          v.render=(ext, record, index)=>{
             return <div className="operationBtn">
               <span>查看</span>
               <span>删除</span>
               <span>调价</span>
             </div>
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

  }

  onSubmit(type,value){
    console.log(type,value)
  }

  addCommodity = ()=>{
    this.setState({visible:true})
  }

  handleOk = ()=>{
    this.setState({visible:false})
  }

  handleCancel = ()=>{
     this.setState({visible:false})
  }

  render() {
    const { dataSource,columns }=this.state;
    return (
        <div className="Commodity">
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
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                  <AddForm onSubmit={this.onSubmit.bind(this,'add')}/>
              </Modal>
        
        </div>
    );
  }
}

