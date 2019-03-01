import React from 'react';
import {Button,Modal,Spin } from 'antd';
import _  from 'lodash';
import moment from "moment"
import request from '@lib/request'
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { indexTableColumns_Config,indexTableColumns_ChildConfig ,warehousingDetail_Config,BaseCard_Config} from './component/config'
import AddForm from './component/addform'
import BaseCard from '@component/baseCard/baseCard'
import BaseTitle from '@component/baseTitle/baseTitle'
import './outgoing.scss'

const confirm = Modal.confirm;
export default class Outgoing extends React.Component {
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
      warehousingDetail_dataSource:[],
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
    } else if(['submit','save'].includes(type)){
      console.log(type,value)
      value.planOutTime=moment(value.planOutTime).valueOf();
      value.isCommitFlag=type==='submit'?true:false;
      if(Array.isArray(value.items)){
        value.items=value.items.map(v=>{
           v.busiIndex=v.index;
           v.skuBrandCode=v.brandCode;
           v.skuBrandName=v.brandName;
           v.skuModel=v.skuFormat;
           v.productFactory=v.factoryName;
           v.outPrice=v.costPrice;
           v.skuCategoryName='李松'
           return v
        })
       }
       request({
        url: '/webApi/out/bill/saveOutBill',
        method: 'post',
        data:value
      }).then(res=>{
        this.setState({visible:false})
        if(this.child){
          this.child.handleRest()
        }
        this.fetch()
      }).catch(err=>{
        console.log(err)
      })

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
    console.log('这是出现创建出库单弹窗调用')
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
      url: '/webApi/out/bill/getOutBusiBill',
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
      url:'/webApi/out/bill/getOutBusiBillDetail',
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
    console.log('这是取消创建出库单的调用')
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
    let api='/webApi/out/bill/deleteBusiBill';
    let tip=`确定要删除单据 ${record.planCode} 吗？`
    if(type==='submit'){
      api='/webApi/out/bill/commitOutBill';
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
      <div className="Outgoing">
          <Sider history={this.props.history} />

          <SelestForm 
            onSubmit={this.onSubmit.bind(this,'select')} 
            selectWordsArr={['商品名称','状态','创建日期','查询重置','联系人电话','业务单号']}/>
          <div className="alert_Btn">
              <Button type="primary" onClick={this.add}>创建出库业务单</Button>
           </div>

          <FetchTable  
            columns={columns}
            loading={this.state.loading}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
            expandedRowRender={childTable}
            dataSource={dataSource}/>
            <Modal
              title="创建出库业务单"
              centered={true}
              destroyOnClose={true}
              width={1000}
              visible={visible}
              footer={null}
              onCancel={this.handleCancel}>
               <AddForm
                 onRef={this.ref} 
                 onSubmit={this.onSubmit}/>
            </Modal>

            <Modal
              title="出库业务单详情"
              className="Outgoing_detail_modal"
              visible={detailVisible}
              width={1000}
              footer={false}
              destroyOnClose={true}
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


