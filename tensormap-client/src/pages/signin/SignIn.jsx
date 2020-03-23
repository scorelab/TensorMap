import {withStyles} from '@material-ui/core'
import PropTypes    from 'prop-types'
import * as React   from 'react'
import Avatar       from '@material-ui/core/Avatar';
import Button       from '@material-ui/core/Button';
import CssBaseline  from '@material-ui/core/CssBaseline';
import TextField    from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox     from '@material-ui/core/Checkbox';
import Link         from '@material-ui/core/Link';
import Grid         from '@material-ui/core/Grid';
import Box          from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography   from '@material-ui/core/Typography';

const styles = () => {
  return {
    container: {
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      padding: '5vh',
    },
    paper: {
        marginTop: '8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      avatar: {
        margin: '1',
        backgroundColor: '#651FFF',
      },
      form: {
        width: '100%',
        marginTop: '1',
      },
      submit: {
        margin: '3, 0, 2',
      },
  }
}

class SignIn extends React.Component {

  render() {
    const classes = styles()

    return (
      <div style={classes.container}>
      <CssBaseline />
      <div style={classes.paper}>
        <Avatar style={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form style={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                Sign up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://material-ui.com/">
            Your Website
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box> */}
    </div>
    )
  }

}



SignIn.propTypes = {
  theme  : PropTypes.object.isRequired,
}

export default SignIn;
