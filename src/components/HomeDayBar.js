import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import '../css/HomeDayBar.css'
import DateInput from './DateInput';



export default class HomeDayBar extends Component {
  state = {

  }

  render() {
    return (
      <div className='root'>
        <AppBar position="static" >

          <Toolbar className='toolbar' style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: "1em",
            paddingBottom: "1em",
          }}>
            <DateInput />
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}> 
              <i className={"active-previous-day big caret left icon"} >
              </i>
              <Typography variant="h6" className='grow'>
                {this.props.date}
              </Typography> 
              <i className={"next-day big caret right icon"} >
              </i>
            </div>
            <div>
              <span onClick={() => window.scrollTo(0, 0)} className='toolbarTop'>
                Back to Top
              </span> 
            </div>
            

            
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}