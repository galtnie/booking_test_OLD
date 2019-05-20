import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import DateInput from './DateInput';

import '../css/BookingUpperBar.css';

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
  state = {}

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

  signOut(){
    sessionStorage.removeItem('LoggedIn');
    sessionStorage.removeItem('chosenSlots');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('token');
   
    this.props.history.push('/login')
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
        <Toolbar style={{display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: "1em",
            paddingBottom: "1em",
            flexWrap: "wrap",
            alignContent: "flex-start",
            width: "100%"
            }}>

            <DateInput handleDateInput={this.props.handleDateInput}
                        dateInput = {this.props.dateInput}
                        controlDateInput = {this.props.controlDateInput}
             />




            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "sans-serif", 
              fontSize: "1.3em",  
            }}> 


              <i className={`${this.props.back}-previous-day big caret left icon`} style={{margin: 0, padding: 0, width:"0.6em"}}
                onClick={(e)=>{
                if (this.props.back === "inactive") {
                  e.preventDefault()
                } else {
                  this.props.handleDayChange(false)
                }
              }}>
              </i>
              {this.props.date} 
              <i className={"next-day big caret right icon"} style={{margin: 0, padding: 0, width:"0.6em"}}
                onClick={()=>{this.props.handleDayChange(true)}}>
              </i>


            </div>

            <div>
              <Button className={classes.loginButton} onClick={()=> {this.signOut()}}>
                Log out
              </Button>
            </div>
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

