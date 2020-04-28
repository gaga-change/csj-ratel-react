import React from 'react';
import _ from 'lodash';
import { Button, message } from 'antd';
import { stringify, parse } from 'qs';
import request from '@lib/request'
import SelectingTable from '../../component/selectionTable/selectionTable'
import { indexTableColumnsConfig } from './component/config'
import moment from "moment"
import { messageRead } from 'api'

import './message.scss'
export default class Stock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pagination: {

      },
      loading: false,
      exportLoding: false,
      selectedRowKeys: [],
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (json) => {
    this.setState({ loading: true })
    let { search, pathname } = this.props.history.location
    let { current, pageSize, ...rest } = parse(search.slice(1))
    let { dataSource, pagination } = this.state;
    if (!Object.keys(pagination).length) {
      pagination = {
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 10
      }
      this.setState({ pagination })
    }
    let data = {};
    if (json) {
      data = { ...pagination, ...json, messageType: 0 };
    } else {
      data = { ...pagination, ...rest, messageType: 0 };
    }

    delete data.total;
    this.props.history.replace(`${pathname}?${stringify(data)}`)
    data.pageNum = data.current;
    delete data.current;

    request({
      url: '/webApi/messageNotice/selectByPageList',
      method: 'post',
      data: data
    }).then(res => {
      if (res.list && Array.isArray(res.list)) {
        res.list.forEach(item => {
          item.statusName = item.messageStatus === 0 ? '未读' : '已读'
        })
        dataSource = res.list
        pagination.total = res.total
      }
      this.setState({
        dataSource,
        pagination,
        loading: false,
        selectedRowKeys: [],
        totalIds:[]
      })
    }).catch(err => {
      this.setState({
        loading: false,
      })
    })
  }

  fetchAll = ()=>{
    let { totalIds } = this.state;
    request({
      url: '/webApi/messageNotice/selectByPageList',
      method: 'post',
      data: {current:1, pageSize:100000, messageType:0 }
    }).then(res => {
      if (res.list && Array.isArray(res.list)) {
        const ids=[]
        res.list.forEach(item => {
          ids.push(item.id)
        })
        totalIds = ids
      }
      this.setState({
        totalIds
      })
      this.handleRead(totalIds)
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    }, () => {
      this.fetch()
    })
  }

  handleRead(data){
    if(data && data.length>0){
      messageRead(data).then(res => {
        if(res.code==='200' || res.code==='success'){
          message.success('操作成功')
          this.fetch()
        }
      }).catch(err => {
      })
    }
  }

  handleReadAll(){
    const { totalIds }=this.state
    console.log(this.state.totalIds)
    this.handleRead(totalIds)
  }

  onSelectChange = (selectedRowKeys, other) => {
    this.setState({ selectedRowKeys })
    setTimeout(()=>{
      this.handleRead(this.state.selectedRowKeys)
    },10)
  }

  onSubmit = (type, value) => {
    let { pagination } = this.state;
    if (type === "select") {
      if (Array.isArray(value.createTime)) {
        value.gmtCreateStart = moment(value.createTime[0]).valueOf()
        value.gmtCreateEnd = moment(value.createTime[1]).valueOf()
      }
      if (!Object.keys(value).length) {
        pagination = {
          current: 1,
          pageSize: 10
        }
      }
      this.setState({ pagination }, () => {
        this.fetch(value)
      })
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    const { dataSource } = this.state;
    const columns = _.cloneDeep(indexTableColumnsConfig)
    return (
      <div className="Stock"  >
        <div>
          <Button data-rule-id="warehousing-create" type="primary" onClick={() => this.fetchAll()}>标记全部已读</Button>
        </div>
        <SelectingTable
          selectedRowKeys={this.state.selectedRowKeys}
          dataSource={dataSource}
          columns={columns}
          rowKey={"id"}
          onSelectChange={this.onSelectChange}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange} />
      </div>
    );
  }
}



