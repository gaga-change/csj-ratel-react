import React from 'react';
import { Button,Modal,Popconfirm,message} from 'antd';
import _  from 'lodash';
import {stringify,parse} from 'qs';
import request from '@lib/request'
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig} from './component/config'
import CommodityForm from './component/form'
import AddForm from './component/addform'
import'./commodity.scss'

export default class Commodity extends React.Component {

  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      pagination: {},
      submitLoding:false,
      loading:false,
      visible:false,
      modifypriceVisible:false,
      costPriceChange_dataSource:[],
      priceChange_dataSource:[],
      modifyprice_loding:false,
      modifypriceActiveRow:{}
    }
  }

  componentDidMount(){
    this.fetch()
  }

  componentWillUnmount() {
    this.setState = () => {}
  }

  fetch = (json)=>{
    this.setState({loading:true})
    let {search,pathname} = this.props.history.location
    let { current,pageSize,...rest} = parse(search.slice(1))
    let { dataSource,pagination} =this.state;
    if(!Object.keys(pagination).length){
      pagination={
        current:Number(current)||1,
        pageSize:Number(pageSize)||10
      }
      this.setState({pagination})
    } 
    let data={};
    if(json){
      data={...pagination,...json};
    } else{
      data={...pagination,...rest};
    }

    delete data.total;
    this.props.history.replace(`${pathname}?${stringify(data)}`)
    data.pageNum=data.current;
    delete data.current;
    
    request({
      url: '/webApi/sku/info/list',
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
      this.setState({
        loading:false,
       })
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
    let { pagination }=this.state;
    if(type==='add'){
      this.setState({submitLoding:true})
      request({
        url: '/webApi/sku/info/add',
        method: 'post',
        data:value
      }).then(res=>{
        message.success('操作成功')
        this.child.handleRest()
        this.setState({
          visible:false,
          submitLoding:false
        })
        this.fetch()
      }).catch(err=>{
        console.log(err)
        this.setState({
          submitLoding:false
        })
      })
    } else if(type==="select"){
      if(!Object.keys(value).length){
        pagination={
          current:1,
          pageSize:10
        }
      } 
      this.setState({pagination},()=>{
        this.fetch(value)
      })
    } else if(type==='modifyprice'){
      this.setState({
        submitLoding:true
      })
      request({
        url: '/webApi/sku/price/change',
        method: 'post',
        data:value
      }).then(res=>{
        message.success('操作成功')
        this.setState({
          submitLoding:false,
          modifypriceVisible:false,
          modifypriceActiveRow:{}
        })
        this.modifyprice_child.handleRest()
        this.fetch()
      }).catch(err=>{
        console.log(err)
        this.setState({
          submitLoding:false
        })
      })
    }
  }

  addCommodity = ()=>{
    this.setState({visible:true})
  }


  handleCancel = ()=>{
    if( this.modifyprice_child){
      this.modifyprice_child.handleRest()
    }
     this.setState({visible:false,modifypriceVisible:false})
  }

  handleOk = (e)=>{
    this.child.handleSubmit(e)
  }

  ref = (res)=>{
    this.child=res
  }

  deleteCommodity = (value)=>{
    request({
      url: `/webApi/sku/info/delete/${value.id}`,
      method: 'delete',
    }).then(res => {
      message.success('操作成功')
      this.fetch()
    }).catch(err => {
       this.setState({
        modifypriceVisible:false
      })
    })
  }

  modifyprice = item => {

  }

  render() {
    const { dataSource,submitLoding,visible,loading,pagination}=this.state;
    const columns=_.cloneDeep(indexTableColumnsConfig).map(v=>{
      if(v.render===''){
         v.render=(ext, record, index)=>{
            return <span className="Dropdown_Menu_box">
                <Popconfirm title="确定要删除吗?" onConfirm={this.deleteCommodity.bind(this,record)}>
                  <span>删除</span> 
                </Popconfirm>
              <span onClick={this.modifyprice.bind(this,record)}>供货价</span> 
              <span onClick={this.modifyprice.bind(this,record)}>销售价</span> 
            </span>
         }
      }
      return v
   })

    return (
        <div className="Commodity"  >
            <Sider history={this.props.history} /> 
            <CommodityForm 
              selectWordsArr={['商品名称','商品编码']}
              onSubmit={this.onSubmit.bind(this,'select')}/>
            <div className="alert_Btn">
              <Button type="primary" onClick={this.addCommodity}>创建商品</Button>
            </div>
            <FetchTable 
              dataSource={dataSource} 
              columns={columns}
              loading={loading}
              pagination={pagination}
              onChange={this.handleTableChange}/>
            <Modal
              title="创建商品"
              okText="保存"
              width={800}
              centered={true}
              confirmLoading={submitLoding}
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

