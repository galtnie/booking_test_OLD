import React, { Component } from 'react';
import ButtonAppBar from './components/HomeUpperBar';
import HomeDayCard from './components/HomeDayCard';
import { Redirect } from 'react-router-dom';
import { RedFree, RedBusy } from './components/Rooms'
import './css/Home.css';
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

export default class Home extends Component {

  state = {
    myClasses: styles,
    dayCardsID: "initial",
    reservedSlots: [],
    halls: [],
    colours: ['bro', 'gre', 'red', 'blu', 'vio'],
    displayDayCards: false
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
    return `colour:${this.state.colours[hallNumber]}`
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

    this.setState({ dayCardsID: [...this.renderDayCards().dayCardsID] })
  }

  render() {
    return (
      (typeof sessionStorage.getItem('LoggedIn') !== "string")
        ?
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
                <RedFree />
                <span className="manual-par">
                  The red room is free at this time
                                </span>
              </div>
              <div className="manual-div">
                <RedBusy />
                <span className="manual-par">
                  The red room is reserved at this time
                                </span>
              </div>
            </div>
            
              {
                this.state.halls.length > 0

                  ?
                  
                  <div style={{ display: 'flex', flexDirection: 'row', flexFlow: 'wrap', justifyConter: "space-between" }}>
                    {this.state.halls.map((i, index) => {
                      return (
                        <div key={index} >
                            <HallCard image={i.imageURL} title={i.title} description={i.description} cssClass = {`${this.state.colours[index]}-hall`}/>
                        </div>
                      )
                    })}
                  </div>
                  :

                  <div> </div>
              }
            
          </div>

          {this.state.displayDayCards

            ?

            this.renderDayCards().days

            :

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingTop: "3em" }}>
              <CircularProgress />
            </div>
          }

        </div>
        :
        <Redirect to='/booking' />
    )
  }
}

