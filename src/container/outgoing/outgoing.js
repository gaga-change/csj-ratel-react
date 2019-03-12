import React from 'react';
import {Button,Modal,Spin,Dropdown,Menu,Icon,message} from 'antd';
import _  from 'lodash';
import moment from "moment"
import {stringify,parse} from 'qs';
import request from '@lib/request'
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { indexTableColumns_Config,indexTableColumns_ChildConfig ,map_Config,warehousingDetail_Config,BaseCard_Config} from './component/config'
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
      BaseCard_dataSource:{},
      record:{},
      ModalTitle:'创建出库业务单'
    }
  }

  onSubmit = (type,value)=>{
    let {ModalTitle,record,pagination}=this.state;
    if(type==="select"){
      if(Array.isArray(value.createTime)){
        value.createBeginDate=moment(value.createTime[0]).valueOf()
        value.createEndDate=moment(value.createTime[1]).valueOf()
      }
      if(!Object.keys(value).length){
        pagination={
          current:1,
          pageSize:10
        }
      } 
      this.setState({pagination},()=>{
        this.fetch(value)
      })
    } else if(['submit','save'].includes(type)){
      value.planOutTime=moment(value.planOutTime).valueOf();
      value.isCommitFlag=type==='submit'?true:false;
      if(ModalTitle==='修改出库业务单'){
        value.planCode=record.planCode
      }
      if(Array.isArray(value.items)){
        value.items=_.cloneDeep(value.items).map(v=>{
           for(let i in map_Config){
             v[i]=v[map_Config[i]]
           }
           return v
        })
       }
       request({
        url: '/webApi/out/bill/saveOutBill',
        method: 'post',
        data:value
      }).then(res=>{
        message.success('操作成功')
        this.setState({visible:false})
        this.fetch()
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

  add = (type,record)=>{
    if(type==='update'){
      request({
        url:'/webApi/out/bill/getOutBusiBillDetail',
        method:'get',
        data:{ 
          planCode:record.planCode
        }
      }).then(res => {
         this.setState({visible:true,record:res,ModalTitle:'修改出库业务单'})
      }).catch(err=>{
        console.log(err)
      })
    } else{
      this.setState({visible:true,record:{},ModalTitle:'创建出库业务单'})
    }
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
           message.success('操作成功')
           that.fetch()
        }).catch(err=>{
          console.log(err)
        })
      },
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    const { dataSource,ModalTitle,spinning,record,visible,detailVisible,warehousingDetail_dataSource,BaseCard_dataSource} =this.state;
    const columns=_.cloneDeep(indexTableColumns_Config).map(v=>{
      if(v.render===''){
         v.render=(ext, record, index)=>{
            return <span className="Dropdown_Menu_box">
                <span onClick={this.showDetail.bind(this,record)}>查看</span> 
                { 
                  [0,2].includes(Number(record.issuedState))&&
                  <Dropdown overlay={
                    <Menu className="Dropdown_Menu_child" >
                      { 
                        [0,2].includes(Number(record.issuedState))&&
                        <Menu.Item onClick={this.add.bind(this,'update',record)}>
                          <span>修改</span>
                        </Menu.Item>
                      }
    
                      {
                        [0,2].includes(Number(record.issuedState))&&
                        <Menu.Item onClick={this.onOperation.bind(this,'delete',record)}>
                          <span>删除</span>
                        </Menu.Item>
                      }
    
                      { 
                        [0].includes(Number(record.planState))&&
                        <Menu.Item onClick={this.onOperation.bind(this,'submit',record)}>
                          <span>提交</span>
                        </Menu.Item>
                      } 
                    </Menu>}>
                    <span>更多操作<Icon type="down" /></span>
                  </Dropdown>
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
            selectWordsArr={['商品名称','状态','创建日期','纵向查询','联系人电话','业务单号']}/>
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
              title={ModalTitle}
              centered={true}
              destroyOnClose={true}
              width={1000}
              visible={visible}
              footer={null}
              onCancel={this.handleCancel}>
               <AddForm
                 record={record}
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


