import React, { useRef, forwardRef, useImperativeHandle } from 'react'

import BaseSearch from './BaseSearch'
import BaseTable from './BaseTable'

const BaseList2 = (props, ref) => {
  const baseTable = useRef()
  const { searchConfig = [], tableConfig = [], api, rowKey = 'id', vertical = 'false', rowSelection } = props
  const handleSearch = params => {
    baseTable.current.updateSearchParms(params)
  }
  useImperativeHandle(ref, () => ({
    fetch: () => {
      return baseTable.current.updateSearchParms()
    }
  }))

  return (<div>
    <BaseSearch vertical={vertical} config={searchConfig} onSubmit={handleSearch} />
    <BaseTable ref={baseTable} rowKey={rowKey} api={api} config={tableConfig} rowSelection={rowSelection} />
  </div>)
}

export default forwardRef(BaseList2)