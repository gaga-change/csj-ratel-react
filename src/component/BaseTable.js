import React from 'react'
import { Table } from 'antd'
import * as Enum from '@lib/enum'
import moment from 'moment'

/*
  api<Function> 接口
  parseData<Function> 接口 - 解析返回的数据
  searchParams<Object> 接口 - 搜索条件
  data = [] // 数据源
  config = [
    { label: '创建人', prop: 'createrName' },
    { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
    { label: '是否虚拟区', prop: 'isVirtual', type: 'enum', enum: 'yesOrNoEnum' },
  ]

  currentChange 单选
  handleSelectionChange 多选
 */
class BaseTable extends React.Component {

  state = {
    data: [],
    pagination: {},
    loading: false,
  }
  searchParams = {}

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
    this.fetch()
  }

  componentWillUnmount() {
    this.setState = () => { }
  }

  /** 校验配置信息是否正确 */
  check() {
    const { config } = this.props
    config.forEach(item => {
      switch (item.type) {
        case 'enum':
          if (Enum[item.enum]) console.error(`枚举【${item.enum}】不存在`)
          break
        default:
          break
      }
    })
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    })
  }

  fetch = (params = {}) => {
    const { api } = this.props
    this.setState({ loading: true })
    api({ pageSize: 10, pageNum: 1, ...params, ...this.searchParams }).then(res => {
      this.setState({ loading: false })
      if (!res) return
      const pagination = { ...this.state.pagination };
      pagination.total = res.data.total;
      const { pageNum, pageSize } = res.data

      this.setState({
        data: (res.data.list || []).map((v, i) => ({ ...v, _index: (pageNum - 1) * pageSize + i + 1 })),
        pagination,
      });
    })
  }

  /** 更新搜索条件 */
  updateSearchParms = (searchParams) => {
    const pagination = { ...this.state.pagination };
    pagination.current = 1
    pagination.pageSize = 10
    this.searchParams = searchParams
    this.setState({
      pagination
    })
    this.fetch()
  }

  render() {
    const { config } = this.props

    const columns = config.map(v => {
      if (v.type === 'enum') {
        return {
          title: v.label,
          dataIndex: v.prop,
          width: v.width,
          render: (val) => {
            if (!Enum[v.enum]) return val
            let temp = Enum[v.enum].find(v => v.value === Number(val))
            return temp ? temp.name : val
          }
        }
      } else if (v.type === 'time') {
        return {
          title: v.label,
          dataIndex: v.prop,
          width: v.width,
          render: (val) => {
            return moment(val).format(v.format || 'YYYY-MM-DD')
          }
        }
      }
      return {
        title: v.label,
        dataIndex: v.prop,
        width: v.width,
        render: v.render
      }
    })

    return (<div>
      <Table
        bordered={true}
        size='small'
        columns={columns}
        rowKey={this.props.rowKey}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
        rowSelection={this.props.rowSelection}
      />
    </div>)
  }
}

export default BaseTable