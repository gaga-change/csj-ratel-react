import React from 'react'
import _  from 'lodash';
import Sider from '../../component/sider/sider'
import SearchForm from './component/search'
import AddForm from './component/add'
import AddressForm from './component/address'
import FetchTable from '@component/fetchTable/fetchTable'
import { indexTableColumnsConfig,addressTableColumnsConfig } from './component/config'
import { Button, Modal,Tag } from 'antd'
import fetchData from '@lib/request'
import {connect} from 'react-redux';
import './customer.scss'

@connect(
  state=>state
)

export default class Customer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      pagination: {

      },
      visible_addCustomer: false,
      visible_address: false,
      visible_operation:false,
      dataSource: [{ id: 1 }],
      activeOperation:'新增地址',
      address_dataSource:[{},{}]
    }
  }

  onSubmit = (type, value) => {
    console.log(type, value)
    this.setState({ visible_addCustomer: false })
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    const { info } = this.props.info
    fetchData({
      url: '/webApi/customer/list',
      method: 'post',
      data: {
        pageSize: 10,
        pageNum: 1,
        ownerCode: info.ownerCode
      }
    }).then(res => {
      console.log(res);
      res.list.forEach((item, index) => item.index = index + 1)
      this.setState({ dataSource: res.list })
    }).catch(err => {
      console.log(err);
    })
  }

  showAddCustomer = () => {
    this.setState({ visible_addCustomer: true })
  }

  showAddress = () => {
    this.setState({ visible_address: true })
  }

  handleCancel = (type) => {
    if(type==='visible_operation'){
      this.setState({visible_operation:false})
    } else{
      this.setState({ visible_addCustomer: false,visible_address:false })
    }
  }

  handleOk = (e) => {
    this.child.handleSubmit(e)
  }

  ref = res => {
    this.child = res
  }

  operationAddress = (type,value)=>{
    console.log('这是新增地址或者修改地址的回调',type,value)
    this.setState({visible_operation:true})
  }

  render() {
    const { dataSource, visible_addCustomer, visible_address,activeOperation,visible_operation,address_dataSource} = this.state
    const columns=_.cloneDeep(indexTableColumnsConfig).map(v => {
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return (
            <span className="Dropdown_Menu_box">
              <span onClick={this.showAddress}>维护地址</span>
              <span>删除</span>
            </span>
          )
        }
      }
      return v
    })

    const address_columns=_.cloneDeep(addressTableColumnsConfig).map(v=>{
      if (v.render === '') {
        v.render = (ext, record, index) => {
          return (
            <span>
              {
                v.renderType==='operation'&&
                <span className="Dropdown_Menu_box">
                  <span onClick={this.operationAddress.bind(this,'update',record)}>修改</span>
                  <span>删除</span>
               </span>
              }
              {
                 v.renderType==='tag'&&
                 <span className="Dropdown_Menu_box">
                   {/* <span>设为默认</span> */}
                   <Tag color="volcano">默认地址</Tag>
                 </span>
              }
            </span>
          )
        }
      }
      return v
    })

    return (
      <div className="Customer">
        <Sider history={this.props.history} />
        <SearchForm
          selectWordsArr={['客户名称','负责人','手机']}
          onSubmit={this.onSubmit.bind(this, 'search')} />
        <div className="Customer_addBtn">
          <Button type="primary" onClick={this.showAddCustomer}>
             新增客户
          </Button>
        </div>

        <FetchTable
          dataSource={dataSource}
          columns={columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange} />


        <Modal
          title="新增客户"
          okText="保存"
          centered={true}
          bodyStyle={{ paddingBottom: 0 }}
          visible={visible_addCustomer}
          onCancel={this.handleCancel}
          onOk={this.handleOk}>
          <AddForm
            onRef={this.ref}
            onSubmit={this.onSubmit.bind(this, 'add')}/>
        </Modal>

        <Modal
          title="维护地址"
          width={1000}
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          footer={null}
          onCancel={this.handleCancel}
          visible={visible_address}>
            <div className="alert_Btn">
              <Button type="primary" onClick={this.operationAddress.bind(this,'add')}>新增地址</Button>
            </div>
            <FetchTable
              dataSource={address_dataSource}
              useIndex={true}
              columns={address_columns}
              loading={false}
              pagination={false}/>
        </Modal>

        <Modal
          title={activeOperation}
          width={1000}
          destroyOnClose={true}
          centered={true}
          bodyStyle={{ paddingBottom: 16 }}
          footer={null}
          onCancel={this.handleCancel.bind(this,'visible_operation')}
          visible={visible_operation}>
          <AddressForm
            onSubmit={this.onSubmit.bind(this, 'address')}/>
        </Modal>
      </div>
    )
  }
}
