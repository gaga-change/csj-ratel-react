import React, { useRef, forwardRef, useImperativeHandle } from 'react'

import BaseSearch from './BaseSearch'
import BaseTable from './BaseTable'

const BaseList2 = (props, ref) => {
  const { initialValues = {} } = props
  const baseTable = useRef()
  const baseSearch = useRef()
  const { searchConfig = [], tableConfig = [], api, rowKey = 'id', vertical = 'false', rowSelection } = props
  const handleSearch = params => {
    baseTable.current.updateSearchParms(params)
  }

  useImperativeHandle(ref, () => ({
    fetch: (params) => {
      return baseTable.current.updateSearchParms(params)
    },
    baseSearch,
  }))

  return (<div>
    <BaseSearch
      initialValues={initialValues}
      ref={baseSearch} vertical={vertical} config={searchConfig} onSubmit={handleSearch} />
    <div style={{ overflow: 'hidden' }}>
      {props.children}
    </div>
    <BaseTable className="mt10" ref={baseTable} rowKey={rowKey} api={api} config={tableConfig} rowSelection={rowSelection} />
  </div>)
}

export default forwardRef(BaseList2)