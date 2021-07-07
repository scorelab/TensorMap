import {withStyles} from '@material-ui/core'
import Button       from '@material-ui/core/Button';
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
      data: JSON.parse(Httpreq.responseText),
      sortedAscending: 'UNSORTED'
    };
  }

  sortHandler() {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("POST", 'http://localhost:5000/sortData', false);
    let requestData = null;
    if (this.state.sortedAscending) {
      requestData = JSON.stringify({
        sortingType: 'ASCENDING'
      });
    } else {
      requestData = JSON.stringify({
        sortingType: 'DESCENDING'
      });
    }
    Httpreq.send(requestData);
    this.setState({
      data: JSON.parse(Httpreq.responseText),
      sortedAscending: !this.state.sortedAscending
    })
  }

  sortButton() {
    return (
      <Button variant="contained" color="primary" onClick={this.sortHandler}>
        {this.state.sortedAscending ? "Sort by Descending" : "Sort by Ascending"}
      </Button>
    )
  }


  render() {
    console.log(this.state.data);
    const {classes} = this.props

    return (
      <>
        {this.sortButton()}
        <Table data={this.state.data}/>
      </>
    )
  }

}

ViewData.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(ViewData)
