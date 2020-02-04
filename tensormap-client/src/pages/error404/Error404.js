import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './Error404.styles'

class Error404 extends React.Component {

  render() {
    return (
        <div>
          Error404
        </div>
    )
  }

}

Error404.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(Error404)
