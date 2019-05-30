import React from 'react';
import { Button } from 'antd';
import _ from 'lodash';
import { stringify, parse } from 'qs';
import request from '@lib/request'
import FetchTable from '../../component/fetchTable/fetchTable'
import { indexTableColumnsConfig } from './component/config'
import CommodityForm from './component/form'

import './stock.scss'
export default class Stock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pagination: {

      },
      loading: false,
      count: {},
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
      data = { ...pagination, ...json };
    } else {
      data = { ...pagination, ...rest };
    }

    delete data.total;
    this.props.history.replace(`${pathname}?${stringify(data)}`)
    data.pageNum = data.current;
    delete data.current;

    request({
      url: '/webApi/stock/page',
      method: 'get',
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
      console.log(err)
      this.setState({
        loading: false,
      })
    })

    request({
      url: '/webApi/stock/count',
      method: 'get',
      data: data
    }).then(res => {
      this.setState({ count: res })
    }).catch(err => {
      console.log(err)
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
    const { dataSource, count } = this.state;
    const columns = _.cloneDeep(indexTableColumnsConfig)
    let { search } = this.props.history.location;
    return (
      <div className="Stock"  >
        <CommodityForm onSubmit={this.onSubmit.bind(this, 'select')} />
        <div className="alert_Btn">
          <div className="Total">
            {
              count.totalInventoryTotal !== undefined &&
              <span className="Total_list">
                <span>可用库存合计 ：{count.totalInventoryTotal}</span>
                <span></span>
              </span>
            }

            {
              count.totalInventoryLockQuantity !== undefined &&
              <span className="Total_list">
                <span>锁定库存合计 ：{count.totalInventoryLockQuantity}</span>
                <span></span>
              </span>
            }
          </div>
          <a href={`/webApi/stock/export${search}`}>
            <Button type="primary">库存导出</Button>
          </a>
        </div>
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



