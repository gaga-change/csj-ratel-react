import React from 'react';
import { Form, Input,Button,DatePicker,Select,Modal} from 'antd';
import _  from 'lodash';
import EditableTable from '@component/editableTable/editableTable'
import SelectionTable from '@component/selectionTable/selectionTable'
import { formTable_config,goodsInStorage_config } from './config'
import SelestForm from './form'
import './addform.scss'

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;

class AddForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      dataSource:[{num:2},{num:3}],
      visible:false,
      goodsInStorage_dataSource:[{id:1},{id:2}],
      selectedRowKeys:[]
    };
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('当前选择的key值 ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  handleDelete = (index) => {
    console.log('这是删除的调用')
    let { dataSource} = this.state;
    dataSource = [...dataSource]
    dataSource.splice(index,1);
    this.setState({dataSource:dataSource})
  }

  handleSubmit = (type,e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(type,values)
      }
    });
  }

  handleRest = ()=>{
    this.props.form.resetFields();
    this.setState({dataSource:[]})
  }

  editableTableChange = (data)=>{
    console.log('这是可编辑表格触发后的调用')
    this.setState({dataSource:data})
    this.props.form.setFieldsValue({dataSource:data});
  }

  handleCancel = ()=>{
    console.log('这是取消选择入库商品弹窗的调用')
    this.setState({visible:false})
  }

  handleOk = ()=>{
    console.log('这是点击选择入库商品弹框确认按钮的调用')
    let {selectedRowKeys} = this.state;
    console.log(selectedRowKeys)
    this.setState({visible:false})
  }

  selectCommoddity = ()=>{
    console.log('这是出现选择入库商品弹窗的调用')
    this.setState({visible:true})
  }

  onSelect = (value) =>{
    console.log('回车搜索',value)
    this.setState({selectedRowKeys:[]})
  }

  componentDidMount(){
    this.props.onRef(this)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { dataSource,visible,goodsInStorage_dataSource,selectedRowKeys} = this.state;
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
              <span onClick={this.handleDelete.bind(this,index)}>删除</span> 
            </span>
         }
      }
      return v
   })

    return (
       <div className="AddForm">
          <Form 
            layout="inline"
            onSubmit={this.handleSubmit} >

            <Form.Item label="客户名称"  {...formItemLayout_left} >
              { getFieldDecorator('客户名称', {
                rules: [{ required: true, message: '请选择客户' }],
              })(
                <Select  style={{width:180}} placeholder="请选择客户">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>Disabled</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item label="计划出库日期"  {...formItemLayout_right} style={{width:400}}>
              { getFieldDecorator('计划出库日期', {
                rules: [{ type: 'array', required: true,message: '请选择计划出库日期' }],
              })(
                <RangePicker style={{width:300}} />
              )}
            </Form.Item>

            <Form.Item label="收货地址" {...formItemLayout_left}>
              { getFieldDecorator('收货地址', {
                rules: [{ required: true, message: '请选择收货地址'}],
              })(
                <Select  style={{width:180}} placeholder="请选择收货地址">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>Disabled</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item label="收货人" {...formItemLayout_right}>
                { getFieldDecorator('收货人', {
                  initialValue:'',
                  rules: [{ required: false, message: '' }],
                })(
                  <Input autoComplete='off' placeholder="请输入收货人" />
                )}
            </Form.Item>
                
            <Form.Item label="手机" {...formItemLayout_left} >
                { getFieldDecorator('手机', {
                  initialValue:'',
                  rules: [{ required: false, message:'请输入正确格式的手机号',pattern:/^1[34578]\d{9}$/ }],
                })(
                  <Input autoComplete='off' placeholder="请输入手机" />
                )}
            </Form.Item>

            <Form.Item label="备注" {...formItemLayout_right}  style={{width:400,minHeight:110}}>
              { getFieldDecorator('备注', {
                initialValue:'',
                rules: [{ required: false }],
              })(
                <TextArea rows={4}  placeholder="请输入备注信息" />
              )}
            </Form.Item>

            <Form.Item  {...formItemLayout_table}>
              { getFieldDecorator('dataSource', {
                initialValue:dataSource,
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
                      dataSource={dataSource} />
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
            width={760}
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
                  onSelectChange={this.onSelectChange}
                  dataSource={goodsInStorage_dataSource}
                  columns={goodsInStorage_config}/>
              </div>
          </Modal>
      </div>);
  }
}

export default Form.create({ name: 'AddForm' })(AddForm);
