import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import DateInput from './DateInput';
import Typography from '@material-ui/core/Typography';
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
  state = {


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
  
//   onDateInput(value) {
//   if (value < this.dateLimit().minDate || value > this.dateLimit().maxDate ) {
//     alert('The date must be within 60-day period starting with tomorrow')
//   } else {
//     let id = "date:" + value.slice(-2) + value.slice(5,7) + value.slice(2,4)
//     let distance = document.getElementById(id).offsetTop
//     window.scrollBy(0, distance)
//   }
// }

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
            paddingBottom: "1em",}}>

            <DateInput handleDateInput={this.props.handleDateInput}
                        dateInput = {this.props.dateInput}
                        controlDateInput = {this.props.controlDateInput}
             />

{/* 
            <div className="ui input" style={{ paddingRight: '1em' }}>
            <input type='date' min={this.dateLimit().minDate} max={this.dateLimit().maxDate} value={this.state.dateInput} onChange={(e)=>this.setState({dateInput: e.target.value})} style={{ padding: 0, lineHeight: '1em', background: '#FBFBFF' }} />
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft: "0.5em" }} >
                <i className={"search icon " + classes.loginButton} onClick={() => {
                  this.onDateInput(this.state.dateInput)
                 }
                }></i>
              </div>
            </div>
            <div className={classes.grow} /> */}


            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}> 
              <i className={`${this.props.back}-previous-day big caret left icon`} onClick={(e)=>{
                if (this.props.back === "inactive") {
                  e.preventDefault()
                } else {
                  this.props.handleDayChange(false)
                }
              }}>
              </i>
              <Typography variant="h6" className='grow' >
               {this.props.date} 
              </Typography> 
              <i className={"next-day big caret right icon"} onClick={()=>{this.props.handleDayChange(true)}}>
              </i>
            </div>

            <div>
              <Button className={classes.loginButton} style={{color: "#15cda8", fontWeight: "bold"}} onClick={this.props.confirm}>
                Payment
              </Button>
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

