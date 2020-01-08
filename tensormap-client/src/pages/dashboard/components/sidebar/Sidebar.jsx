import {withStyles}     from '@material-ui/core'
import Divider          from '@material-ui/core/Divider/index'
import Drawer           from '@material-ui/core/Drawer/index'
import Hidden           from '@material-ui/core/Hidden/index'
import List             from '@material-ui/core/List/index'
import ListItem         from '@material-ui/core/ListItem/index'
import ListItemIcon     from '@material-ui/core/ListItemIcon/index'
import ListItemText     from '@material-ui/core/ListItemText/index'
import ListSubheader    from '@material-ui/core/ListSubheader/index'
import FindInPageIcon   from '@material-ui/icons/FindInPage'
import FileCopyIcon     from '@material-ui/icons/FileCopy';
import HomeIcon         from '@material-ui/icons/Home'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import PropTypes        from 'prop-types'
import * as React       from 'react'
import {Link}           from 'react-router-dom'
import styles           from './Sidebar.styles'


class Sidebar extends React.Component {

  state = {
    mobileOpen: false,
  }

  handleDrawerToggle = () => {
    this.setState(state => ({mobileOpen: !state.mobileOpen}))
  }

  render() {
    const {classes, theme} = this.props


    const drawer = (
        <div>
          <List
              component="nav"
              subheader={<ListSubheader component="div">TensorMap</ListSubheader>}
          >
            <ListItem button component={Link} to="/home">
              <ListItemIcon>
                <HomeIcon/>
              </ListItemIcon>
              <ListItemText inset primary="Home"/>
            </ListItem>
            <Divider/>
            <ListItem button component={Link} to="/viewdata">
              <ListItemIcon>
                <FileCopyIcon/>
              </ListItemIcon>
              <ListItemText inset primary="View Datasets"/>
            </ListItem>
            <ListItem button component={Link} to="/adddata">
              <ListItemIcon>
                <LibraryBooksIcon/>
              </ListItemIcon>
              <ListItemText inset primary="Pre-processing"/>
            </ListItem>
            <ListItem button component={Link} to="/neuralnet">
              <ListItemIcon>
                <LibraryBooksIcon/>
              </ListItemIcon>
              <ListItemText inset primary="Neural Networks"/>
            </ListItem>
            <ListItem button component={Link} to="/data">
              <ListItemIcon>
                <FindInPageIcon/>
              </ListItemIcon>
              <ListItemText inset primary="Data"/>
            </ListItem>
            <Divider/>
          </List>
        </div>
    )

    return (
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
                // container={this.props.container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
    )
  }

}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme  : PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(Sidebar)
