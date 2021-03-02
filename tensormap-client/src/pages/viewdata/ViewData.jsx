import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import * as React from 'react'
import styles from './ViewData.styles'
import Table from './assets/Table'

class ViewData extends React.Component {
  constructor() {
    super();
    this.getData();
    this.state = {
      data: [],
    };
  }

  getData = () => {
    var Httpreq = new XMLHttpRequest();

    // get a callback when the server responds
    Httpreq.addEventListener('load', () => {
      // update the state of the component with the result here
      console.log(Httpreq.responseText)
    })
    // open the request with the verb and the url
    Httpreq.open('GET', 'http://127.0.0.1:5000/viewData', false)
    // send the request
    // Httpreq.send()
}


render() {
  const { classes } = this.props

  return (
    <Table data={this.state.data} />
  )
}

}

ViewData.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(ViewData)
