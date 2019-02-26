import React from 'react';
import { Menu, Dropdown, Icon,Button,Modal } from 'antd';
import _  from 'lodash';
import Sider from '../../component/sider/sider'
import FetchTable from '../../component/fetchTable/fetchTable'
import SelestForm from './component/form'
import { indexTableColumns_Config,indexTableColumns_ChildConfig ,warehousingDetail_Config,BaseCard_Config} from './component/config'
import AddForm from './component/addform'
import BaseCard from '@component/baseCard/baseCard'
import BaseTitle from '@component/baseTitle/baseTitle'
import './outgoing.scss'

export default class Outgoing extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,
      visible:false,
      detailVisible:false,
      pagination: {
      
      },
      dataSource:[{id:1,ceshi:123,childData:[{id:3,ceshi:123},]},{id:2,childData:[{id:4},]}],
      warehousingDetail_dataSource:[{},{}],
      BaseCard_dataSource:{orderId:123232323,time:1551002063632}
    }
  }

  onSubmit = (type,value)=>{
    console.log('这是提交的调用',type,value)
    if(type!=='select'){
      this.setState({visible:false})
      if(this.child){
        this.child.handleRest()
      }
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('这是分页的调用',pagination)
  }

  add = ()=>{
    console.log('这是出现创建入库单弹窗调用')
    this.setState({visible:true})
  }

  fetch = ()=>{
    console.log('这是请求数据的调用')
  }

  showDetail = () =>{
    this.setState({detailVisible:true})
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


  render() {
    const { dataSource,visible,detailVisible,warehousingDetail_dataSource,BaseCard_dataSource} =this.state;
    
    const columns=_.cloneDeep(indexTableColumns_Config).map(v=>{
      if(v.render===''){
         v.render=(ext, record, index)=>{
            return <span className="Dropdown_Menu_box">
              <span onClick={this.showDetail}>查看</span> 
              <Dropdown overlay={
                  <Menu className="Dropdown_Menu_child">
                     <Menu.Item>
                       <span>删除</span>
                     </Menu.Item>
                     <Menu.Item>
                       <span>提交</span>
                     </Menu.Item>
                     <Menu.Item>
                   </Menu.Item>
                </Menu>
              }>
                <span className="ant-dropdown-link">
                   更多操作 <Icon type="down" />
                </span>
              </Dropdown>
            </span>
         }
      }
      return v
    })

    const childTable=(record)=>{
      return <FetchTable 
               columns={indexTableColumns_ChildConfig}  
               dataSource={record.childData} 
               pagination={false}/>
    }

    return (
      <div className="Outgoing">
          <Sider history={this.props.history} />

          <SelestForm 
            onSubmit={this.onSubmit.bind(this,'select')} 
            selectWordsArr={['商品名称','状态','创建日期','客户名称','查询重置','联系人电话']}/>
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
              title="创建入库业务单"
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
              title="入库业务单详情"
              className="Outgoing_detail_modal"
              visible={detailVisible}
              width={1000}
              footer={false}
              destroyOnClose={true}
              onCancel={this.handleCancel}>
                <div className="warehousing_detail">
                   <BaseTitle title="基本信息"/>
                   <BaseCard  columns={BaseCard_Config} dataSource={BaseCard_dataSource}/>
                   <BaseTitle title="相关明细"/>
                   <FetchTable 
                     useIndex={true}
                     columns={warehousingDetail_Config}
                     dataSource={warehousingDetail_dataSource} />
                </div>
            </Modal>
      </div>
    );
  }
}


