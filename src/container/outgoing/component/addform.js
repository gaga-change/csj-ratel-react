import React from 'react';
import { Form, Input,Button,DatePicker,Select,Modal,message} from 'antd';
import _  from 'lodash';
import request from '@lib/request'
import EditableTable from '@component/editableTable/editableTable'
import SelectionTable from '@component/selectionTable/selectionTable'
import {arrivalMap} from '@publickApi/map'
import { formTable_config,goodsInStorage_config } from './config'
import SelestForm from './form'
import './addform.scss'

const { TextArea } = Input;
const Option = Select.Option;

class AddForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      items:[],
      visible:false,
      goodsInStorage_dataSource:[],
      selectedRowKeys:[],
      arrival:{},
      arrivalConfig:[],
      arrivalAddressConfig:[]
      
    };
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('当前选择的key值 ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  handleDelete = (record) => {
    let {selectedRowKeys} = this.state;
    let items=this.props.form.getFieldValue('items');
    let selectedRowKeys_index=selectedRowKeys.findIndex(v=>v===record.id);
    let items_index=items.findIndex(v=>v.id===record.id);
    if(selectedRowKeys_index>=0){
      selectedRowKeys.splice(selectedRowKeys_index,1)
    }
    if(items_index>=0){
      items.splice(items_index,1)
    }
    this.setState({selectedRowKeys,items});
    this.props.form.setFieldsValue({items});
  }

  handleSubmit = (type,e) => {
    let { arrival } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(type,{...values,...arrival})
      }
    });
  }

  handleRest = ()=>{
    this.props.form.resetFields();
    this.setState({items:[],arrivalConfig:[],arrivalAddressConfig:[]})
  }

  editableTableChange = (data)=>{
    console.log('这是可编辑表格触发后的调用')
    this.setState({items:data})
    this.props.form.setFieldsValue({items:data});
  }

  handleCancel = ()=>{
    console.log('这是取消选择入库商品弹窗的调用')
    this.setState({visible:false})
  }

  handleOk = ()=>{
    let {selectedRowKeys,goodsInStorage_dataSource} = this.state;
    let selectedItems=this.props.form.getFieldValue('items')
    let newItems=[];
    goodsInStorage_dataSource.forEach(item=>{
      if(selectedRowKeys.includes(item.id)){
        let index=selectedItems.findIndex(v=>v.id===item.id);
        if(index>=0){
          newItems.push(selectedItems[index]) 
        } else{
          newItems.push(item)
        }
      }
    })
    this.setState({visible:false,items:newItems})
    this.props.form.setFieldsValue({items:newItems});
  }

  selectCommoddity = ()=>{
    let {goodsInStorage_dataSource}=this.state;
    this.setState({visible:true})
    if(!goodsInStorage_dataSource.length){
      this.getCommodity()
    }
  }

  onSelect = (value) =>{
    this.getCommodity(value)
    console.log('回车搜索',value)
    this.setState({selectedRowKeys:[]})
  }

  componentDidMount(){
    this.props.onRef(this);
    this.fetchArriva()
  }


  fetchArriva = ()=>{
    let { arrivalConfig } = this.state;
    if(arrivalConfig.length>0){
      return 
    }
    arrivalMap().then(res=>{
      this.setState({arrivalConfig:res})
    }).catch(err=>{
       console.log(err)
    })
  }


  onSelectOptionChange = (value,option)=>{
    let { arrival } = this.state;
    let options=option.props;
    arrival.arrivalCode=options.value;
    arrival.arrivalName=options.children;
    this.setState({arrival})
    this.custAddrListApi(arrival.arrivalCode)
  }

  arrivalAddressChange = (value,option) =>{
    let { arrivalAddressConfig } = this.state;
    let index=arrivalAddressConfig.findIndex(v=>v.id===value);
    if(index>=0){
      this.props.form.setFieldsValue({
        arrivalAddress:arrivalAddressConfig[index]['arrivalAddress'],
        arrivalLinkName:arrivalAddressConfig[index]['receiverName'],
        arrivalLinkTel:arrivalAddressConfig[index]['receiverTel']
      });
    }
  }


  custAddrListApi = (basicCustomerInfoCode)=>{
    let { arrival } = this.state;
    if(this.props.form.getFieldValue('arrivalCode')===arrival['arrivalCode']){
      return 
    }
    request({
      url:'/webApi/base/custAddr/list',
      method:'post',
      data:{ basicCustomerInfoCode }
    }).then(res => {
      let arrivalAddressConfig=res.map(v=>{
        v.arrivalAddress=`${v.customerCity}/${v.customerProvince}/${v.customerArea} ( 详细地址: ${v.customerAddress} )`;
        return v;
      })
       this.setState({ arrivalAddressConfig })
       let index=res.findIndex(v=>v.isDefault===1);
         if(index>=0){
          this.props.form.setFieldsValue({
            arrivalAddressId:arrivalAddressConfig[index]['id'],
            arrivalAddress:arrivalAddressConfig[index]['arrivalAddress'],
            arrivalLinkName:arrivalAddressConfig[index]['receiverName'],
            arrivalLinkTel:arrivalAddressConfig[index]['receiverTel']
          });
        } else{
          this.props.form.setFieldsValue({
            arrivalAddressId:'',
            arrivalAddress:'',
            arrivalLinkName:'',
            arrivalLinkTel:''
          });
        }
    }).catch(err => {
      console.log(err)
    })
  }


  getCommodity = (value={})=>{
    this.setState({selectionTableLoding:true})
    let json={
      url:'/webApi/stock/list',
      method:'get'
    }
    if(value){
      json.data=value
    }
    request(json).then(res => {
       this.setState({selectionTableLoding:false,goodsInStorage_dataSource:res||[]})
    }).catch(err => {
       console.log(err)
       this.setState({selectionTableLoding:false})
    })
  }

  onFocus = (type)=>{
    this.props.form.validateFields([type],(errors, values) => {
      if(errors){
        message.error('请先选择客户')
      } else{
        let { arrival } = this.state;
        this.custAddrListApi(arrival.arrivalCode)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { items,visible,arrivalConfig,arrivalAddressConfig,goodsInStorage_dataSource,selectedRowKeys,selectionTableLoding} = this.state;
    const formItemLayout_left = {
      labelCol: {
        span:7
      },
      wrapperCol: {
        span:17
      },
      style:{
        width:300,
        height:60
      }
    };

    const formItemLayout_arrivalAddress={
      labelCol: {
        span:2
      },
      wrapperCol: {
        span:22
      },
      style:{
        width:'100%',
        height:60
      }
    }

    const formItemLayout_right = {
      labelCol: {
        span:8
      },
      wrapperCol: {
        span:16
      },
      style:{
        width:400,
      }
    };

    const formItemLayout_table = {
      labelCol: {
        span:0
      },
      wrapperCol: {
        span:24
      },
      style:{
        width:'100%',
        marginBottom:12
      }
    };

    const formItemLayout_button = {
      style:{
        display:'flex',
        justifyContent: 'flex-end'
      }
    };

    const columns=_.cloneDeep(formTable_config).map(v=>{
      if(v.render === ''){
         v.render=(ext, record, index)=>{
            return <span className="Dropdown_Menu_box">
              <span onClick={this.handleDelete.bind(this,record)}>删除</span> 
            </span>
         }
      }
      return v
   })


   const checkArrivalAddress = (rule, value, callback) => {
    if(!this.props.form.getFieldValue('arrivalCode')) {
      callback('请先选择客户')
    } else {
      callback()
    }
  }

   const filterOption=(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0||option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
    return (
       <div className="AddForm">
          <Form 
            layout="inline"
            onSubmit={this.handleSubmit} >

            <Form.Item label="客户名称"  {...formItemLayout_left} >
              { getFieldDecorator('arrivalCode', {
                rules: [{ required: true, message: '请选择客户' }],
              })(
                <Select  
                  showSearch 
                  onFocus={this.fetchArriva}
                  style={{width:180}}
                  filterOption={filterOption}
                  placeholder="请选择客户" 
                  onChange={this.onSelectOptionChange}>
                  {
                    arrivalConfig.map(v=><Option key={v.customerCode} value={v.customerCode}>{v.customerName}</Option>)
                  }
                </Select>
              )}
            </Form.Item>

            <Form.Item label="计划出库日期"  {...formItemLayout_right} style={{width:400}}>
              { getFieldDecorator('planOutTime', {
                rules: [{ required: true,message: '请选择计划出库日期' }],
              })(
                <DatePicker/>
              )}
            </Form.Item>

            {/* 该组件为隐藏组件和下面显示的下拉框配合使用 */}
           
            <Form.Item label="收货地址" style={{display:'none'}}>
              { getFieldDecorator('arrivalAddress', {
                rules: [{ required: false}],
              })(
                 <Input autoComplete='off' placeholder="请输入收货地址" />
              )}
            </Form.Item>

            <Form.Item label="收货地址" {...formItemLayout_arrivalAddress}>
              { getFieldDecorator('arrivalAddressId', {
                rules: [{ 
                  required: true, 
                  message: '请选择收货地址',
                  validator:checkArrivalAddress
                }],
              })(
                <Select  style={{width:620}} onChange={this.arrivalAddressChange}  placeholder="请选择收货地址" onFocus={this.onFocus.bind(this,'arrivalAddressId')}>
                   {
                    arrivalAddressConfig.map(v=><Option key={v.id} value={v.id}>{v.arrivalAddress}</Option>)
                   }
                </Select>
              )}
            </Form.Item>

            <Form.Item label="收货人" {...formItemLayout_left}>
                { getFieldDecorator('arrivalLinkName', {
                  initialValue:'',
                  rules: [{ required: false, message: '' }],
                })(
                  <Input autoComplete='off'   placeholder="请输入收货人" />
                )}
            </Form.Item>
                
            <Form.Item label="手机" {...formItemLayout_right} >
                { getFieldDecorator('arrivalLinkTel', {
                  initialValue:'',
                  rules: [{ required: false, message:'请输入正确格式的手机号',pattern:/^1[34578]\d{9}$/ }],
                })(
                  <Input autoComplete='off'  placeholder="请输入手机" />
                )}
            </Form.Item>

            <Form.Item label="备注" {...formItemLayout_left}  style={{width:300,minHeight:110}}>
              { getFieldDecorator('remarkInfo', {
                initialValue:'',
                rules: [{ required: false }],
              })(
                <TextArea rows={4}  placeholder="请输入备注信息" />
              )}
            </Form.Item>

            <Form.Item  {...formItemLayout_table}>
              { getFieldDecorator('items', {
                initialValue:items,
                rules: [{ required: true }],
              })(
                  <div className="form_item_table" style={{width:'100%'}}>
                    <div className="alert_Btn">
                      <Button type="primary"  onClick={this.selectCommoddity}>选择出库商品</Button>
                    </div>
                    <EditableTable 
                      pagination={false}
                      useIndex={true}
                      onChange={this.editableTableChange}
                      rowClassName={() => 'editable-row'}
                      columns={columns} 
                      dataSource={items} />
                  </div>
              )}
            </Form.Item> 

            
              <Form.Item {...formItemLayout_button} >
                <Button
                    type="primary"
                    style={{marginRight:'12px'}}
                    onClick={this.handleSubmit.bind(this,'save')}>
                      保存
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.handleSubmit.bind(this,'submit')}
                    htmlType="submit">
                      提交
                  </Button>
              </Form.Item>
          </Form> 

          <Modal
            title="选择出库商品"
            centered={true}
            destroyOnClose={true}
            width={1000}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}>
              <div className="selectCommodityModal">
                <SelestForm 
                  className='CommodityFormArert'
                  onSubmit={this.onSelect} 
                  selectWordsArr={['商品名称','仓库','查询']}/>
                <SelectionTable
                  rowKey="id"
                  selectedRowKeys={selectedRowKeys}
                  loading={selectionTableLoding}
                  onSelectChange={this.onSelectChange}
                  dataSource={goodsInStorage_dataSource}
                  columns={goodsInStorage_config}/>
              </div>
          </Modal>
      </div>);
  }
}

export default Form.create({ name: 'AddForm' })(AddForm);
