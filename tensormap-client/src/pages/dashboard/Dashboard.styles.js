const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
  },

  toolbar: theme.mixins.toolbar,

  content: {
    flexGrow: 1,
  },
});

export default styles
