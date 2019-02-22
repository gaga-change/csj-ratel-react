import React from 'react';
import { Form, Input,Button,DatePicker,Select } from 'antd';
import EditableTable from '@component/editableTable/editableTable'
import { formTable_config } from './config'
import './addform.scss'

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;

class AddForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      dataSource:[{num:2},{num:3}],
      columns:formTable_config
    };
  }

  componentDidMount(){
    let {columns}=this.state;
    columns=columns.map(v=>{
       if(v.render!==undefined){
          v.render=(ext, record, index)=>{
             return <span className="Dropdown_Menu_box">
               <span onClick={this.handleDelete.bind(this,index)}>删除</span> 
             </span>
          }
       }
       return v
    })
    this.setState({columns})
    this.props.onRef(this)
  }

  handleDelete = (index) => {
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
    this.setState({dataSource:data})
    this.props.form.setFieldsValue({dataSource:data});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { dataSource,columns} = this.state;
    dataSource=dataSource.map((v,i)=>{
      return {...v,key:i,index:i+1}
    })
    const formItemLayout = {
      labelCol: {
        span:4
      },
      wrapperCol: {
        span:12
      },
    };

    return (
       <div className="AddForm">
          <Form 
            onSubmit={this.handleSubmit} >

                <Form.Item label="计划入库仓库" {...formItemLayout}>
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
 
                 <Form.Item label="计划入库日期"  {...formItemLayout}>
                  { getFieldDecorator('计划入库日期', {
                     rules: [{ type: 'array', required: true,message: '请选择计划入库日期' }],
                  })(
                     <RangePicker />
                  )}
                </Form.Item>

                <Form.Item label="备注" {...formItemLayout}>
                  { getFieldDecorator('备注', {
                    initialValue:'',
                    rules: [{ required: false }],
                  })(
                    <TextArea rows={4} placeholder="请输入备注信息" />
                  )}
                </Form.Item>

                <Form.Item >
                  { getFieldDecorator('dataSource', {
                    initialValue:dataSource,
                    rules: [{ required: true }],
                  })(
                     <div className="form_item_table">
                        <div className="alert_Btn">
                          <Button type="primary"  onClick={this.add}>创建入库业务单</Button>
                         </div>
                        <EditableTable 
                          pagination={false}
                          onChange={this.editableTableChange}
                          rowClassName={() => 'editable-row'}
                          columns={columns} 
                          dataSource={dataSource} />
                     </div>
                  )}
                </Form.Item>

                <Form.Item  style={{ textAlign: 'right' }}>
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
      </div>);
  }
}

export default Form.create({ name: 'AddForm' })(AddForm);
