import React from 'react';
import { Button } from 'antd';
import _  from 'lodash';
import {stringify,parse} from 'qs';
import request from '@lib/request'
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig } from './component/config'
import CommodityForm from './component/form'

import'./stock.scss'
export default class Stock extends React.Component {

  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      pagination: {
   
      },
      loading:false,
      count:{},
      exportLoding:false
    }
  }


  componentDidMount(){
    let { pagination } = this.state;
    let {search} = this.props.history.location
    let { pageNum,pageSize,...rest} = parse(search.slice(1))
    pagination.current=Number(pageNum)||1;
    pagination.pageSize=Number(pageSize)||10;
    this.setState({pagination})
    this.fetch(rest)
  }

  fetch = (json={})=>{
    this.setState({loading:true})
    let { dataSource,pagination} =this.state;
    let data={
      ...json,
      pageNum:pagination.current||1,
      pageSize:pagination.pageSize||10
    }
    this.props.history.replace(`/stock?${stringify(data)}`)
    request({
      url: '/webApi/stock/page',
      method: 'get',
      data:data
    }).then(res => {
       if(res.list&&Array.isArray(res.list)){
        dataSource=res.list
        pagination.total=res.total
       }
       this.setState({
        dataSource,
        pagination,
        loading:false,
       })
    }).catch(err => {
      console.log(err)
      this.setState({
        loading:false,
       })
    })

    request({
      url:'/webApi/stock/count',
      method: 'get',
      data:data
    }).then(res => {
      this.setState({count:res})
    }).catch(err => {
       console.log(err)
    })
  }


  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    },()=>{
      this.fetch()
    })
  }
 
  onSubmit = (type,value)=>{
    if(type==="select"){
      this.fetch(value)
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    const { dataSource,count}=this.state;
    const columns=_.cloneDeep(indexTableColumnsConfig)
    let { search } = this.props.history.location;
    return (
        <div className="Stock"  >
            <Sider history={this.props.history} /> 
            <CommodityForm onSubmit={this.onSubmit.bind(this,'select')}/>
            <div className="alert_Btn">
               <div className="Total">
                   {
                     count.totalInventoryTotal!==undefined&&
                    <span className="Total_list">
                      <span>可用库存合计 ：{count.totalInventoryTotal}</span> 
                      <span></span> 
                    </span>
                   }

                   {
                     count.totalInventoryLockQuantity!==undefined&&
                     <span className="Total_list">
                        <span>锁定库存合计 ：{count.totalInventoryLockQuantity}</span> 
                        <span></span> 
                     </span>
                   }
               </div>
               <a href={`/webApi/stock/export${search}`}>
                 <Button type="primary">库存导出</Button> 
               </a>
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



