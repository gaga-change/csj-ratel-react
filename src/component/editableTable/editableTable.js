import React from 'react';
import * as Enum from '@lib/enum';
import moment from 'moment'
import {Table, Input, Form,InputNumber} from 'antd';
import './editableTable.scss'

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      inputType='Input',
      editable,
      dataIndex,
      title,
      record,
      rules,
      index,
      handleSave,
      ...restProps
    } = this.props;
    let InputDom=Input;
    if(inputType==='InputNumber'){
      InputDom=InputNumber;
    }
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules:rules?rules:[{
                        required: true,
                        message: `该项为必填`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                        <InputDom
                          ref={node => (this.input = node)}
                          onPressEnter={this.save}
                        />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}


export default class EditableTable extends React.Component {

  handleSave = (row) => {
    let { dataSource,onChange} = this.props;
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    if(onChange){
      onChange(newData)
    }
  }

  render() {
    const componentsDefaul = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    let { columns=[],dataSource=[],useIndex=false,size='small',locale={emptyText:'暂无数据' },components=componentsDefaul,bordered=true,...rest } = this.props;

    columns = columns.map((v,i) => {
      v.key=i+1;
      if(v.type){ 
        switch(v.type){
          case 'time':v.render=(item)=>moment(Number(item)).format(v.format||'YYYY-MM-DD');break;
          default:break;
        }
      } else if(v.useLocalEnum){
        v.render=(item)=>Enum[v.useLocalEnum].find(eItem=>eItem.key===Number(item))&&Enum[v.useLocalEnum].find(eItem=>eItem.key===Number(item))['value']
      } else if(v.editable){
        v={
          ...v,
          onCell: record => ({
            record,
            editable: v.editable,
            dataIndex: v.dataIndex,
            title: v.title,
            rules:v.rules,
            handleSave: this.handleSave,
            inputType:v.inputType
          }),
        }
      }

      return v

    });

    if(Array.isArray(dataSource)){
      dataSource=dataSource.map((v,i)=>{
        if(!this.props.rowKey){
          v.key=i+1;
        }
        if(useIndex){
          v.index=i+1;
        }
        return v;
      }) 
    }
    
    return (
      <div className="EditableTable">
        <Table
          components={components}
          bordered={bordered}
          dataSource={dataSource}
          columns={columns}
          size={size}
          locale={locale}
          {...rest}
        />
      </div>
    );
  }
}
