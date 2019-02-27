import React from 'react';
import {Button,Modal,Spin } from 'antd';
import moment from "moment"
import _  from 'lodash';
import request from '@lib/request'
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { indexTableColumns_Config,indexTableColumns_ChildConfig ,warehousingDetail_Config,BaseCard_Config} from './component/config'
import AddForm from './component/addform'
import BaseCard from '@component/baseCard/baseCard'
import BaseTitle from '@component/baseTitle/baseTitle'
import './warehousing.scss'

const confirm = Modal.confirm;
export default class Warehousing extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,
      visible:false,
      detailVisible:false,
      spinning:false,
      pagination: {
      
      },
      dataSource:[],
      warehousingDetail_dataSource:[{},{}],
      BaseCard_dataSource:{}
    }
  }

  onSubmit = (type,value)=>{
    if(type==="select"){
      for(let i in value){
        if(value[i]===''){
          delete value[i]
        }
      }
      if(Array.isArray(value.createTime)){
        value.createBeginDate=moment(value.createTime[0]).valueOf()
        value.createEndDate=moment(value.createTime[1]).valueOf()
      }
      this.fetch(value)
    } else if(['saveSubmit','addSubmit'].includes(type)){
       value.isCommitFlag=type==='addSubmit'?true:false;
       value.planInTime=moment(value.planInTime).valueOf()
       if(Array.isArray(value.items)){
        value.items=value.items.map(v=>{
           v.inPrice=v.costPrice;
           v.skuBrandName=v.brandName;
           v.skuModel=v.skuFormat;
           v.busiIndex=v.index;
           v.skuCategoryName=v.categoryName;
           return v
        })
       }
       console.log(type,value)
       request({
        url: `/webApi/in/bill/saveInBill`,
        method:'post',
        data:value,
      }).then(res => {
         console.log(res)
      }).catch(err => {
         console.log(err)
      })
      this.setState({visible:false})
      if(this.child){
        this.child.handleRest()
      }
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    },()=>{
      this.fetch()
    })
  }

  add = ()=>{
    console.log('这是出现创建入库单弹窗调用')
    this.setState({visible:true})
  }

  fetch = (json={})=>{
    this.setState({loading:true})
    let { dataSource,pagination} =this.state;
    let data={
      ...json,
      pageNum:pagination.current||1,
      pageSize:pagination.pageSize||10
    }
    request({
      url: '/webApi/in/bill/getInBusiBill',
      method: 'post',
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

  showDetail = (record) =>{
    let {warehousingDetail_dataSource,BaseCard_dataSource}=this.state;
    this.setState({detailVisible:true,spinning:true})
    request({
      url:'/webApi/in/bill/getInBusiBillDetail',
      method:'get',
      data:{ 
        planCode:record.planCode
      }
    }).then(res => {
      BaseCard_dataSource=res;
      if(Array.isArray(res.planDetails)){
        warehousingDetail_dataSource=res.planDetails;
      }
      this.setState({BaseCard_dataSource,warehousingDetail_dataSource,spinning:false})
    }).catch(err => {
      console.log(err)
      this.setState({spinning:false})
    })
  }

  handleCancel = ()=>{
    console.log('这是取消创建入库单的调用')
    this.setState({visible:false,detailVisible:false})
  }

  ref = (res)=>{
    this.child=res
  }

  componentDidMount(){
    this.fetch()
  }

  onOperation = (type,record)=>{
    let that=this;
    let api='/webApi/in/bill/deleteBusiBill';
    let tip=`确定要删除单据 ${record.planCode} 吗？`
    if(type==='submit'){
      api='/webApi/in/bill/commitInBill';
      tip=`确定要提交单据 ${record.planCode} 吗？`
    }
    confirm({
      title:tip,
      onOk() {
        request({
          url:api,
          method:'get',
          data:{ 
            planCode:record.planCode
          }
        }).then(res=>{
           console.log(res)
           that.fetch()
        }).catch(err=>{
          console.log(err)
        })
      },
    });
  }


  render() {
    const { dataSource,spinning,visible,detailVisible,warehousingDetail_dataSource,BaseCard_dataSource} =this.state;
    const columns=_.cloneDeep(indexTableColumns_Config).map(v=>{
      if(v.render===''){
         v.render=(ext, record, index)=>{
            return <span className="Dropdown_Menu_box">
              <span onClick={this.showDetail.bind(this,record)}>查看</span> 
              {
                 [0,2].includes(Number(record.issuedState))&&
                <span onClick={this.onOperation.bind(this,'delete',record)}>删除</span>
              }

              { 
                [0].includes(Number(record.planState))&&
                <span onClick={this.onOperation.bind(this,'submit',record)}>提交</span>
              }
            </span>
         }
      }
      return v
    })

    const childTable=(record)=>{
      return <FetchTable 
               columns={indexTableColumns_ChildConfig}  
               dataSource={record.planDetails} 
               pagination={false}/>
    }
    
    return (
      <div className="Warehousing">
          <Sider history={this.props.history} />

          <SelestForm 
            onSubmit={this.onSubmit.bind(this,'select')} 
            selectWordsArr={['商品名称','状态','创建日期','查询重置','业务单号']}/>
          <div className="alert_Btn">
              <Button type="primary" onClick={this.add}>创建入库业务单</Button>
          </div>

          <FetchTable  
            columns={columns}
            loading={this.state.loading}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
            expandedRowRender={childTable}
            dataSource={dataSource}/>
            <Modal
              title="创建入库业务单"
              centered={true}
              width={1000}
              visible={visible}
              footer={null}
              onCancel={this.handleCancel}>
              <AddForm
                onRef={this.ref} 
                onSubmit={this.onSubmit}/>
            </Modal>
 
            <Modal
              title="入库业务单详情"
              className="warehousing_detail_modal"
              visible={detailVisible}
              destroyOnClose={true}
              width={1000}
              footer={false}
              onCancel={this.handleCancel}>
               <Spin spinning={spinning}>
                <div className="warehousing_detail">
                   <BaseTitle title="基本信息"/>
                   <BaseCard  columns={BaseCard_Config} dataSource={BaseCard_dataSource}/>
                   <BaseTitle title="相关明细"/>
                   <FetchTable 
                     useIndex={true}
                     columns={warehousingDetail_Config}
                     dataSource={warehousingDetail_dataSource} />
                </div>
               </Spin>
            </Modal>
      </div>
    );
  }
}


