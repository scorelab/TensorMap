const styles = (theme) => ({
  appBar    : {
    marginLeft                  : 240,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - 240px)`,
    },
  },
  menuButton: {
    marginRight                 : 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
})

export default styles
