import React from 'react';
import _ from 'lodash';
import { stringify, parse } from 'qs';
import request from '@lib/request'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig } from './component/config'
import CommodityForm from './component/form'
import moment from "moment"

import './finace.scss'
export default class Stock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pagination: {

      },
      loading: false,
      exportLoding: false
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
      data = { ...pagination, ...json, messageType: 1 };
    } else {
      data = { ...pagination, ...rest, messageType: 1 };
    }

    delete data.total;
    delete data.createTime;
    this.props.history.replace(`${pathname}?${stringify(data)}`)
    data.pageNum = data.current;
    delete data.current;

    request({
      url: '/webApi/messageNotice/selectByPageList',
      method: 'post',
      data: data
    }).then(res => {
      if (res.list && Array.isArray(res.list)) {
        dataSource = res.list
        pagination.total = res.total
      }
      this.setState({
        dataSource,
        pagination,
        loading: false,
      })
    }).catch(err => {
      this.setState({
        loading: false,
      })
    })
  }


  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination
    }, () => {
      this.fetch()
    })
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
        <CommodityForm onSubmit={this.onSubmit.bind(this, 'select')} />
        <FetchTable
          dataSource={dataSource}
          columns={columns}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange} />
      </div>
    );
  }
}



