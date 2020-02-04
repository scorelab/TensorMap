import {withStyles}    from '@material-ui/core/styles'
import PropTypes       from 'prop-types'
import React           from 'react'
import {Route, Router} from 'react-router-dom'
import styles          from './App.styles'
import {history}       from './helpers'
import {Dashboard}     from './pages/dashboard'

class App extends React.Component {

  render() {
    const {classes} = this.props

    return (
        <div className={classes.root}>
          <Router history={history}>
            <div>
              <Route path="/" component={Dashboard}/>
              {/*<PrivateRoute exact path="/" component={Dashboard}/>*/}
              {/*<Route path="/login" component={SignIn}/>*/}
              {/*<Route path="/register" component={SignUp}/>*/}
            </div>
          </Router>
        </div>
    )
  }

}

App.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(App)
