import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import ButtonAppBar from './components/HomeUpperBar';
import HomeDayCard from './components/HomeDayCard';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { RedFree, RedBusy } from './components/Rooms'
import './css/Home.css';
import axios from 'axios';

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

    state = {
        myClasses: styles,
        dayCardsID: "initial",
        reservedSlots: []
    }

    calculateDate(counter) {
        let fullDate = new Date();
        let nextDate = fullDate.getDate() + counter;
        fullDate.setDate(nextDate);
        const monthOption = { month: 'long' };
        const weekdayOption = { weekday: 'long' };
        const date = fullDate.getDate()
        const month = new Intl.DateTimeFormat('en-GB', monthOption).format(fullDate)
        const weekday = new Intl.DateTimeFormat('en-GB', weekdayOption).format(fullDate)
        const keyDate = date.toString().length === 2 ? date : "0" + date;
        const keyMonth = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1) : "0" + (fullDate.getMonth() + 1);
        const keyYear = fullDate.getYear().toString().slice(1)

        return ({
            date: `${date} ${month}, ${weekday}`,
            key: `${keyDate}${keyMonth}${keyYear}`,
        });
    }

    renderDayCards() {
        let days = [];
        let IDs = [];
        for (let i = 1; i < 32; i++) {
            const cardDate = this.calculateDate(i).date;
            const cardKey = this.calculateDate(i).key;
            days.push(<HomeDayCard
                date={cardDate}
                key={cardKey}
                anchor={cardKey}
                id={"date:" + cardKey}
                checkReservation={this.checkReservation.bind(this)}
            />)
            IDs.push(cardKey)
        }
        return {
            days: days,
            dayCardsID: IDs
        }
    }

    checkReservation(slotID) {
        return this.state.reservedSlots.includes(slotID)
    }

    componentDidMount() {
        let token = `Barrier eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2MiOnsiaXNBZG1pbiI6ZmFsc2UsIl9pZCI6IjVjZDE1NDY4MzQ2NDRkNjBhMDk0YzZiNSIsImVtYWlsIjoicnViZW4ubGV0dGVyYm94QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDVsbC5aTVUzY2Q4Y05Mdmp6RUpMUGVoZzU1czJySGp5ald5OGF5M2N3ZEhmTnBUbkhiT0hTIn0sImlhdCI6MTU1NzIyMjcwNiwiZXhwIjoxNTU3NDgxOTA2fQ.8AF74iV_2l6Bo9qzAMzAXtmjQhIz_L0Ro7fzc9MySFk`
        
        // to get all halls
        axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/halls', {headers: {Authorization: `${token}`}})
      .then(res => {
        console.log(res);
      })
        // to get all tickets
        axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/tickets', {headers: {Authorization: token}})
        .then(res => {
            console.log(res);
          })
        
        axios.get()
        

        this.setState({ dayCardsID: [...this.renderDayCards().dayCardsID] })
        if (localStorage.getItem('bookedSlots') !== null) {
           this.setState({ reservedSlots: JSON.parse(localStorage.getItem('bookedSlots')) })
        }
        
    }

    render() {
        if (typeof sessionStorage.getItem('LoggedIn') !== "string") {
            return (
                <div className={this.state.myClasses.main}>
                    <ButtonAppBar />
                    <div style={this.state.myClasses.title}>
                        <div>
                            <h1 className="ui header" style={{ color: 'inherit' }}>Conference Venue Booking</h1>
                        </div>
                    </div>
                    <div className="manual">
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
                        </div>
                        <div>
                            <div className="manual-div">
                                <RedFree />  <span className="manual-par"> The red room is free at this time </span>
                            </div>
                            <div className="manual-div">
                                <RedBusy /> <span className="manual-par"> The red room is reserved at this time </span>
                            </div>
                        </div>
                    </div>
                    {this.renderDayCards().days}
                </div>
            )
        } else {
            return <Redirect to='/booking' />
        }
    }
}