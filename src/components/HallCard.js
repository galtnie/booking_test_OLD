import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import red from '@material-ui/core/colors/red';
import '../css/Home.css';

const styles = theme => ({
  card: {
    maxWidth: 400,
    margin: "0.2em"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', 
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});


class HallCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={[classes.card, this.props.cssClass].join(' ')} >
        <div 
            style={{
                height: "6em", 
                display:"Flex", 
                flexDirection: "column", 
                justifyContent:"center" , 
                alignItems:"center", 
                padding:"1em"}} 
            className={this.props.cssClass}>
            <div>
                <h3>
                    {this.props.title}
                </h3>
            </div>
        </div>
        
        <CardMedia
          className={classes.media}
          image={this.props.image}        
        />
        <CardContent className={this.props.cssClass}>
            {this.props.description}
        </CardContent>
      </Card>
    );
  }
}

HallCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HallCard);