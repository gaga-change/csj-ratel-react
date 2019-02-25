import React from 'react';
import { Button,Modal } from 'antd';
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
      dataSource:[{id:1},{id:2}],
      columns:indexTableColumnsConfig,
      pagination: {
   
      },
      loading:false,
      visible:true
    }

  }


  componentDidMount(){
    let {columns}=this.state;
    columns=columns.map(v=>{
       if(v.render===''){
          v.render=(ext, record, index)=>{
             return <span className="Dropdown_Menu_box">
               <span>删除</span> 
               <span>调价</span> 
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
    this.setState({visible:false})
    if(type==='add'){
      this.child.handleRest()
    }
    console.log(type,value)
   
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
            <div className="alert_Btn">
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
              width={800}
              centered={true}
              bodyStyle={{paddingBottom:16}}
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

