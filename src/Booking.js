import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import ButtonAppBarBooking from './components/BookingUpperBar';
import BookingDayCard from './components/BookingDayCard';
import { RedFree, RedBusy, RedChosen } from './components/Rooms'
import './css/Home.css'
import axios from 'axios';
import CircularProgress from './components/CircularProgress'
import HallCard from './components/HallCard'
import './css/Booking.css'

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
    },
}

export default class Booking extends Component {

    state = {
        myClasses: styles,
        dayCardsID: "initial",
        chosenSlots: [],
        reservedSlots: [],
        halls: [],
        colours: ['bro', 'gre', 'red', 'blu', 'vio'],
        displayDayCards: false,

        newOrdersListForTickets: '',
        newOrdersListForRendering: '',
        priorOrdersListForRendering: '',

        paymentQuestion: false,
        priorOrdersList: [],

        editReservation: false,
        dayChosen: new Date(), 
        dateInput: '',
        backwardClick: "inactive",

        titleToEdit: '',
        fromToEdit: '',
        untilToEdit: '',

        newTitle: null,
        newFrom: null,
        newTo: null,
        alteredTicketIndex: null
    };

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
        let newArrayWithoutTitles = this.state.reservedSlots.map(e => e.slice(0, 28))
        let newArrayOfTitles = this.state.reservedSlots.map(e => e.slice(28))

        return newArrayWithoutTitles.includes(slotID)
            ?
            newArrayOfTitles[newArrayWithoutTitles.findIndex(e => e === slotID)]
            :
            false

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
          card:  <BookingDayCard
          date={cardDate}    
            id={"date:" + cardId}
            checkReservation={this.checkReservation.bind(this)}
            chooseSlot={this.chooseSlot.bind(this)}
            checkSlot={this.checkSlot.bind(this)}
            deselect={this.deselect.bind(this)}
            setClick={click => this.clickChild = click}
            confirm={this.confirmReservation.bind(this)}
            />,
          date: cardDate
        });
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

    addSlotToReservationList(time, hall_id, title) {
        let slotIdTimeHour = this.convertTimeIntoSlotID(time)
        let slotIdColour = this.addColourToID(hall_id)
        let slotTitle = `title:${title}`
        let slotId = slotIdTimeHour + slotIdColour + slotTitle
        let newReservedSlotsList = this.state.reservedSlots.slice();
        newReservedSlotsList.push(slotId)
        this.setState({ reservedSlots: newReservedSlotsList })
    }

    addingHoursIntoReservation(time1, time2, hall_id, title) {
        this.addSlotToReservationList(time1, hall_id, title)

        let firstHour = time1.getHours()
        let secondHour = time2.getHours()
        if (firstHour < secondHour) {
            let nextHour = new Date(time1.setTime(time1.getTime() + (60 * 60 * 1000)))
            this.addingHoursIntoReservation(nextHour, time2, hall_id, title)
        }
    }

    addingDaysIntoReservation(time1, time2, hall_id, title) {
        if (time1 < time2 &&
            (time1.getDate() !== time2.getDate() ||
                time1.getMonth() !== time2.getMonth() ||
                time1.getYear() !== time2.getYear()
            )) {
            let sameDayLastHour = new Date(time1.getTime())
            sameDayLastHour = new Date(sameDayLastHour.setHours(23))
            this.addingHoursIntoReservation(time1, sameDayLastHour, hall_id, title)
            let tomorrow = this.calculateDate(time1, 1).dateObject
            tomorrow = new Date(tomorrow.setHours(0))
            this.addingDaysIntoReservation(tomorrow, time2, hall_id, title)
        } else {            
            this.addingHoursIntoReservation(time1, time2, hall_id, title)
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
                this.addingDaysIntoReservation(fromTime, toTime, this.state.tickets[i].hall_id, this.state.tickets[i].title)
            }
        }
    }

    confirmReservation() {
        if (sessionStorage.getItem('chosenSlots') === null || JSON.parse(sessionStorage.getItem('chosenSlots')).length === 0) {
            alert('There is nothing to confirm. Please choose rooms you like to book first.')
        } else if (JSON.parse(sessionStorage.getItem('chosenSlots').length > 0)) {
            let chosenHalls = JSON.parse(sessionStorage.getItem('chosenSlots')) 
            this.convertSlotIDsToTimeAndHalls(chosenHalls)
        }
    }

    convertSlotIDsToTimeAndHalls(slots_id) {
        let orderListToUniteAdjacent = []

        for (let i = 0; i < slots_id.length; i++) {
            let order = {
                hall_id: this.state.halls[this.state.colours.indexOf(slots_id[i].slice(-3))]._id,
                from: Date.parse(`20${slots_id[i].slice(9, 11)}-${slots_id[i].slice(7, 9)}-${slots_id[i].slice(5, 7)}T${slots_id[i].slice(16, 18)}:00:00`),
                to: Date.parse(`20${slots_id[i].slice(9, 11)}-${slots_id[i].slice(7, 9)}-${slots_id[i].slice(5, 7)}T${slots_id[i].slice(16, 18)}:59:00`),
            }
            orderListToUniteAdjacent.push(order)
        }
        this.uniteTicketsWithSameHallIDs(orderListToUniteAdjacent)
    }

    uniteTicketsWithSameHallIDs(orderList) {
        let ticketsHallsArray = []

        for (let i = 0; i < orderList.length; i++) {
            let ifNewHallArrayIsNeeded = true

            if (ticketsHallsArray.length === 0) {
                let sameHallTicketsArray = []                                           
                sameHallTicketsArray.push(orderList[i])           
                ticketsHallsArray.push(sameHallTicketsArray)
                ifNewHallArrayIsNeeded = false
            } else {
                for (let j = 0; j < ticketsHallsArray.length; j++) {
                    if (ticketsHallsArray[j][0].hall_id === orderList[i].hall_id) {       
                        ticketsHallsArray[j].push(orderList[i])                        
                        ifNewHallArrayIsNeeded = false
                    }
                }
            }
            if (ifNewHallArrayIsNeeded) {
                let sameHallTicketsArray = []                                         
                sameHallTicketsArray.push(orderList[i])          
                ticketsHallsArray.push(sameHallTicketsArray)
            }
        }
        this.uniteAdjacentTickets(ticketsHallsArray)
    }

    uniteAdjacentTickets(ticketsHallsArray) {
        let doItAgain = false

        ticketsHallsArray.forEach((ticketsArrayOfSameHall) => {
            for (let i = 0; i < ticketsArrayOfSameHall.length; i++) {
                for (let j = 0; j < ticketsArrayOfSameHall.length; j++) {

                    if ((ticketsArrayOfSameHall[j].from - ticketsArrayOfSameHall[i].to) < 300000 &&
                        (ticketsArrayOfSameHall[j].from - ticketsArrayOfSameHall[i].to) > 0) {

                        let newTicket = {
                            from: ticketsArrayOfSameHall[i].from,
                            to: ticketsArrayOfSameHall[j].to,
                            hall_id: ticketsArrayOfSameHall[i].hall_id,
                        }

                        if (i > j) {
                            ticketsArrayOfSameHall.splice(i, 1)
                            ticketsArrayOfSameHall.splice(j, 1, newTicket)
                        }
                        else {
                            ticketsArrayOfSameHall.splice(j, 1)
                            ticketsArrayOfSameHall.splice(i, 1, newTicket)
                        }
                        doItAgain = true
                        break;
                    }
                    else if ((ticketsArrayOfSameHall[i].from - ticketsArrayOfSameHall[j].to) < 300000 &&
                        (ticketsArrayOfSameHall[i].from - ticketsArrayOfSameHall[j].to) > 0) {

                        let newTicket = {
                            from: ticketsArrayOfSameHall[j].from,
                            to: ticketsArrayOfSameHall[i].to,
                            hall_id: ticketsArrayOfSameHall[i].hall_id,
                        }

                        if (i > j) {
                            ticketsArrayOfSameHall.splice(i, 1)
                            ticketsArrayOfSameHall.splice(j, 1, newTicket)
                        }
                        else {
                            ticketsArrayOfSameHall.splice(j, 1)
                            ticketsArrayOfSameHall.splice(i, 1, newTicket)
                        }
                        doItAgain = true
                        break;
                    }
                }
            }
        })

        if (doItAgain) {
            this.uniteAdjacentTickets(ticketsHallsArray)
        } else {
            let arrayWithUnitedAdjacentTickets = []
            ticketsHallsArray.forEach(i => i.forEach(ii => {
                ii.event_title = "untitled"
                arrayWithUnitedAdjacentTickets.push(ii)
            }))
            
            this.setState({ newOrdersListForTickets: arrayWithUnitedAdjacentTickets })
            this.convertNewOrdersToRender(arrayWithUnitedAdjacentTickets)
        }
    }

    convertNewOrdersToRender(orders) {
        let newOrdersListForRendering = []
        const timeOptionsForRendering = {
            day: 'numeric',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
        }
        for (let i = 0; i < orders.length; i++) {
            let hall = this.state.halls.find(e => {
                return e._id === orders[i].hall_id
            })
            let orderForRendering = {
                hall_title: hall.title,
                from: new Intl.DateTimeFormat('en-GB', timeOptionsForRendering).format(orders[i].from),
                to: new Intl.DateTimeFormat('en-GB', timeOptionsForRendering).format(orders[i].to),
            }
            newOrdersListForRendering.push(orderForRendering)
        }
        this.setState({ newOrdersListForRendering: newOrdersListForRendering })
        this.setState({ paymentQuestion: true })
    }

    convertPriorOrdersToRender(orders) {
        let ordersListForRendering = []
        const timeOptionsForRendering = {
            day: 'numeric',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
        }

        for (let i = 0; i < orders.length; i++) {
            let hall = this.state.halls.find(e => {
                return e._id === orders[i].hall_id
            })

            let orderForRendering = {
                hall_title: hall.title,
                from: new Intl.DateTimeFormat('en-GB', timeOptionsForRendering).format(orders[i].from),
                to: new Intl.DateTimeFormat('en-GB', timeOptionsForRendering).format(orders[i].to),
                event: orders[i].title
            }
            ordersListForRendering.push(orderForRendering)
        }
        return ordersListForRendering
    }


    handleClickedConfirm() {
        this.setState({ paymentQuestion: false })
        sessionStorage.removeItem('chosenSlots')
        this.setState({ chosenSlots: [] })
        this.setState({ newOrdersListForRendering: '' })
        this.issueTickets()
    }

    issueTickets() {
        let axiosRequests = []

        for (let i = 0; i < this.state.newOrdersListForTickets.length; i++) {
            let request = axios({
                method: 'post',
                url: 'http://ec2-35-175-143-145.compute-1.amazonaws.com:4000/tickets',
                data: {
                    hall_id: this.state.newOrdersListForTickets[i].hall_id,
                    user_id: sessionStorage.getItem('user_id'),
                    title: this.state.newOrdersListForTickets[i].event_title,
                    from: this.state.newOrdersListForTickets[i].from,
                    to: this.state.newOrdersListForTickets[i].to,
                },
                headers: {
                    ContentType: "application/x-www-form-urlencoded",
                    Authorization: sessionStorage.getItem('token'),
                }
            })
            axiosRequests.push(request)
        }

        Promise.all(axiosRequests)
            .then(() => this.setState({ newOrdersListForTickets: '' }))
            .then(() => {
                window.location.reload()
            })
            .catch(error => {
                console.log(error)
                console.log(error.message)
            })
    }

    deleteTicket(e) {
        let itemIndex = e.target.id
        let ticketToDelete = this.state.priorOrdersList[itemIndex]
        axios({
            method: 'delete',
            url: `http://ec2-35-175-143-145.compute-1.amazonaws.com:4000/tickets/${ticketToDelete._id}`,
            headers: {
                ContentType: "application/x-www-form-urlencoded",
                Authorization: sessionStorage.getItem('token'),
            }
        })
            .then(() => {
                let newArray = this.state.priorOrdersList
                newArray.splice(itemIndex, 1)
                this.setState({ priorOrdersList: newArray })

                let newArray2 = this.state.priorOrdersListForRendering
                newArray2.splice(itemIndex, 1)
                this.setState({ priorOrdersListForRendering: newArray2 })
            })
            .then(()=> {window.location.reload()})            
            .catch((e) => console.log(e))
    }

    editTicket(e) {                                            
        
        let index = e.target.id

        return new Promise(function(resolve) {
            resolve (index)        
        })
        .then(index=>{
            this.setState({alteredTicketIndex: index})
            return index
        })
        .then(index=>{
            return index
        })
        .then(index=>{
            this.setState({titleToEdit: this.state.priorOrdersListForRendering[index].event })
            this.setState({fromToEdit: this.state.priorOrdersListForRendering[index].from })
            this.setState({untilToEdit: this.state.priorOrdersListForRendering[index].to})

            this.setState({newFrom: String(new Date(this.state.priorOrdersList[this.state.alteredTicketIndex].from + 10800000).toISOString()).slice(0, -8)})
            this.setState({newTo: String(new Date(this.state.priorOrdersList[this.state.alteredTicketIndex].to + 10800000).toISOString()).slice(0, -8)})
            this.setState({newTitle: this.state.priorOrdersList[this.state.alteredTicketIndex].title})
        })
        .then(()=>{
            this.setState({editReservation: true})
        })      
        .catch((e)=> console.log(e))  
    }

    sendEditedTicket(){
        axios({
            method: 'put',
            url: `http://ec2-35-175-143-145.compute-1.amazonaws.com:4000/ticket/${this.state.priorOrdersList[this.state.alteredTicketIndex]._id}`,
            headers: {
                ContentType: "application/x-www-form-urlencoded",
                Authorization: sessionStorage.getItem('token'),
            },
            data: {
                title: this.state.newTitle,
                from:  Date.parse(this.state.newFrom),
                to: Date.parse(this.state.newTo),
            }
        })
            .then(() => {
                this.setState({titleToEdit: ''})
                this.setState({fromToEdit: ''})
                this.setState({untilToEdit: ''})
        
                this.setState({newTitle: null})
                this.setState({newFrom: null})
                this.setState({newTo: null})
                this.setState({alteredTicketIndex: null})
            })
            .then(()=> window.location.reload())
        .catch((e) => console.log(e))

    }

    componentDidMount() {
      
        Promise.all([
            axios.get('http://ec2-35-175-143-145.compute-1.amazonaws.com:4000/halls'),         
            axios.get('http://ec2-35-175-143-145.compute-1.amazonaws.com:4000/tickets')        
        ])
            .then(res => {
                
                this.setState({ halls: res[0].data.halls })
                this.setState({ tickets: res[1].data })
            })
            .then(() => {
                this.calculateSlotsReserved()
            })
            .then(() => {
                let usersTickets = []
                let user_id = sessionStorage.getItem('user_id')
                usersTickets = this.state.tickets.filter(i => {
                    return i.user_id === user_id
                })
                    if (usersTickets.length > 0) {
                        this.setState({ priorOrdersList: usersTickets.reverse() })
                    }
            })
            .then(() => {
                    if (this.state.priorOrdersList.length > 0) {
                        this.setState({ priorOrdersListForRendering: this.convertPriorOrdersToRender(this.state.priorOrdersList) })
                    }

            })
            .then(() => {
                this.setState({ displayDayCards: true })
            })
            .catch((e) => console.log(e))

        if (sessionStorage.getItem('chosenSlots') !== null) {
            this.setState({ chosenSlots: JSON.parse(sessionStorage.getItem('chosenSlots')) })
        }
    }

    redirect() {
        this.props.history.push('/login')
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

    render() {
        
        return (
            (typeof sessionStorage.getItem('LoggedIn') === "string" && sessionStorage.getItem('LoggedIn').length > 2)

                ?

                <div className={this.state.myClasses.main}>
                    <ButtonAppBarBooking 
                        history={this.props.history} 
                        date={this.initialRenderDayCard().date} 
                        handleDateInput={this.handleDateInput.bind(this)} 
                        handleDayChange={this.handleDayChange.bind(this)}
                        dateInput = {this.state.dateInput}
                        back={this.state.backwardClick}
                        controlDateInput = {this.controlDateInput.bind(this)}
                    />                    
                    
                    <div style={this.state.myClasses.title}>
                        <div>
                            <h1 className="ui header" style={{ color: 'inherit' }}>
                                Conference Venue Booking
                            </h1>
                        </div>
                    </div>

                    <div className="manual">
                        <div>
                            <p className="manual-par">
                                <b>9"</b> means <b>9:00-10:00</b>; 10" means 10:00-11:00.
                                </p>
                            <p className='manual-par'>
                                Once you have selected all the rooms you would like to book
                                click <b>payment</b> button 
                                </p>
                            
                        </div>
                        <div>
                            <div className="manual-div">
                                <RedFree />  <span className="manual-par"> The red room is <b>free</b> at this time </span>
                            </div>
                            <div className="manual-div">
                                <RedBusy /> <span className="manual-par"> The red room is <b>reserved</b> at this time </span>
                            </div>
                            <div className="manual-div">
                                <RedChosen /> <span className="manual-par"> The red room is <b>selected</b> at this time, but <b>not reserved</b> yet. </span>
                            </div>
                        </div>
                    </div>

{
    this.state.displayDayCards

        ?

        this.initialRenderDayCard(this.chosenSlot).card

        :

        <div style={{ display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    paddingTop: "3em" }}>
            <CircularProgress />
        </div>
}

                    {
                        this.state.priorOrdersListForRendering.length > 0
                            ?

                            <div className="ui container"
                                style={{
                                    color: "#945600",
                                    border: "1em solid #2185D0",
                                    background: '#E8F1F2',
                                    borderRadius: "2em",
                                    marginBottom: "2em",
                                    marginTop: "2em",
                                    fontSize: "1.2em"
                                }}
                            >

                                <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center' }}>
                                    <h3 style={{ color: "#945600", marginTop: "1em" }}>
                                        LIST OF YOUR PRIOR RESERVATIONS:
                                    </h3>
                                </div>

                                <div style={{ marginLeft: "1em" }}>
                                    {this.state.priorOrdersListForRendering.map((i, index) => {
                                        return (
                                            <div key={index}
                                                style={{
                                                    marginTop: "1em",
                                                    color: "#13293D",
                                                    fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                    fontSize: "1em",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "stretch"
                                                }}>

                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "flex-start",
                                                    justifyContent: "space-between",
                                                }}>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    HALL:
                                                                        </td>
                                                                <td>
                                                                    {i.hall_title}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    EVENT:
                                                                        </td>
                                                                <td>
                                                                    {i.event}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    FROM:
                                                                        </td>
                                                                <td>
                                                                    {i.from}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    TO:
                                                                        </td>
                                                                <td>
                                                                    {i.to}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <div style={{ marginRight: "1em" }}>
                                                        <button className="ui olive button" id={index} onClick={(e) => this.editTicket(e)} style={{ marginRight: "1em", marginBottom: "1em" }}>
                                                            EDIT
                                                                </button>
                                                        <button id={index} className="ui red button" onClick={(e) => this.deleteTicket(e)}>
                                                            DELETE
                                                                </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    }
                                </div>

                            </div>

                            :
                            null
                    }

                    {
                        this.state.editReservation
                            ?
                            <div className="ui fluid container"
                                style={{
                                    position: "fixed",
                                    background: "linear-gradient(0deg, rgba(9,9,121,1) 0%, rgba(63,81,181,1) 50%, rgba(33,33,105,0.9654236694677871) 100%)",
                                    color:"white",
                                    top: "2em",
                                    padding: "2em",
                                    marginRight: "2em",
                                    marginLeft: "2em",
                                    overflowY: "auto",
                                    overflowX: "auto",
                                    maxHeight: "90%",
                                    maxWidth: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "stretch",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap"
                            }}>
                                    <div>
                                        <h3> 
                                            INPUT DATA YOU WISH TO AMEND. DISREGARD INPUTS YOU DON'T INTEND TO ALTER.
                                        </h3>
                                    </div> 
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        color: "white",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        marginBottom: "2em"
                                    }}>
                                        
                                        <div style={{paddingTop: "0.5em", marginRight: "1em"}}> 
                                            EVENT TITLE: 
                                        </div>

                                        <div>
                                            {this.state.titleToEdit}
                                        </div>                                           
                                        <div>
                                            <input type="text" value={this.state.newTitle} size="21" style={{border:0, padding: "0.5em", borderRadius:"1em", margin:"1em"}} 
                                                onChange={e=>this.setState({newTitle: e.target.value})}
                                            />
                                        </div>                                                         
                                    </div>

                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        color: "white",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        marginBottom: "2em"
                                    }}>
                                        <div style={{paddingTop: "0.5em", marginRight: "1em"}}> 
                                            COMMENCES at: 
                                        </div>
                                        <div>
                                            {this.state.fromToEdit}
                                        </div>
                                        <div>
                                            <input type="datetime-local" placeholder="Disregard to keep unaltered" size="21" style={{border:0, padding: "0.5em", borderRadius:"1em", margin:"1em"}} 
                                                value= {this.state.newFrom} 
                                                min={String(new Date().toISOString()).slice(0, -8)}
                                                onChange={e=>{
                                                    let value = e.target.value
                                                    let start = Date.parse(value)
                                                    let end = Date.parse(this.state.newTo)
                                                    if (start > end) {
                                                        let newToValue = String(new Date(new Date(start + 10800000).setMinutes(59)).toISOString()).slice(0, -8)
                                                        this.setState({newTo: newToValue}) 
                                                    }
                                                    else if (start < end && (start + 3540000) > end) {
                                                        
                                                        let newToValue = String(new Date(new Date(start + 10800000).setMinutes(59)).toISOString()).slice(0, -8)
                                                        this.setState({newTo: newToValue}) 
                                                    }
                                                    this.setState({newFrom: value})
                                                }} required />
                                        </div>                                                         
                                    </div>

                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        color: "white",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        marginBottom: "2em"
                                    }}>                                      
                                        <div style={{paddingTop: "0.5em", marginRight: "1em"}}> 
                                            TERMINATES at: 
                                        </div>
                                        <div>
                                            {this.state.untilToEdit}
                                        </div>                                           
                                        <div>
                                            <input type="datetime-local" placeholder="Disregard to keep unaltered" size="21" style={{border:0, margin:"1em",  padding: "0.5em", borderRadius:"1em"}}
                                               min={String(new Date().toISOString()).slice(0, -8)}
                                                value={this.state.newTo} 
                                                
                                                onChange={e=>{

                                                    let value = e.target.value
                                                    let end = Date.parse(value)
                                                    let start = Date.parse(this.state.newFrom)
                                                    this.setState({newTo: e.target.value})

                                                    if (end < start) {            
                                                        
                                                        if (String(value).slice(8, 9) === "0" || String(value).slice(-5, -4) === "0") {
                                                            setTimeout(()=>{
                                                                let end = Date.parse(this.state.newTo)
                                                                let start = Date.parse(this.state.newFrom) 

                                                                if (end < start) {
                                                                    let newFromValue = String(new Date(new Date(end + 10800000).setMinutes(0)).toISOString()).slice(0, -8)
                                                                    console.log(newFromValue)
                                                                    this.setState({newFrom: newFromValue}) 
                                                                }
                                                            }, 1000)
                                                        } else {
                                                            let newFromValue = String(new Date(new Date(end + 10800000).setMinutes(0)).toISOString()).slice(0, -8)
                                                            this.setState({newFrom: newFromValue}) 
                                                        }
                                                    }                                        
                                                }} required />
                                           
                                        </div>                                                         
                                    </div>

                                    <div style={{ 
                                        width: "100%",
                                        display: "flex", 
                                        flexDirection: "row", 
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        marginBottom: "2em"
                                        }}>

                                        <button className="edit-button ui purple button" style={{background: "#574AE2"}} onClick={(e) => { 

                                            if (Date.parse(this.state.newFrom) < Date.parse(new Date())) {
                                                e.preventDefault()
                                                alert('NEW DATE CANNOT BE IN THE PAST!')
                                                return null
                                            } else if (this.state.newTo < this.state.newFrom ){
                                                alert('TERIMNATION TIME CANNOT BE BEFORE COMMENCEMENT!')
                                                return null

                                            }else {
                                                this.sendEditedTicket()
                                                this.setState({ editReservation: false })
                                            }
                                            
                                          }}>
                                            <span className="button-text">Confirm</span>
                                        </button>

                                        <button className="edit-button ui button" style={{background: "#222A68", color:"white"}} onClick={() => { this.setState({ editReservation: false }) }}>
                                        <span className="button-text"> Cancel</span>
                                        </button>

                                    </div>

                            </div>
                            :
                            null
                    }

                    {
                        this.state.paymentQuestion

                            ?

                            <div className="ui fluid container" style={{
                                position: "fixed", background: '#E8F1F2', color: "#13293D", top: "2em", padding: "2em", marginRight: "2em", marginLeft: "2em", borderRadius: "1em", overflowY: "auto",
                                maxHeight: "90%", border: "1em solid #2185D0"
                            }}>
                                <h2 style={{ color: "#945600" }}>Please enter a title of the event for each reservation prior to order confirmation.</h2>
                                {this.state.newOrdersListForRendering.map((i, index) => {
                                    return (
                                        <div key={index} style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", width: "50%" }} >
                                            <p>

                                                HALL: {this.state.newOrdersListForRendering[index].hall_title} <br />
                                                FROM: {this.state.newOrdersListForRendering[index].from} <br />
                                                TO: {this.state.newOrdersListForRendering[index].to}
                                            </p>
                                            <div className="ui input">
                                                <input type="text"
                                                    placeholder="Event title"
                                                    style={{
                                                        background: '#E8F1F2',
                                                        color: "#13293D",
                                                        border: "0.1em solid #2185D0",
                                                        lineHeight: "18px"
                                                    }}
                                                    onChange={(e) => {
                                                        let newArray = this.state.newOrdersListForTickets
                                                        newArray[index].event_title = e.target.value
                                                        this.setState({ newOrdersListForTickets: newArray })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                                }
                                <h3 style={{ color: "#945600" }}>
                                    Once you entitled each of the events, please confirm the order for its processing.
                                </h3>
                                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <button className="ui primary button" onClick={() => { this.handleClickedConfirm() }}>
                                        Confirm
																	          </button>
                                    <button className="ui button" onClick={() => { this.setState({ paymentQuestion: false }) }}>
                                        Cancel 
																	          </button>
                                </div>
                            </div>

                            :
                            null
                    }

                    {
                        this.state.halls.length > 0
                            ?
                            <div style={{ display: 'flex', flexDirection: 'row', flexFlow: 'wrap', justifyConter: "space-between" }}>
                                {this.state.halls.map((i, index) => {
                                    return (
                                        <div key={index} >
                                            <HallCard image={i.imageURL} title={i.title} description={i.description} cssClass={`${this.state.colours[index]}-hall`} />
                                        </div>
                                    )
                                })
                                }
                            </div>
                            :
                            null
                    }                   
                </div>

                :
                <Redirect to='/login' />
        );
    }
} 