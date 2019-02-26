import React from 'react';
import { Button } from 'antd';
import _  from 'lodash';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig } from './component/config'
import CommodityForm from './component/form'

import'./stock.scss'
export default class Stock extends React.Component {

  constructor(props){
    super(props);
    this.state={
      dataSource:[{id:1},{id:2}],
      pagination: {
   
      },
      loading:false,
      name:1
    }
  }


  componentDidMount(){
    this.fetch()
  }

  fetch = ()=>{
    
  }

  handleDelete = ()=>{

  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }

  onSubmit = (type,value)=>{
    console.log(type,value)
  }

  render() {

    const { dataSource }=this.state;
    const columns=_.cloneDeep(indexTableColumnsConfig).map(v=>{
      if(v.render===''){
         v.render=(ext, record, index)=>{
            return <span className="Dropdown_Menu_box">
              <span onClick={this.handleDelete}>删除</span> 
              <span>调价</span> 
            </span>
         }
      }
      return v
    })

    return (
        <div className="Stock"  >
            <Sider history={this.props.history} /> 
            <CommodityForm onSubmit={this.onSubmit.bind(this,'select')}/>
            <div className="alert_Btn">
               <div className="Total">
                  <span className="Total_list">
                     <span>可用库存合计 ：</span> 
                     <span></span> 
                  </span>
                  <span className="Total_list">
                     <span>锁定库存合计 ：</span> 
                     <span></span> 
                  </span>
               </div>
              <Button type="primary" onClick={this.addCommodity}>库存导出</Button>
            </div>
            <FetchTable 
              dataSource={dataSource} 
              columns={columns}
              loading={this.state.loading}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}/>
        </div>
    );
  }
}

