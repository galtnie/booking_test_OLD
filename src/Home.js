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
    displayDayCards: false,
    dayChosen: new Date(), 
    backwardClick: "inactive",
    dateInput: '',
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

  initialRenderDayCard() {
    let day
    let dateCalculation
    
    
      day = this.state.dayChosen 
      dateCalculation = this.calculateDate(day, 0)  
    

    const cardDate = dateCalculation.date;
    const cardId = dateCalculation.key;
    return ({
      card:  <HomeDayCard
      date={cardDate}    
        id={"date:" + cardId}
        checkReservation={this.checkReservation.bind(this)}
        />,
      date:   cardDate
    }
    );
  }


  renderDayCard(where) {
      if (where==="forth"){
      this.setState({backwardClick: "active"})
      this.calculateDate(this.state.dayChosen, 1)
        
    } else if (where === "back") {

      let today = new Date()
      this.calculateDate(this.state.dayChosen, -1)
      if(this.state.dayChosen.getDate() === today.getDate()) {
        this.setState({backwardClick: "inactive"})
        this.forceUpdate();
      }
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

  handleDateInput() {
    let today = new Date()
    let time = new Date(this.state.dateInput)

    if (time < today ) {
      alert('The searched date cannot be erenow ')
      this.setState({dateInput: ''})
    } else if(time.getDate() === today.getDate()) {
      this.setState({backwardClick: "inactive"})
      this.setState({dayChosen: time})
    } else if (time.getDate() > today.getDate()) {
      this.setState({backwardClick: "active"})
      this.setState({dayChosen: time})
    } 
  }

  controlDateInput(value){
      this.setState({dateInput: value})
  }

  handleDayChange(forth){
      this.setState({dateInput:""})
      if (forth) {
        this.renderDayCard('forth')
      } else {
        this.renderDayCard('back')
      }   
  }

  componentDidMount() {

    Promise.all([
      axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/halls'),         
      axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/tickets')        
    ])
      .then(res => {
        this.setState({ halls: res[0].data.halls })
        this.setState({ tickets: res[1].data })
      })
      .then(() => {
        this.calculateSlotsReserved()
      })
      .then(() => this.setState({ displayDayCards: true }))
      .catch((e) => console.log(e))
  }


  render() {
  
    return (
      (typeof sessionStorage.getItem('LoggedIn') !== "string")
        ?
        <div className={this.state.myClasses.main}>

          <ButtonAppBar date={this.initialRenderDayCard().date} 
            handleDateInput={this.handleDateInput.bind(this)} 
            handleDayChange={this.handleDayChange.bind(this)}
            dateInput = {this.state.dateInput}
            back={this.state.backwardClick}
            controlDateInput = {this.controlDateInput.bind(this)}
          />



          <div style={this.state.myClasses.title}>
            <div>
              <h1 className="ui header" style={{ color: 'inherit' }}>Conference Venue Booking</h1>
            </div>
          </div>
          <div className="manual">
            <div>
              <p className="manual-par">
                Only <b>logged in users</b> can <b>make reservations</b>.
                            </p>
              <p className="manual-par">
              <b>9"</b> means <b>9:00-10:00</b>; 10" means 10:00-11:00.
                            </p>
            </div>
            <div>
              <div className="manual-div">
                <RedFree />
                <span className="manual-par">
                  The red room is <b>free</b> at this time
                                </span>
              </div>
              <div className="manual-div">
                <RedBusy />
                <span className="manual-par">
                  The red room is <b> reserved </b> at this time
                                </span>
              </div>
            </div>
            </div> 


{this.state.displayDayCards

  ?

  this.initialRenderDayCard().card

  :

  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingTop: "3em" }}>
    <CircularProgress />
  </div>
}

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
        :
        <Redirect to='/booking' />
    )
  }
}

