import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './ViewData.styles'

class ViewData extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.getDeleteHandler = this.getDeleteHandler.bind(this);
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", 'http://localhost:5000/viewData', false);
    Httpreq.send(null);
    this.state = {
      currentPage: 1,
      datasetsPerPage: 2,
      data: JSON.parse(Httpreq.responseText)
    };
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  getEditHandler(idx) {
    return function() {
      document.getElementById('name_' + idx).innerHTML = '<input type="text" value="' + document.getElementById('name_' + idx).innerHTML + '"></input>';
      document.getElementById('save_' + idx).style.display = '';
      document.getElementById('cancel_' + idx).style.display = '';
      document.getElementById('edit_' + idx).style.display = 'none';
    }
  }

  getSaveHandler(idx) {
    return function () {
      var string = document.getElementById('name_' + idx).childNodes[0].value;
      var Httpreq = new XMLHttpRequest();
      Httpreq.open("GET", 'http://localhost:5000/updateData?id=' + idx + '&name=' + string, true);
      Httpreq.send(null);
      document.getElementById('edit_' + idx).style.display = '';
      document.getElementById('save_' + idx).style.display = 'none';
      document.getElementById('cancel_' + idx).style.display = 'none';
      document.getElementById('name_' + idx).innerHTML = document.getElementById('name_' + idx).childNodes[0].value;
    }
  }

  getCancelHandler(idx) {
    return function () {
      document.getElementById('edit_' + idx).style.display = '';
      document.getElementById('save_' + idx).style.display = 'none';
      document.getElementById('cancel_' + idx).style.display = 'none';
      document.getElementById('name_' + idx).innerHTML = document.getElementById('name_' + idx).getAttribute('data-text');
    }
  }

  getDeleteHandler(idx) {
    return function() {
      var Httpreq = new XMLHttpRequest();
      Httpreq.open("GET", 'http://localhost:5000/deleteData?id=' + idx, true);
      Httpreq.send(null);
      document.getElementById('datarow_' + idx).remove();
    }
  }

  renderEditButton(idx) {
    const {classes} = this.props
    return <button className={classes.editbtn} id={'edit_' + idx} onClick={this.getEditHandler(idx)}>Edit</button>
  }

  renderSaveButton(idx) {
    const {classes} = this.props
    var styles = {
      display: 'none',
    }
    return <button style={styles} className={classes.savebtn} id={'save_' + idx} onClick={this.getSaveHandler(idx)}>Save</button>
  }

  renderCancelButton(idx) {
    var styles = {
      display: 'none',
    }
    const {classes} = this.props
    return <button style={styles} className={classes.canbtn} id={'cancel_' + idx} onClick={this.getCancelHandler(idx)}>Cancel</button>
  }

  renderDeleteButton(idx) {
    const {classes} = this.props
    return <button className={classes.delbtn} onClick={this.getDeleteHandler(idx)}>Delete</button>
  }

  renderViewButton() {
    const {classes} = this.props
    return <button className={classes.viewbtn}>View Dataset</button>
  }

  renderDatasets(data) {
    const {classes} = this.props
    return data.map((ele, idx) => {
      return <tr id={'datarow_' + ele.id}><td id={'name_' + ele.id} className={classes.datatabletd} data-text={ele.name}>{ele.name}</td><td className={classes.datatabletd}>{ele.fileFormat}</td><td className={classes.datatabletd}>{this.renderEditButton(ele.id)}{this.renderSaveButton(ele.id)}{this.renderCancelButton(ele.id)}</td><td className={classes.datatabletd}>{this.renderDeleteButton(ele.id)}</td><td className={classes.datatabletd}>{this.renderViewButton(ele.id)}</td></tr>;
    });
  }

  render() {
    const {classes} = this.props
    const {currentPage, datasetsPerPage, data} = this.state;
    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(data.length/datasetsPerPage); i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      if(number == currentPage) {
        return (
          <a id={number} onClick={this.handleClick} className={classes.paginationbtnactive}>{number}</a>
        )
      }
      else {
        return (
          <a id={number} onClick={this.handleClick} className={classes.paginationbtn}>{number}</a>
        )
      }
    });
    const indexOfLast = currentPage * datasetsPerPage;
    const indexOfFirst = indexOfLast - datasetsPerPage;
    const currentData = data.slice(indexOfFirst, indexOfLast);

    return (
        <div className={classes.container}>
          <table id="dataTable" className={classes.datatable} border="1">
            <tr>
              <th className={classes.datatableth}> Dataset Name </th>
              <th className={classes.datatableth}> Dataset Type </th>
              <th className={classes.datatableth}> Edit option </th>
              <th className={classes.datatableth}> Delete option </th>
              <th className={classes.datatableth}> View dataset </th>
            </tr>
            {this.renderDatasets(currentData)}
          </table><br/>
          <div className={classes.pagination}>
            {renderPageNumbers}
          </div>
        </div>
    )
  }

}

ViewData.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(ViewData)
