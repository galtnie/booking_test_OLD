import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import DatePickers from './DateInputNOTNEEDED'
import { Link } from 'react-router-dom';


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

function ButtonAppBar(props) {
    const { classes } = props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div className="ui input" style={{ paddingRight: '1em' }}>
              <input type='date' style={{ padding: 0, lineHeight: '1em', background: '#FBFBFF' }} />
            </div>
            <div className={classes.grow} />
            <Link to="/login">
              <Button className={classes.loginButton}>
                Login
            </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(ButtonAppBar);