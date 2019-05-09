import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
//import withStyles from '@material-ui/core/styles/withStyles';
import { withStyles } from "@material-ui/core/styles";
// import ls from 'local-storage'
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
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
});


class SignIn extends React.Component {
	state = {
		loginInputValue: '',
		passInputValue: '',
		loginInputted: '',
		passInputted: '',
		errorDisplay: 'none',
		loginDetailsList: ''
	}




	getInsideBooking(username) {
		this.setState({ loginInputValue: '' })
		this.setState({ passInputValue: '' })
		sessionStorage.setItem('LoggedIn', username)
		this.props.history.push('/booking')
	}

	checkLoginDetails() {
		console.log(this.state.loginInputted)
		console.log(this.state.passInputted)

		axios.post('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/signIn', 
			{headers: {'Content-Type': 'application/x-www-form-urlencoded'}},
			{data: {email: this.state.loginInputted, password: this.state.passInputted}}
		)
		.then(res => {
		  console.log(res);
		})
		.catch(res => {
			console.log(res);
			this.setState({ errorDisplay: "flex" })
				setTimeout(() => {this.setState({ errorDisplay: "none" }) }, 3000)
			})
		}



		// this.setState({ loginDetailsList: JSON.parse(localStorage.getItem('loginDetails')) })
		// for (let i = 0; i < this.state.loginDetailsList.length; i++) {

		// 	if (this.state.loginInputted.toLowerCase() === this.state.loginDetailsList[i].username.toLowerCase() && this.state.passInputted === this.state.loginDetailsList[i].password) {
		// 		this.getInsideBooking(this.state.loginDetailsList[i].username.toLowerCase())
		// 		break;
		// 	} else {
				// this.setState({ errorDisplay: "flex" })
				// setTimeout(() => {
				// 	this.setState({ errorDisplay: "none" })
				// }, 3000)
		// 	}
		// }

	render() {
		const { classes } = this.props;
		return (
			<main className={classes.main}>
				<CssBaseline />
				<Paper className={classes.paper} >
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
        </Typography>
					<form className={classes.form}>
						<FormControl margin="normal" required fullWidth>
							<InputLabel htmlFor="email">Email Address</InputLabel>
							<Input id="email" name="email" autoComplete="email" autoFocus
								value={this.state.loginInputted}
								onChange={
									(e) => {
										this.setState({ loginInput: e.target })
										this.setState({ loginInputted: e.target.value })
										this.setState({ errorDisplay: "none" });
									}
								} />
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<InputLabel htmlFor="password">Password</InputLabel>
							<Input name="password" type="password" id="password" autoComplete="current-password" onChange={
								(e) => {
									this.setState({ passInput: e.target })
									this.setState({ passInputted: e.target.value })
									this.setState({ errorDisplay: "none" });
								}
							} />
						</FormControl>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/>
						<div style={{ display: "flex", justifyContent: "center", margin: 0, padding: 0, height: "1em" }} >
							<div style={{ color: "red", display: this.state.errorDisplay, }}> The login or password is wrong. </div>
						</div>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={(e) => {
								e.preventDefault()
								this.checkLoginDetails()
							}}
						>
							Sign in
          </Button>
					</form>
					<Link to="/">
						<p style={{ marginTop: "1.5em", color: 'darkblue', textDecoration: 'underline' }} >Return to Home page</p>
					</Link>
				</Paper>
			</main>
		);
	}

}


// SignIn.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(SignIn);