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
 
  render() {
    return (
      <div className='root'>
        <AppBar position="static" >
          <Toolbar className='toolbar'>   
            <Typography variant="h6" className='grow'>
              {this.props.date}
            </Typography>
            <a href="#top" className='toolbarTop'>Back to Top</a> 
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}