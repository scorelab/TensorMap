import {withStyles} from '@material-ui/core'
import CssBaseline  from '@material-ui/core/CssBaseline'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import {Route}      from 'react-router-dom'
import {Home}       from './scenes/home'
import {A}        from './scenes/a'
import {B}        from './scenes/b'
import {Header}     from './components/header'
import {Sidebar}    from './components/sidebar'
import {AddData}       from '../adddata'
import {ViewData}      from '../viewdata'
import {VisualizeData} from '../visualizedata'
import styles       from './Dashboard.styles'
import { baseURL } from '../../config';

class Dashboard extends React.Component {


  componentWillMount() { 

    var obj = {user_id:"1", experimet_type: "regression"}
    var data = JSON.stringify(obj)    
    console.log(data)
    fetch(baseURL + "/createExperiment", {
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



  render() {
    const {classes} = this.props
    console.log(window.location.href);
    var url_ = new URL(window.location.href);
    console.log(url_);
    return (

        <div className={classes.root}>
          <CssBaseline/>
          {url_.pathname !== '/neuralnet' &&
              <Header/>
          }
          <Sidebar/>
          <main className={classes.content}>
            {url_.pathname !== '/neuralnet' &&
                <div className={classes.toolbar}/>
            }

            <Route exact path='/home' component={Home}/>
            <Route exact path='/neuralnet' component={A}/>
            <Route exact path='/data' component={B}/>
            <Route exact path="/adddata" component={AddData}/>
            <Route exact path="/visualize/:id" component={VisualizeData}/>
            <Route exact path="/viewdata" component={ViewData}/>
          </main>
        </div>
    )
  }

}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(Dashboard)
