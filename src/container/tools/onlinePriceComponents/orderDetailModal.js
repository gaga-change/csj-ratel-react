import React from 'react';
import { Modal } from 'antd';

import BaseCard from '@component/baseCard/baseCard'
import BaseTitle from '@component/baseTitle/baseTitle'
import FetchTable from '@component/fetchTable/fetchTable'

export const BaseCard_Config = [
  {
    title: '业务单编号',
    dataIndex: 'busiBillNo',
  },
  {
    title: '计划出库日期',
    dataIndex: 'arrivalPreDate',
    type: 'time'
  },
  {
    title: '出库仓库',
    dataIndex: 'warehouseName',
  },
  {
    title: '计划出库总量',
    dataIndex: 'planOutQty',
  },
  {
    title: '客户编码',
    dataIndex: 'arrivalCode',
  },
  {
    title: '客户名称',
    dataIndex: 'arrivalName',
  },
  {
    title: '备注',
    dataIndex: 'remarkInfo',
  },
  {
    title: '创建人',
    dataIndex: 'busiBillCreater',
  },
  {
    title: '创建日期',
    dataIndex: 'busiBillCreateTime',
    type: 'time'
  },
  {
    title: '状态',
    dataIndex: 'billStatus',
    useLocalEnum: 'billStatusEnum'
  },
  {
    title: '详细地址',
    dataIndex: 'arrivalAddress',
  },
]

export const warehousingDetail_Config = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '商品编码',
    dataIndex: 'skuCode',
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
  },
  {
    title: '品牌',
    dataIndex: 'skuBrandName',
  },
  {
    title: '规格型号',
    dataIndex: 'skuFormat',
  },
  {
    title: '单位',
    dataIndex: 'skuUnitName',
  },
  {
    title: '单价(销售价)',
    dataIndex: 'outStorePrice',
  },
  {
    title: '计划出库量',
    dataIndex: 'skuOutQty',
  },
  {
    title: '已出库量',
    dataIndex: 'realOutQty',
  }
]

const OrderDetailModal = props => {
  const { detail, visible, onClose } = props

  const warehousingDetail_dataSource = detail.busiBillDetails.map(v => {
    v.billNo = detail.billNo;
    return v;
  });

  const handleCancel = () => {
    onClose && onClose()
  }

  return (
    <Modal
      title="出库业务单详情"
      className=""
      visible={visible}
      width={1000}
      footer={false}
      destroyOnClose={true}
      onCancel={handleCancel}>
      <div className="">
        <BaseTitle title="基本信息" />
        <BaseCard columns={BaseCard_Config} dataSource={detail} />
        <BaseTitle title="相关明细" />
        <FetchTable
          pagination={{ pageSize: 10 }}
          useIndex={true}
          columns={warehousingDetail_Config}
          dataSource={warehousingDetail_dataSource} />
      </div>
    </Modal>
  )
}

export default OrderDetailModal