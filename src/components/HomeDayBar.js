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

export default class HomeDayBar extends Component {
  state = {}

  cardDate() {
    const fullDate = new Date(this.props.getDate(this.props.counter))
    const monthOption = { month: 'long'};
    const weekdayOption = { weekday: 'long'};
    const date =  fullDate.getDate()
    const month = new Intl.DateTimeFormat('en-GB', monthOption).format(fullDate)
    const weekday = new Intl.DateTimeFormat('en-GB', weekdayOption).format(fullDate) 
    return (`${date} ${month}, ${weekday}`)
  }
  
  render() {
    return (
      <div className='root'>
        <AppBar position="static" >
          <Toolbar className='toolbar'>
            
            <Typography variant="h6" className='grow'>
              {this.cardDate()}
            </Typography>
            <a href="#top">Back to Top</a> 
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}