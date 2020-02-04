const styles = theme => ({
  drawer     : {
    [theme.breakpoints.up('sm')]: {
      width     : 240,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: 240,
  },
})

export default styles
