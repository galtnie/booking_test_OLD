import React from "react";
import PropTypes from "prop-types";
// import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
// import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
// import { ListItemSecondaryAction } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link, Redirect } from 'react-router-dom';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  container: {
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '25em'
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

class SignUpForm extends React.Component {
  state = {
    email: '',
    password: '',
    confirmPass: '',

  };


handleEmailChange(e) {
  return this.setState ({ email: e.target.value})
}

handlePasswordChange(e) {
  return this.setState ({ paddword: e.target.value})
}

handlePasswordConfirmationChange(e) {
  return this.setState ({ confirmPass: e.target.value})
}


  render() {
    console.log(this.state.email)
    console.log(this.state.password)
    console.log(this.state.confirmPass)

    if (typeof sessionStorage.getItem('LoggedIn') !== "string") {
      const { classes } = this.props;
      return (
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper} >
            <form className={classes.container} autoComplete="off">
              {/* noValidate */}
              <p style={{ fontSize: "1.25em" }}>
                CREATE YOUR ACCOUNT
          </p>
              <TextField
                id="outlined-email-input"
                label="Email"
                className={classes.textField}
                type="email"
                name="email"
                autoComplete="email"
                margin="normal"
                variant="outlined"
                onChange={this.handleEmailChange.bind(this)}
              />

              <TextField
                id="outlined-password-input"
                label="New password"
                className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                onChange={this.handlePasswordChange.bind(this)}
              />

              <TextField
                id="outlined-password-confirm-input"
                label="Confirm new password"
                className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                onChange={this.handlePasswordConfirmationChange.bind(this)}
              />
              <div style={{marginRight: "15em"}}>

                <Checkbox
                  checked={this.state.checkedB}
                  
                  value="checkedB"
                  color="primary"  
                />
                <span>Show password</span>
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Create account
        </Button>
            </form>
            <Link to="/">
              <p style={{ marginTop: "1.5em", color: 'darkblue', textDecoration: 'underline' }} >Return to Home page</p>
            </Link>
          </Paper>
        </main>
      );

    } else {
      alert('If you want to create a new account log out firstly.')
      return <Redirect to='/booking' />
    }
  }
}

SignUpForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignUpForm);
