import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

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
    passwordInputType: 'password',
	errorDisplay: "none",
	errorValue: ''
  };


  handleEmailChange(e) {
	if (this.state.errorDisplay === 'block') {
		this.setState({ errorDisplay: "none" })
		this.setState({ errorValue: '' })
	}
	return this.setState({ email: e.target.value })
  }

  handlePasswordChange(e) {
    if (this.state.errorDisplay === 'block') {
	  this.setState({ errorDisplay: "none" })
	  this.setState({ errorValue: '' })
    }
    return this.setState({ password: e.target.value })
  }

  handlePasswordConfirmationChange(e) {
    if (this.state.errorDisplay === 'block') {
		this.setState({ errorDisplay: "none" })
		this.setState({ errorValue: '' })
    }
    return this.setState({ confirmPass: e.target.value })
  }

  handleCheckboxClick(e) {
    if (e.target.checked)
      return this.setState({ passwordInputType: 'text' })
    else
      return this.setState({ passwordInputType: 'password' })
  }

  handleSubmit(e) {
    if (this.state.confirmPass !== this.state.password) {
      e.preventDefault();
	  this.setState({ errorDisplay: 'block' })
	  this.setState({ errorValue: 'You password and confirmation password do not match'})
    } else {

		e.preventDefault();
      axios.post('https://web-ninjas.net/signUp',
      //axios.post('http://ec2-35-175-143-145.compute-1.amazonaws.com:4000/signUp',
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
			{ data: { email: this.state.email, password: this.state.password } }
			)
			.then(res => {
				this.props.history.push('/login')
			})
			.catch(res => {
				if (res.message === "Request failed with status code 500") {
					this.setState({ errorDisplay: 'block' })
					this.setState({ errorValue: 'This email is already registered. Enter a unique one.'})
					this.setState({ email: ''})
					
					setTimeout( 
						()=>{
						this.setState({ errorDisplay: "none" }) 
						this.setState({ errorValue: "" }) 
						}, 3000
					)
				}
			}
		)
    }
}

  	render() {
    if (typeof sessionStorage.getItem('LoggedIn') !== "string") {
      const { classes } = this.props;
      return (
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper} >
            <form className={classes.container} autoComplete="off">
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
                value={this.state.email}
              />

              <TextField
                id="outlined-password-input"
                label="New password"
                className={classes.textField}
                type={this.state.passwordInputType}
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                onChange={this.handlePasswordChange.bind(this)}
                value={this.state.password}
              />

              <TextField
                id="outlined-password-confirm-input"
                label="Confirm new password"
                className={classes.textField}
                type={this.state.passwordInputType}
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                onChange={this.handlePasswordConfirmationChange.bind(this)}
                value={this.state.confirmPass}
              />
              <div style={{ marginRight: "15em" }}>

                <Checkbox
                  onClick={this.handleCheckboxClick.bind(this)}
                  value="checkedB"
                  color="primary"
                />
                <span>Show password</span>
              </div>
              <div style={{height: "2em"}}>
                <div style={{
                  color: "red",
                  display: this.state.errorDisplay
                }}>
                  {this.state.errorValue}
                </div>
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.handleSubmit.bind(this)}
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

export default withStyles(styles)(SignUpForm);
