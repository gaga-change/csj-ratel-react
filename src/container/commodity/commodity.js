import React from 'react';
import { Button,Modal,Tabs,Popconfirm } from 'antd';
import _  from 'lodash';
import request from '@lib/request'
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig,costPriceChange_config,priceChange_config} from './component/config'
import CommodityForm from './component/form'
import AddForm from './component/addform'
import'./commodity.scss'

const TabPane = Tabs.TabPane;
export default class Commodity extends React.Component {

  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      pagination: {},
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

  fetch = (json={})=>{
    let { dataSource,pagination} =this.state;
    let data={
      ...json,
      pageNum:pagination.current||1,
      pageSize:pagination.pageSize||10
    }
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
        pagination
       })
    }).catch(err => {
     
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
    this.setState({visible:false})
    if(type==='add'){
      request({
        url: '/webApi/sku/info/add',
        method: 'post',
        data:value
      }).then(res=>{
        this.child.handleRest()
        this.fetch()
      }).catch(err=>{
        console.log(err)
      })
    } else if(type==="select"){
      this.fetch(value)
    } else if(type==='modifyprice'){
      request({
        url: '/webApi/sku/price/change',
        method: 'post',
        data:value
      }).then(res=>{
        this.fetch()
      }).catch(err=>{
        console.log(err)
      })
    }
  }

  addCommodity = ()=>{
    this.setState({visible:true})
  }

  handleCancel = ()=>{
     this.setState({visible:false,modifypriceVisible:false})
  }

  handleOk = (e)=>{
    this.child.handleSubmit(e)
  }

  ref = (res)=>{
    this.child=res
  }

  modifyprice = (value)=>{
    this.setState({
      modifypriceVisible:true,
      modifypriceActiveRow:value
    })
    //查询商品成本价格变动记录
    request({
      url: `/webApi/sku/price/queryCostPriceRecord`,
      method: 'get',
      data:value.id,
      useStringify:false
    }).then(res => {
       this.setState({
        costPriceChange_dataSource:res||[]
       })
    }).catch(err => {
       console.log(err)
    })
    
    //查询商品成本售价变动记录
    request({
      url: `/webApi/sku/price/querySalePriceRecord`,
      method: 'get',
      data:value.id,
      useStringify:false
    }).then(res => {
       this.setState({
        priceChange_dataSource:res||[]
       })
    }).catch(err => {
       console.log(err)
    })
  }

  deleteCommodity = (value)=>{
    request({
      url: `/webApi/sku/info/delete/${value.id}`,
      method: 'delete',
    }).then(res => {
      this.fetch()
    }).catch(err => {
       console.log(err)
    })
  }


  render() {
    const { dataSource,visible,modifypriceVisible,costPriceChange_dataSource,modifyprice_loding,priceChange_dataSource,modifypriceActiveRow}=this.state;
    const columns=_.cloneDeep(indexTableColumnsConfig).map(v=>{
      if(v.render===''){
         v.render=(ext, record, index)=>{
            return <span className="Dropdown_Menu_box">
                <Popconfirm title="确定要删除吗?" onConfirm={this.deleteCommodity.bind(this,record)}>
                  <span>删除</span> 
                </Popconfirm>
              <span onClick={this.modifyprice.bind(this,record)}>调价</span> 
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

            <Modal
              title="调价"
              footer={false}
              width={800}
              bodyStyle={{paddingTop:16}}
              visible={modifypriceVisible}
              onCancel={this.handleCancel}>
                <div className="modifyprice_alert">
                <CommodityForm 
                 modifypriceActiveRow={modifypriceActiveRow}
                 selectWordsArr={['成本价','售价']}
                 submitTex="提交"
                 resetText="取消"
                 onSubmit={this.onSubmit.bind(this,'modifyprice')}/>
                  <Tabs type="card">
                      <TabPane tab='成本价变动记录' key='1'>
                          <FetchTable 
                            dataSource={costPriceChange_dataSource} 
                            columns={costPriceChange_config}
                            loading={modifyprice_loding}
                            pagination={false}/>
                      </TabPane>
                      <TabPane tab='售价变动记录' key='2'>
                          <FetchTable 
                            dataSource={priceChange_dataSource} 
                            columns={priceChange_config}
                            loading={modifyprice_loding}
                            pagination={false}/>
                      </TabPane>
                    </Tabs>
                </div>
              </Modal>
        </div>
    );
  }
}

