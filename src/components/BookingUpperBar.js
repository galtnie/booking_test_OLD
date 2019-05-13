import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';



const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  loginButton: {
    color: '#FBFBFF',
    cursor: 'pointer',
  }
};

class ButtonAppBarBooking extends Component {
  state = {
    dateInput: ''

  }

  dateLimit() {
  let date1 = new Date();
  let date2 = new Date();
  let minLimit = (date1.getDate() + 1) 
  date1.setDate(minLimit)
  let maxLimit = (date2.getDate() + 62)
  date2.setDate(maxLimit)
  return {
    minDate: (date1.toISOString().split("T")[0]),
    maxDate: (date2.toISOString().split("T")[0])
  }
}
  
  onDateInput(value) {
  if (value < this.dateLimit().minDate || value > this.dateLimit().maxDate ) {
    alert('The date must be within 60-day period starting with tomorrow')
  } else {
    let id = "date:" + value.slice(-2) + value.slice(5,7) + value.slice(2,4)
    let distance = document.getElementById(id).offsetTop
    window.scrollBy(0, distance)
  }
}

  signOut(){
    sessionStorage.removeItem('LoggedIn');
    sessionStorage.removeItem('chosenSlots');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('loginDetails');
    this.props.history.push('/login')
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div className="ui input" style={{ paddingRight: '1em' }}>
            <input type='date' min={this.dateLimit().minDate} max={this.dateLimit().maxDate} value={this.state.dateInput} onChange={(e)=>this.setState({dateInput: e.target.value})} style={{ padding: 0, lineHeight: '1em', background: '#FBFBFF' }} />
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft: "0.5em" }} >
                <i className={"search icon " + classes.loginButton} onClick={() => {
                  this.onDateInput(this.state.dateInput)
                 }
                }></i>
              </div>
            </div>
            <div className={classes.grow} />
            <Button className={classes.loginButton} style={{color: "#15cda8", fontWeight: "bold"}} onClick={this.props.confirm}>
                Payment
              </Button>
              <Button className={classes.loginButton} onClick={()=> {this.signOut()}}>
                Log out
              </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBarBooking.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBarBooking);

