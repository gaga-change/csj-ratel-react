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

  fetch = (json={})=>{
    this.setState({loading:true})
    let { dataSource,pagination,loading} =this.state;
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
    if(type==='add'){
      this.setState({submitLoding:true})
      request({
        url: '/webApi/sku/info/add',
        method: 'post',
        data:value
      }).then(res=>{
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
      this.fetch(value)
    } else if(type==='modifyprice'){
      this.setState({
        submitLoding:true
      })
      request({
        url: '/webApi/sku/price/change',
        method: 'post',
        data:value
      }).then(res=>{
        this.setState({
          submitLoding:false,
          modifypriceVisible:false
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

  modifyprice_ref = (res)=>{
    this.modifyprice_child=res
  }

  modifyprice = (value)=>{
    let { modifypriceActiveRow } = this.state;
    this.setState({
      modifypriceVisible:true,
      modifypriceActiveRow:value,
      modifyprice_loding:true
    })

    if(modifypriceActiveRow.id===value.id){
      return ''
    }
    //查询商品成本价格变动记录
    request({
      url: `/webApi/sku/price/queryCostPriceRecord`,
      method: 'get',
      data:value.id,
      useStringify:false
    }).then(res => {
       this.setState({
        costPriceChange_dataSource:res||[],
        modifyprice_loding:false
       })
    }).catch(err => {
       console.log(err)
       this.setState({
        modifyprice_loding:false
       })
    })
    
    //查询商品成本售价变动记录
    request({
      url: `/webApi/sku/price/querySalePriceRecord`,
      method: 'get',
      data:value.id,
      useStringify:false
    }).then(res => {
       this.setState({
        priceChange_dataSource:res||[],
        modifyprice_loding:false
       })
    }).catch(err => {
       console.log(err)
       this.setState({
        modifypriceVisible:false
      })
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
       this.setState({
        modifypriceVisible:false
      })
    })
  }

  render() {
    const { dataSource,submitLoding,visible,modifypriceVisible,costPriceChange_dataSource,modifyprice_loding,priceChange_dataSource,modifypriceActiveRow,loading,pagination}=this.state;
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

            <Modal
              title="调价"
              footer={false}
              centered={true}
              width={800}
              bodyStyle={{paddingTop:16}}
              visible={modifypriceVisible}
              onCancel={this.handleCancel}>
                <div className="modifyprice_alert">
                <CommodityForm 
                 loading={submitLoding}
                 onRef={this.modifyprice_ref}
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

