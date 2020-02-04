import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './SignIn.styles'

class SignIn extends React.Component {

  render() {
    const {classes} = this.props

    return (
        <div>Sign In</div>
    )
  }

}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(SignIn)
