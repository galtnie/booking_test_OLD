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

let a = 0

export default class Home extends Component {

  state = {
    myClasses: styles,
    dayCardsID: "initial",
    reservedSlots: null,
    halls: [],
    colours: ['bro', 'gre', 'red', 'blu', 'vio'],
    displayDayCards: false,
    dayChosen: new Date(), 
    backwardClick: "inactive",
    dateInput: '',
    tickets: null,
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

  checkReservation(slotID) {
    let newArrayWithoutTitles = this.state.reservedSlots.map(e => e.slice(0, 28))
    let newArrayOfTitles = this.state.reservedSlots.map(e => e.slice(28))

    return newArrayWithoutTitles.includes(slotID)
        ?
        newArrayOfTitles[newArrayWithoutTitles.findIndex(e => e === slotID)]
        :
        false
}

  initialRenderDayCard() {
    let day  = this.state.dayChosen 
    let dateCalculation = this.calculateDate(day, 0) 
    const cardDate = dateCalculation.date;
    const cardId = dateCalculation.key;

    return ({
      card:  <HomeDayCard date={cardDate} id={"date:" + cardId} reservedSlots={this.state.reservedSlots} checkReservation={this.checkReservation.bind(this)} />, 
      date:   cardDate
    });
  }

  renderDayCard(where) {
      if (where==="forth"){
      this.setState({backwardClick: "active"})
      return new Promise(resolve=>{
        resolve()
      })
      .then(() => this.calculateDate(this.state.dayChosen, 1))
      .then(()=> {
        debugger
        this.calculateSlotsReserved()
      })
    } else if (where === "back") {
      let today = new Date()
      return new Promise(resolve=>{
        resolve()
      })
      .then(() => this.calculateDate(this.state.dayChosen, -1))
      .then(()=> this.calculateSlotsReserved())
      .then(()=>{
        if(this.state.dayChosen.getDate() === today.getDate()) {
          this.setState({backwardClick: "inactive"})
          this.forceUpdate();
        }
      })
    }
  }

  addingHoursIntoReservation(time1, time2, hall_id, title, newSlotsArray) {
    let date = time1.getDate()
    let fullDate = date.toString().length === 2 ? date : "0" + date;
    let fullMonth = (time1.getMonth() + 1).toString().length === 2 ? (time1.getMonth() + 1) : "0" + (time1.getMonth() + 1);
    let fullYear = time1.getYear().toString().slice(1)
    let hour = time1.getHours()
    let fullHour = String(hour).length === 1 ? "0" + hour : hour;
    let arraysHallsID = this.state.halls.map(i => i._id)
    let hallNumber = arraysHallsID.indexOf(hall_id)
    let slotId = `date:${fullDate}${fullMonth}${fullYear}hour:${fullHour}colour:${this.state.colours[hallNumber]}title:${title}` 
    newSlotsArray = [...newSlotsArray, slotId]
    let firstHour = time1.getHours()
    let secondHour = time2.getHours()

    if (firstHour < secondHour) {
      let nextHour = new Date(time1.setTime(time1.getTime() + (60 * 60 * 1000)))
      newSlotsArray = [...newSlotsArray, ...this.addingHoursIntoReservation(nextHour, time2, hall_id, title, newSlotsArray)]
    }
    return newSlotsArray
  }

  addingDaysIntoReservation(time1, time2, hall_id, title, newSlotsArray) {
    if (time1 < time2 &&
      (time1.getDate() !== time2.getDate() ||
        time1.getMonth() !== time2.getMonth() ||
        time1.getYear() !== time2.getYear()
      )) {

      let sameDayLastHour = new Date(time1.getTime())
      sameDayLastHour = new Date(sameDayLastHour.setHours(23))
      newSlotsArray = [...newSlotsArray, ...this.addingHoursIntoReservation(time1, sameDayLastHour, hall_id, title, newSlotsArray)]

      let tomorrow = this.calculateDate(time1, 1).dateObject
      tomorrow = new Date(tomorrow.setHours(0))
      newSlotsArray = [...newSlotsArray, ...this.addingHoursIntoReservation(tomorrow, time2, hall_id, title, newSlotsArray)]
      return newSlotsArray
    } else {
      newSlotsArray = [...newSlotsArray, ...this.addingHoursIntoReservation(time1, time2, hall_id, title, newSlotsArray)]
      return newSlotsArray
    }
  }

  calculateSlotsReserved() {
      let newReservedSlotsArray = this.state.slotsReserved === undefined ? [] :  this.state.slotsReserved

    for (let i = 0; i < this.state.tickets.length; i++) {
      let fromTime = new Date(this.state.tickets[i].from)
      let toTime = new Date(this.state.tickets[i].to)
      let title = this.state.tickets[i].title

      if (toTime < new Date()) { continue }
      else if (fromTime !== toTime && fromTime < toTime) {
        fromTime = new Date (new Date(new Date(fromTime.setMilliseconds(0)).setSeconds(0)).setMinutes(0))
        toTime = new Date (new Date(new Date(toTime.setMilliseconds(0)).setSeconds(0)).setMinutes(0))

      let dayChosenStart = (new Date(new Date(new Date(new Date (this.state.dayChosen).setHours(0)).setMinutes(0)).setSeconds(0)).setMilliseconds(0))-5
      let dayChosenEnd = (new Date(new Date(new Date(new Date (this.state.dayChosen).setHours(23)).setMinutes(59)).setSeconds(59)).setMilliseconds(999))+5

        if ((fromTime <= dayChosenStart && toTime >= dayChosenStart) || 
        (fromTime >= dayChosenStart && toTime <= dayChosenEnd) || 
        (fromTime <= dayChosenEnd && toTime >= dayChosenEnd )) {
          
          newReservedSlotsArray = [...newReservedSlotsArray, ...this.addingDaysIntoReservation(fromTime, toTime, this.state.tickets[i].hall_id, title, newReservedSlotsArray)]            
        }       
      }      
    }
    
    console.log('i change state of reservedSlots once')
    this.setState({reservedSlots: [...newReservedSlotsArray]})
    
  }
 
  handleDateInput() {
    let today = new Date(new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0)).setMilliseconds(0))
    let time = new Date(this.state.dateInput)

    if (time < today ) {
      alert('The searched date cannot be erenow ')
      this.setState({dateInput: ''})
    } else if(time.getDate() === today.getDate()) {
      this.setState({backwardClick: "inactive"})
      
      return new Promise(resolve=>{
        resolve(time)
      })
      .then(time=> this.setState({dayChosen: time}))
      .then(()=> this.calculateSlotsReserved())

    } else if (time > today) {
      this.setState({backwardClick: "active"})    

      return new Promise(resolve=>{
        resolve(time)
      })
      .then(time=> this.setState({dayChosen: time}))
      .then(()=> this.calculateSlotsReserved())

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
    
    console.log(this.state.halls)
    if (this.state.halls.length === 0) {
      axios.get('https://web-ninjas.net/halls')
      //axios.get('http://ec2-35-175-143-145.compute-1.amazonaws.com:4000/halls')
      .then(res => this.setState({ halls: res.data.halls }))
      .catch((e) => console.log(e))
    }

    if (this.state.tickets === null) {
      axios.get(`https://web-ninjas.net/tickets`)
      //axios.get(`http://ec2-35-175-143-145.compute-1.amazonaws.com:4000/tickets`)
      .then(res => this.setState({ tickets: res.data }))
      .then(() => {this.calculateSlotsReserved()
        this.setState({ displayDayCards: true })})
      .catch((e) => console.log(e))
    }
  }

  render() {
    console.log(a++)
    console.log('render')
    // console.log(this.props)
    // console.log(this.state)
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

