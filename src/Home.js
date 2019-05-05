import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import ButtonAppBar from './components/HomeUpperBar';
import HomeDayCard from './components/HomeDayCard';

import { RedFree, RedBusy } from './components/Rooms'
import './css/Home.css'

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        

    },
    title: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', 
        alignItems: 'center',
        color: '#7D6B91',
        paddingTop: '2em',
        paddingBottom: '1em',
        marginLeft: "0.5em",
        marginRight: "0.5em",
    }
}


export default class Home extends Component {
     
    state= {
        myClasses: styles
    }

    calculateDate(counter) {
        let date = new Date();
        var nextDate = date.getDate() + counter;
        date.setDate(nextDate);
        var newDate = date.toLocaleString();
        return newDate;
    }

    renderDayCards() {
        let a = []
        for(let i=1; i<32; i++) {
            a.push(<HomeDayCard getDate={this.calculateDate} counter={i}/>)
        }
        return a
    }
    
    
    render() {
        
        return (
            <div className={this.state.myClasses.main}> 
                <ButtonAppBar />
                <div style={this.state.myClasses.title}>
                    <div>
                        <h1 className="ui header" style={{color: 'inherit'}}>Conference Venue Booking</h1>
                    </div>
                </div>
                <div>
                    <p className="manual-par"> 
                        Enter a date or scroll down the page. 
                    </p>
                    <p className="manual-par"> 
                        Only logged in users can make reservations.
                    </p>
                    <p className="manual-par"> 
                        9" means 9:00-10:00; 10" means 10:00-11:00.
                    </p>
                    <div className="manual-div">
                            <RedFree />  <span className="manual-par"> The red room is free at this time </span>
                    </div>
                    <div className="manual-div">
                            <RedBusy /> <span className="manual-par"> The red room is reserved at this time </span>
                    </div>
                    {this.renderDayCards()}                        
                </div>             
            </div>
        )
    }
} 