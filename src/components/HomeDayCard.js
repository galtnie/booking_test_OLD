import React, { Component } from 'react'
import HomeDayBar from './HomeDayBar';

export default class HomeDayCard extends Component{
    state={}

    // renderHourCards() {
    //     let hours = []
    //     for (let i = 0; i<=23; i++){
    //         hours.push(
    //         <div> 
    //             `${i}"`
    //         </div>
    //         )
            
    //     }
        
    //     return  
    //         hours
        
    // }

    render() {
        console.log('anchor name' + this.props.anchor)
        return (
            <div> 
                <a href={this.props.anchor}></a>
                <HomeDayBar date={this.props.date} />
                {/* {this.renderHourCards()} */}
            </div> 
            
        );
        
    }
}