import React, { Component } from 'react'
import HomeDayBar from './HomeDayBar';

export default class HomeDayCard extends Component{
    state={}

    render() {

        return (
            <div>
                <HomeDayBar getDate={this.props.getDate} counter={this.props.counter} />
                Rooms will be here
            </div> 
            
        );
        
    }
}