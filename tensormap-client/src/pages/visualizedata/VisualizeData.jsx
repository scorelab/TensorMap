import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './VisualizeData.styles'
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { saveAs } from 'file-saver';
// import DiscreteSlider from './assets/slider'

// import Checkbox from './Checkbox';

// import ScrollableTabsButtonAuto from './assets/ScrollableTabsButtonAuto'
import { forwardRef } from 'react';
import { template } from '@babel/core';


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


class VisualizeData extends React.Component {
  constructor() {
    super();

    this.state = {
      fileName: "null",
      trainPercentage : "null",
      columnCheckBoxes : [],
      features : [],
      labels :  [],
      columns: [],
      data: [],

           
    }
    
    this.createCheckboxes = this.createCheckboxes.bind(this);
    this.populateCheckBox = this.populateCheckBox.bind(this);
    this.toggleCheckboxChange =this.toggleCheckboxChange.bind(this);
    this.deleteCol = this.deleteCol.bind(this);
    this.sendAddRequest = this.sendAddRequest.bind(this);
    this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
    this.sendEditRequest = this.sendEditRequest.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.saveConfig = this.saveConfig.bind(this);
    this.createFeatureCheckboxes = this.createFeatureCheckboxes.bind(this);
    this.createLabelCheckboxes = this.createLabelCheckboxes.bind(this);
    this.toggleLabelCheckboxChange = this.toggleLabelCheckboxChange.bind(this);
    this.toggleFeatureCheckboxChange = this.toggleFeatureCheckboxChange.bind(this);
    this.getSliderValue = this.getSliderValue.bind(this);



}

  componentWillMount() { 

    // this.setState({fileName: this.props.location.state.fileName })
    this.setState({fileName: "store" })


    let url = "http://127.0.0.1:5000/visualizeData?fileName="
    // url = url.concat(this.props.location.state.fileName)
    url = url.concat("store")
    console.log(url)

    fetch(url, {
      method: 'GET'
    }).then((response) => {
      return response.json();
    }).then((response) => {
      
      var tempcols = [...this.state.columns] 
      for (var column in response.columns) {               
        tempcols.push(response.columns[column]);          
      }
      this.setState({columns:tempcols})
      
      var tempdata = [...this.state.data]
      for (var row in response.data) {       
        tempdata.push(response.data[row]); 
      }   
      this.setState({data:tempdata}); 
      this.populateCheckBox()

   }).catch(function (error) {
      console.log(error);
  }); 

  
  }

  
  saveConfig(){
    // ********************************************************************
    var obj = {trainPercentage: this.state.trainPercentage, fileName: "store", features:this.state.features, labels:this.state.labels}
    var data = JSON.stringify(obj)
    console.log(data)
    fetch("http://127.0.0.1:5000/saveConfig", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    }).then((response) => {
      return response.text();
    }).then((response) => {
      console.log(response)
      alert("Configurations Saved for Experiment")  
   }).catch(function (error) {
      console.log(error);
  }); 

  }

  sendAddRequest(newData){
    console.log(newData)
    // ********************************************************************
    var obj = {rowdata: newData, fileName: "store", columnData:this.state.columns}
    var data = JSON.stringify(obj)
    console.log(data) 

    fetch("http://127.0.0.1:5000/addRow", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    }).then((response) => {
      return response.text();
    }).then((response) => {
      console.log(response)  
   }).catch(function (error) {
      console.log(error);
  }); 
}

  sendDeleteRequest(oldData){
    // ********************************************************************
    var obj = {oldRowData: oldData, fileName: "store"}
    var data = JSON.stringify(obj)
    console.log(data) 

    fetch("http://127.0.0.1:5000/deleteRow", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    }).then((response) => {
      return response.text();
    }).then((response) => {
      console.log(response)  
   }).catch(function (error) {
      console.log(error);
  }); 

  }

  sendEditRequest(newData){

    // ********************************************************************
    var obj = {newRowData: newData, fileName: "store", columnData:this.state.columns}
    var data = JSON.stringify(obj)
    console.log(data) 

    fetch("http://127.0.0.1:5000/editRow", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    }).then((response) => {
      return response.text();
    }).then((response) => {
      console.log(response)  
   }).catch(function (error) {
      console.log(error);
  }); 

  }

  downloadCSV(){
    // ********************************************************************
    var obj = {fileName: "store"}
    var data = JSON.stringify(obj)
    console.log(data) 

    fetch("http://127.0.0.1:5000/downloadCSV", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'blob',
      body: data
    }).then((response) => {
      return response.blob();
    }).then((blob) => {
      var filename = this.state.fileName
      filename = filename.concat(".csv")
      saveAs(blob,filename)  
   }).catch(function (error) {
      console.log(error);
  }); 

  }


  deleteCol(){    
    
    // ********************************************************************
    var obj = {columnData: this.state.columnCheckBoxes, fileName: "store"}
    var data = JSON.stringify(obj)
    console.log(data) 

    fetch("http://127.0.0.1:5000/deleteColumn", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    }).then((response) => {
      return response.json();
    }).then((response) => {

      // var oldCols = [...this.state.columns] 
      var tempcols = []
      for (var column in response.columns) {               
        tempcols.push(response.columns[column]);          
      }
      this.setState({columns:tempcols})
      
      // var oldRows = [...this.state.data]
      var tempdata = []
      for (var row in response.data) {       
        tempdata.push(response.data[row]); 
      }   
      this.setState({data:tempdata}); 
      this.populateCheckBox()

   }).catch(function (error) {
      console.log(error);
  }); 

  }

  populateCheckBox(){
    console.log("IN POPULATE")
    console.log(this.state.columns)
    var tempColumnData = []
    var tempFeatureData = []
    var tempLabels = []
    for (var column in this.state.columns) {
      var obj1 = { title: this.state.columns[column].title, checked: false }
      var obj2 = { title: this.state.columns[column].title, checked: false }
      var obj3 = { title: this.state.columns[column].title, checked: false }
      tempColumnData.push(obj1);
      tempFeatureData.push(obj2);
      tempLabels.push(obj3);
      console.log(tempColumnData)
      this.setState({columnCheckBoxes:tempColumnData});     
      this.setState({features:tempFeatureData});
      this.setState({labels:tempLabels}); 
  }

  }

  toggleCheckboxChange(e){
    console.log(e.target.value);
    var tempData = [...this.state.columnCheckBoxes]
    for (var column in tempData) {
      if (e.target.value == tempData[column].title){
        tempData[column].checked = !(tempData[column].checked)
        break;
      }
    }
    this.setState({columnCheckBoxes:tempData});
    console.log(tempData)      
  }

  toggleLabelCheckboxChange(e){
    console.log(e.target.value);
    var tempData = [...this.state.labels]
    for (var column in tempData) {
      if (e.target.value == tempData[column].title){
        tempData[column].checked = !(tempData[column].checked)
        break;
      }
    }
    this.setState({labels:tempData});
    console.log(tempData)
    console.log(this.state.features)
    console.log(this.state.columnCheckBoxes)

  }


  toggleFeatureCheckboxChange(e){
    
    console.log(e.target.value);
    var tempFeatureData = [...this.state.features]
    var featureColumn = null
    for (var column in tempFeatureData) {   
      console.log(tempFeatureData[column].title)       
      if (e.target.value == tempFeatureData[column].title){
        tempFeatureData[column].checked = !(tempFeatureData[column].checked) 
        featureColumn = tempFeatureData[column]
        console.log(featureColumn)
        break;       
        }    
      }

    this.setState({features:tempFeatureData});
    console.log(tempFeatureData)

    console.log(featureColumn.checked)
    var currentLabels = [...this.state.labels]

    if(featureColumn.checked == true){
      console.log("y")          
      for(var labeldata in currentLabels){
        if (e.target.value == currentLabels[labeldata].title){
          currentLabels.splice(currentLabels.indexOf(currentLabels[labeldata]), 1);
          this.setState({labels:currentLabels});
          break;
        }
      }          
    }
    else if(featureColumn.checked == false){  
      console.log("else")      
        var labelCheckBoxAlter = featureColumn
        labelCheckBoxAlter.checked = false
        currentLabels.splice(tempFeatureData.indexOf(featureColumn), 0,labelCheckBoxAlter);
        this.setState({labels:currentLabels});
      }
    console.log(currentLabels)

    }
    

  createCheckboxes(){
    return this.state.columnCheckBoxes.map((column) => (
      <label>
        {column.title}
       <input
      type="checkbox"
      value={column.title}
      // checked={column.checked}
      onChange={this.toggleCheckboxChange}
      />        
        <br/>
      </label>
    ));    
  }

  createFeatureCheckboxes(){
    return this.state.features.map((column) => (
      <label>
        {column.title}
       <input
      type="checkbox"
      value={column.title}
      // checked={column.checked}
      onClick={this.toggleFeatureCheckboxChange}
      />        
        <br/>
      </label>
    ));
  }

  createLabelCheckboxes(){
    return this.state.labels.map((column) => (
      <label>
        {column.title}
       <input
      type="checkbox"
      value={column.title}
      // checked={column.checked}
      onChange={this.toggleLabelCheckboxChange}
      />        
        <br/>
      </label>
    ));
  }

  getSliderValue(e){
    this.setState({trainPercentage: e.target.value})
  }


  render() {
    const {sampleData} = this.state;
    const {classes} = this.props;
    const {match} = this.props;

    

    return (
      <div className={classes.container}>
      <div className={classes.visualizeHeader}>
        {/* <ScrollableTabsButtonAuto/> */}
        <div>
          <label>Choose colums to delete:</label>
          <br/>
            {this.createCheckboxes()}
            <button type="button"  onClick={this.deleteCol}>Delete</button>          
        </div>
        <div><button type="button"  onClick={this.downloadCSV}>Download CSV</button> </div>
        <div>
          Experiment Configurations:
        <div>
          <label>Choose Features:</label>
          <br/>
            {this.createFeatureCheckboxes()}                      
        </div>
        <div>
          <label>Choose Label:</label>
          <br/>
            {this.createLabelCheckboxes()}
        </div>
        <div>
        <label>Select Test Data Percentage</label><br/>
        <input type="range" min="1" max="90" className={classes.slider} onInput={this.getSliderValue} />  
        <button type="button"  onClick={this.saveConfig}>Save Configurations</button>      
        </div>
        </div>
        </div>
        <div style={{ maxWidth: "100%" }}>
        <MaterialTable
        icons={tableIcons}
      title={this.state.fileName}
      columns={this.state.columns}
      data={this.state.data}
      options={{
        filtering: true
      }}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tempdata = [...this.state.data];
              tempdata.push(newData);
              this.setState({data:tempdata});
              console.log(newData);
              this.sendAddRequest(newData);
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              console.log(oldData)
              const tempdata = [...this.state.data];
              tempdata.splice(tempdata.indexOf(oldData), 1);
              this.setState({data:tempdata});
              console.log(oldData);
              this.sendDeleteRequest(oldData);
            }, 600);
          }),
          onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tempdata = [...this.state.data];
              tempdata[tempdata.indexOf(oldData)] = newData;
              this.setState({data:tempdata});
              console.log(oldData);
              console.log(newData);
              this.sendEditRequest(newData);
            }, 600);
          }),
      }}
    />
        </div>
      </div>
    )
  }


}

VisualizeData.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(VisualizeData)




 