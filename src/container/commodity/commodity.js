import React from 'react';
import { Button,Modal,Tabs  } from 'antd';
import _  from 'lodash';
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
      dataSource:[{id:1},{id:2}],
      pagination: {
   
      },
      loading:false,
      visible:false,
      modifypriceVisible:false,
      costPriceChange_dataSource:[],
      priceChange_dataSource:[],
      modifyprice_loding:false
    }

  }


  componentDidMount(){
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
     this.setState({visible:false,modifypriceVisible:false})
  }

  handleOk = (e)=>{
    this.child.handleSubmit(e)
  }

  ref = (res)=>{
    this.child=res
  }

  modifyprice = ()=>{
    console.log('这是调价调用')
    this.setState({modifypriceVisible:true})
  }


  render() {
    const { dataSource,visible,modifypriceVisible,costPriceChange_dataSource,modifyprice_loding,priceChange_dataSource}=this.state;
    const columns=_.cloneDeep(indexTableColumnsConfig).map(v=>{
      if(v.render===''){
         v.render=(ext, record, index)=>{
            return <span className="Dropdown_Menu_box">
              <span>删除</span> 
              <span onClick={this.modifyprice}>调价</span> 
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

