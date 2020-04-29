import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
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

const BaseTable2 = (props, ref) => {
  const { config, rowKey, rowSelection, api, className } = props
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(false)
  const [columns] = useState(() => config.map(v => {
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
  }))
  const searchParams = useRef({})
  const handleTableChange = (pagination) => {
    const pager = { pagination };
    pager.current = pagination.current;
    setPagination(pager)
    fetch({
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    })
  }

  const fetch = (params = {}) => {
    setLoading(true)
    return api({ pageSize: 10, pageNum: 1, ...params, ...searchParams.current }).then(res => {
      setLoading(false)
      if (!res) return
      const { pageNum, pageSize } = res.data
      setData((res.data.list || []).map((v, i) => ({ ...v, _index: (pageNum - 1) * pageSize + i + 1 })))
      setPagination(pagination => {
        pagination.total = res.data.total
        return { ...pagination }
      })
    })
  }

  useImperativeHandle(ref, () => ({
    updateSearchParms: (params) => {
      setPagination(pagination => {
        pagination.current = 1
        pagination.pageSize = 10
        return { ...pagination }
      })
      if (params) searchParams.current = params
      return fetch()
    }
  }))

  useEffect(() => {
    fetch()
  }, [])


  return (<div>
    <Table
      className={className}
      bordered={true}
      size='small'
      columns={columns}
      rowKey={rowKey}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
      rowSelection={rowSelection}
    />
  </div>)

}

export default forwardRef(BaseTable2)