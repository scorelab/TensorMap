import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './ViewData.styles'
import Table from './assets/Table'

class ViewData extends React.Component {
  constructor() {
    super();
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", 'http://localhost:5000/viewData', false);
    Httpreq.send(null);
    this.state = {
      data:JSON.parse(Httpreq.responseText),
    };
  }


  render() {
    console.log(this.state.data);

    return (
        <Table data={this.state.data}/>
    )
  }

}

ViewData.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(ViewData)
