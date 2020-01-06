import React from 'react'
import { parse } from 'qs';

class ReportList extends React.Component {

  componentDidMount() {
    const _ = () => {
      let { u } = parse(this.props.history.location.search.slice(1))
      console.log(u)
    }
    _()
    this.props.history.listen(() => {
      _()
    })
  }



  render() {
    const { location } = this.props
    let { u } = parse(location.search.slice(1))
    return (<div style={{ width: '100%', height: '100%' }}>
      {/* {location.search} */}
      <iframe title="报表"
        src={`http://bi.csjmro.com/WebReport/ReportServer?reportlet=${u}`}
        style={{ width: '100%', height: '100%', 'background-color': 'rgb(255, 255, 255)', border: 'none' }}
      >
      </iframe>
    </div>)
  }
}

export default ReportList