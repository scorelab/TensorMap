import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './A.styles'
import Workflow from './components/Workflow'

class A extends React.Component {

  render() {
    return (
        <Workflow/>
    )
  }

}

A.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(A)
