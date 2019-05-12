import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import ButtonAppBarBooking from './components/BookingUpperBar';
import BookingDayCard from './components/BookingDayCard';
import { RedFree, RedBusy, RedChosen } from './components/Rooms'
import './css/Home.css'
import axios from 'axios';
import CircularProgress from './components/CircularProgress'
import HallCard from './components/HallCard'

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

export default class Booking extends Component {

    state = {
        user_id: '',
        token: '',
        myClasses: styles,
        dayCardsID: "initial",
        chosenSlots: [],
        reservedSlots: [],
        halls: [],
        colours: ['brown', 'green', 'red', 'blue', 'violet'],
        displayDayCards: false,
    }

    chooseSlot(slotID) {
        sessionStorage.setItem('chosenSlots', JSON.stringify([...this.state.chosenSlots, slotID]))
        this.setState({ chosenSlots: [...this.state.chosenSlots, slotID] })
    }

    checkSlot(slotID) {
        return this.state.chosenSlots.includes(slotID)
    }

    deselect(slotID) {

        let arrayToAlter = this.state.chosenSlots.slice(0)
        for (var i = 0; i < arrayToAlter.length; i++) {
            if (arrayToAlter[i] === slotID) {
                arrayToAlter.splice(i, 1);
            }
        }
        sessionStorage.removeItem('chosenSlots')
        sessionStorage.setItem('chosenSlots', JSON.stringify(arrayToAlter))

        this.setState({ chosenSlots: arrayToAlter })
    }


    checkReservation(slotID) {
        return this.state.reservedSlots.includes(slotID)
    }


    calculateDate(fullDate, counter) {
        let nextDate = fullDate.getDate() + counter;
        fullDate.setDate(nextDate);
        const tomorrow = fullDate
        const monthOption = { month: 'long' };
        const weekdayOption = { weekday: 'long' };
        const date = fullDate.getDate()
        const month = new Intl.DateTimeFormat('en-GB', monthOption).format(fullDate)
        const weekday = new Intl.DateTimeFormat('en-GB', weekdayOption).format(fullDate)
        const keyDate = date.toString().length === 2 ? date : "0" + date;
        const keyMonth = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1) : "0" + (fullDate.getMonth() + 1);
        const keyYear = fullDate.getYear().toString().slice(1)

        return ({
            dateObject: tomorrow,
            date: `${date} ${month}, ${weekday}`,
            key: `${keyDate}${keyMonth}${keyYear}`,
        });
    }

    renderDayCards() {
        let days = [];
        let IDs = [];
        for (let i = 0; i < 62; i++) {
            const cardDate = this.calculateDate(new Date(), i).date;
            const cardKey = this.calculateDate(new Date(), i).key;
            days.push(<BookingDayCard
                date={cardDate}
                key={cardKey}
                anchor={cardKey}
                id={"date:" + cardKey}
                chooseSlot={this.chooseSlot.bind(this)}
                checkSlot={this.checkSlot.bind(this)}
                deselect={this.deselect.bind(this)}
                checkReservation={this.checkReservation.bind(this)}
            />)
            IDs.push(cardKey)
        }
        return {
            days: days,
            dayCardsID: IDs
        }
    }

    confirmReservation() {
        if (sessionStorage.getItem('chosenSlots') === null || JSON.parse(sessionStorage.getItem('chosenSlots')).length === 0) {
            alert('There is nothing to confirm. Please choose rooms you like to book first.')
        } else if (JSON.parse(sessionStorage.getItem('chosenSlots').length > 0)) {

            let chosenHalls = JSON.parse(sessionStorage.getItem('chosenSlots')) // I CAN MAKE A LIST AS A MESSAGE FOR CONFIRMATION IF I HAVE TIME
            let confirm = window.confirm('Do you confirm your order?')

            if (confirm) {
                let ReservationsToSave
                if (localStorage.getItem('bookedSlots') !== null) {
                    let alreadySavedReservations = JSON.parse(localStorage.getItem('bookedSlots'))
                    ReservationsToSave = [...alreadySavedReservations, ...chosenHalls]
                }
                localStorage.setItem('bookedSlots', JSON.stringify(ReservationsToSave))
                sessionStorage.removeItem('chosenSlots')
                this.setState({ chosenSlots: [] })
                this.setState({ reservedSlots: JSON.parse(localStorage.getItem('bookedSlots')) })
            }
            else { console.log('no') }
        }
    }


    checkReservation(slotID) {
        return this.state.reservedSlots.includes(slotID)
    }

    convertTimeIntoSlotID(fullRecord) {
        let date = fullRecord.getDate()
        let fullDate = date.toString().length === 2 ? date : "0" + date;
        let fullMonth = (fullRecord.getMonth() + 1).toString().length === 2 ? (fullRecord.getMonth() + 1) : "0" + (fullRecord.getMonth() + 1);
        let fullYear = fullRecord.getYear().toString().slice(1)
        let hour = fullRecord.getHours()
        let fullHour = String(hour).length === 1 ? "0" + hour : hour;
        return `date:${fullDate}${fullMonth}${fullYear}hour:${fullHour}`
    }

    deleteMinutesSecondsMilisecs(time) {
        let datehour = new Date(time.setMilliseconds(0))
        datehour = new Date(datehour.setSeconds(0))
        datehour = new Date(datehour.setMinutes(0))
        return datehour
    }

    addColourToID(hall_id) {
        let arraysHallsID = this.state.halls.map(i => i._id)
        let hallNumber = arraysHallsID.indexOf(hall_id)
        return `colour:${this.state.colours[hallNumber].slice(0, 3)}`
    }

    addSlotToReservationList(time, hall_id) {
        let slotIdTimeHour = this.convertTimeIntoSlotID(time)
        let slotIdColour = this.addColourToID(hall_id)
        let slotId = slotIdTimeHour + slotIdColour
        let newReservedSlotsList = this.state.reservedSlots.slice();
        newReservedSlotsList.push(slotId)
        this.setState({ reservedSlots: newReservedSlotsList })
    }

    addingHoursIntoReservation(time1, time2, hall_id) {

        this.addSlotToReservationList(time1, hall_id)

        let firstHour = time1.getHours()
        let secondHour = time2.getHours()
        if (firstHour < secondHour) {
            let nextHour = new Date(time1.setTime(time1.getTime() + (60 * 60 * 1000)))
            this.addingHoursIntoReservation(nextHour, time2, hall_id)
        }
    }

    addingDaysIntoReservation(time1, time2, hall_id) {

        if (time1 < time2 &&
            (time1.getDate() !== time2.getDate() ||
                time1.getMonth() !== time2.getMonth() ||
                time1.getYear() !== time2.getYear()
            )) {

            let sameDayLastHour = new Date(time1.getTime())
            sameDayLastHour = new Date(sameDayLastHour.setHours(23))
            this.addingHoursIntoReservation(time1, sameDayLastHour, hall_id)
            let tomorrow = this.calculateDate(time1, 1).dateObject
            tomorrow = new Date(tomorrow.setHours(0))
            this.addingDaysIntoReservation(tomorrow, time2, hall_id)
        } else {
            this.addingHoursIntoReservation(time1, time2, hall_id)
        }
    }

    calculateSlotsReserved() {

        for (let i = 0; i < this.state.tickets.length; i++) {
            let fromTime = new Date(this.state.tickets[i].from)
            let toTime = new Date(this.state.tickets[i].to)

            if (toTime < new Date()) { continue }
            else if (fromTime !== toTime && fromTime < toTime) {
                fromTime = this.deleteMinutesSecondsMilisecs(fromTime)
                toTime = this.deleteMinutesSecondsMilisecs(toTime)
                this.addingDaysIntoReservation(fromTime, toTime, this.state.tickets[i].hall_id)
            }
        }
    }

    componentDidMount() {

        Promise.all([
            axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/halls'),         // to get all halls
            axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/tickets')        // to get all tickets
          ])
            .then(res => {
              this.setState({ halls: res[0].data.halls })
              this.setState({ tickets: res[1].data })
              //for (let i = 0; i < res[1].data.length; i++) {
              //console.log(res[1].data[i]._id)               // REVEALS THE TICKETS' TIME
              //console.log(new Date(res[1].data[i].from))
              //console.log(new Date(res[1].data[i].to))
              //}
            })
            .then(() => {
              this.calculateSlotsReserved()
            })
            .then(() => this.setState({ displayDayCards: true }))
            // .then(() => console.log(this.state.reservedSlots))
            .catch((e) => console.log(e))

        // the following is the old code to review

        this.setState({ dayCardsID: [...this.renderDayCards().dayCardsID] })
        if (sessionStorage.getItem('chosenSlots') !== null) {
            this.setState({ chosenSlots: JSON.parse(sessionStorage.getItem('chosenSlots')) })
        }
        // if (localStorage.getItem('bookedSlots') !== null) {
        //     this.setState({ reservedSlots: JSON.parse(localStorage.getItem('bookedSlots')) })
        // }

        //the following is the new code

        if (localStorage.getItem('user_id') !== null || localStorage.getItem('user_id') !== '' ||
            localStorage.getItem('user_id') !== undefined || localStorage.getItem('user_id') !== []) {

            this.setState({ user_id: localStorage.getItem('user_id') })
            localStorage.removeItem('user_id')
        }
        if (localStorage.getItem('token') !== null || localStorage.getItem('token') !== '' ||
            localStorage.getItem('token') !== undefined || localStorage.getItem('token') !== []) {

            this.setState({ token: localStorage.getItem('token') })
            localStorage.removeItem('token')
        }
    }

    redirect() {
        this.props.history.push('/login')
    }

    render() {
        if (typeof sessionStorage.getItem('LoggedIn') === "string" && sessionStorage.getItem('LoggedIn').length > 2) {

            return (
                <div>
                    <div className={this.state.myClasses.main}>
                        <ButtonAppBarBooking history={this.props.history} confirm={this.confirmReservation.bind(this)} />
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
                                <p className='manual-par'>
                                    Once you have selected all the rooms you would like to book
                                </p>
                                <p className='manual-par'>
                                    click payment button in order to make reservation
                                </p>
                                <p className='manual-par'>
                                    in the upper bar and confirm your order.
                                </p>
                            </div>
                            <div>
                                <div className="manual-div">
                                    <RedFree />  <span className="manual-par"> The red room is free at this time </span>
                                </div>
                                <div className="manual-div">
                                    <RedBusy /> <span className="manual-par"> The red room is reserved at this time </span>
                                </div>
                                <div className="manual-div">
                                    <RedChosen /> <span className="manual-par"> The red room is selected at this time, but not yet reserved. </span>
                                </div>
                            </div>
                        </div>
                        {this.renderDayCards(this.chosenSlots).days}
                    </div>
                </div>
            );
        }
        else {
            return <Redirect to='/login' />
        }
    }
} 