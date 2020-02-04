import {withStyles} from '@material-ui/core'
import AppBar       from '@material-ui/core/AppBar/index'
import IconButton   from '@material-ui/core/IconButton/index'
import Toolbar      from '@material-ui/core/Toolbar/index'
import Typography   from '@material-ui/core/Typography/index'
import MenuIcon     from '@material-ui/icons/Menu'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import styles       from './Header.styles'

class Header extends React.Component {
  state = {
    mobileOpen: false
  }

  
 

  render() {
    const {classes} = this.props

    return (
      // <div style = {{position:'relative',zIndex:'200000000'}}>

        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.props.handleClick}
                className={classes.menuButton}
            >
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6"  color="inherit" noWrap>
              [Title]
            </Typography>
          </Toolbar>
        </AppBar>
        // </div>

    )
  }

}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(Header)
