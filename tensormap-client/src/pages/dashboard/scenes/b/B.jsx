import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './B.styles'
import TabPanel     from './assets/Tabs'

class B extends React.Component {

  render() {
    return (
        <div>
          <TabPanel/>
        </div>
    )
  }

}

B.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(B)
