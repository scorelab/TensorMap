import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './AddData.styles'


class AddData extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fileName: "null",
      fileType : "null",
      fileData : "null"
    };

  }
  
  validateFileType(e)
  {
    //var name = null
    let filepath= e.target.value;
    var ext = filepath.substring(filepath.lastIndexOf('.') + 1);
    this.setState({fileData:e.target.files[0]}) 
    if(this.state.fileType === "null"){
      e.target.value = ""
      alert("Select File Type");
    }
    else{
      if(ext !== this.state.fileType ) {
        e.target.value = ""
        alert("Unsupported File Type");
      }    
    }
  }

  updateFileType(e)
  {
    this.setState({fileType: e.target.value});    
  }

  handleSubmit(e)
  {
    e.preventDefault();

    if(this.state.fileType === "null" || this.state.fileData === "null"){
      alert("Select File Type And Upload File")
    }
    else{

      const data = new FormData();
      data.append('file', this.state.fileData);

      fetch('http://127.0.0.1:5000/addData', {
        method: 'POST',
        body: data,
      }).then((response) => {
        return response.text();
      }).then((responseText) => {
        if(responseText === "error"){
          alert ("Dataset with identical name already exists");
        }
        else{
          this.props.history.push(
            '/visualize',
            {
              fileName: responseText,
            }
          )
        }       
     }).catch(function (error) {
      console.log(error);
    });
      
  }

  }

  render() {

    const {classes} = this.props
  
    return (
        <div className={classes.container}>
        <form onSubmit={this.handleSubmit.bind(this)}>
        	<label>File Type:</label>  
          <select name="data_format" className={classes.text} onChange={this.updateFileType.bind(this)}>
            <option value="null">Select Type of File</option>
            <option value="csv">csv</option>
          </select><br/>
          <label>Select file: </label>        	
          <input type="file" name="dataset_csv" className={classes.browse} accept=".csv" onChange={this.validateFileType.bind(this)}></input><br/>
        	<input type="submit" value="Upload" className={classes.submit}></input>
        </form>
        </div>
    )
  }

}

AddData.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(AddData)
