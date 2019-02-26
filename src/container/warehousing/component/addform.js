import React from 'react';
import { Form, Input,Button,DatePicker,Select,Modal } from 'antd';
import _  from 'lodash';
import request from '@lib/request'
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
    this.getCommodity()
    
  }

  onSelect = (value) =>{
    console.log('回车搜索',value)
    this.setState({selectedRowKeys:[]})
  }

  getCommodity = ()=>{
    request({
      url: '/webApi/sku/info/select',
      method: 'get',
    }).then(res => {
       console.log(res)
    }).catch(err => {
       console.log(err)
    })
  }

  componentDidMount(){
    this.props.onRef(this)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { dataSource,visible,goodsInStorage_dataSource,selectedRowKeys} = this.state;

    const formItemLayout_left = {
      labelCol: {
        span:9
      },
      wrapperCol: {
        span:15
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

                <Form.Item label="计划入库仓库" {...formItemLayout_left}>
                  { getFieldDecorator('计划入库仓库', {
                    rules: [{ required: true, message: '请选择计划入库仓库' }],
                  })(
                    <Select  style={{width:180}} placeholder="请选择计划入库仓库">
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </Form.Item>
 
                 <Form.Item label="计划入库日期"  {...formItemLayout_right}>
                  { getFieldDecorator('计划入库日期', {
                     rules: [{ type: 'array', required: true,message: '请选择计划入库日期' }],
                  })(
                     <RangePicker />
                  )}
                </Form.Item>

                <Form.Item label="备注" {...formItemLayout_left} style={{width:300,minHeight:110}}>
                  { getFieldDecorator('备注', {
                    initialValue:'',
                    rules: [{ required: false }],
                  })(
                    <TextArea rows={4} placeholder="请输入备注信息" />
                  )}
                </Form.Item>

                <Form.Item  {...formItemLayout_table}>
                  { getFieldDecorator('dataSource', {
                    initialValue:dataSource,
                    rules: [{ required: true }],
                  })(
                     <div className="form_item_table">
                        <div className="alert_Btn">
                          <Button type="primary"  onClick={this.selectCommoddity}>选择入库商品</Button>
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

                <Form.Item {...formItemLayout_button}>
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
            title="选择入库商品"
            centered={true}
            width={760}
            visible={visible}
            destroyOnClose={true}
            onOk={this.handleOk}
            onCancel={this.handleCancel}>
              <div className="selectCommodityModal">
                <SelestForm 
                  className='CommodityFormArert'
                  onSubmit={this.onSelect} 
                  selectWordsArr={['商品名称','查询']}/>
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
