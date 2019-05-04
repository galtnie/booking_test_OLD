import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
};

function DayBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static" >
        <Toolbar style={{padding:0, margin:0, minHeight: '40px'}}>
          
          <Typography variant="h6" color="inherit" className={classes.grow} style={{padding:0, margin:0}}>
            News
          </Typography>
         
        </Toolbar>
      </AppBar>
    </div>
  );
}

DayBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DayBar);