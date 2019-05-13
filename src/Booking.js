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
	},
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
        colours: ['bro', 'gre', 'red', 'blu', 'vio'],
		displayDayCards: false,
        ordersListForTickets: '',
		ordersListForRendering: '',
        paymentQuestion: false,
        
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

    checkReservation(slotID) {                                  //MOVE IT TO CHILD
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
                
                setClick={click => this.clickChild = click}
            />)
            IDs.push(cardKey)
        }
        return {
            days: days,
            dayCardsID: IDs
        }
    }

    // CONVERTING RESERVED TICKETS INTO SEPARATE HOUR AND ROOM SLOTS:


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


// AFTER CLICKING PAYMENT BUTTON 
// TILL SHOWING PAYMENT QUESTION
// IT CAN BE REWRITTEN INTO PROMISE

    confirmReservation() {
        if (sessionStorage.getItem('chosenSlots') === null || JSON.parse(sessionStorage.getItem('chosenSlots')).length === 0) {
            alert('There is nothing to confirm. Please choose rooms you like to book first.')
        } else if (JSON.parse(sessionStorage.getItem('chosenSlots').length > 0)) {
            let chosenHalls = JSON.parse(sessionStorage.getItem('chosenSlots')) // I CAN MAKE A LIST AS A MESSAGE FOR CONFIRMATION IF I HAVE TIME
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
                let sameHallTicketsArray = []                                           //no hallarrays in ticketsHallsArray
                sameHallTicketsArray.push(orderList[i])           // adds first hallarray into tickets HallsArray
                ticketsHallsArray.push(sameHallTicketsArray)
                ifNewHallArrayIsNeeded = false
            } else {
                for (let j = 0; j < ticketsHallsArray.length; j++) {
                    if (ticketsHallsArray[j][0].hall_id === orderList[i].hall_id) {       //if hallarray with the same hall_id exists
                        ticketsHallsArray[j].push(orderList[i])                           // adds ticket into that array
                        ifNewHallArrayIsNeeded = false
                    }
                }       
            } 
            if (ifNewHallArrayIsNeeded) { 
                let sameHallTicketsArray = []                                           //if no hallarray with the same hall_id
                sameHallTicketsArray.push(orderList[i])           // adds new hallarray into tickets HallsArray
                ticketsHallsArray.push(sameHallTicketsArray)
            }
        }
        this.uniteAdjacentTickets(ticketsHallsArray)
    }

    uniteAdjacentTickets(ticketsHallsArray) {
        let doItAgain = false
      
        ticketsHallsArray.forEach((ticketsArrayOfSameHall) => {
        
            for (let i = 0; i < ticketsArrayOfSameHall.length; i++) {
                for (let j = 0; j < ticketsArrayOfSameHall.length; j++ ) {

                    if((ticketsArrayOfSameHall[j].from - ticketsArrayOfSameHall[i].to) < 300000 && 
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
            ticketsHallsArray.forEach(i=>i.forEach(ii=>arrayWithUnitedAdjacentTickets.push(ii)))
            //this.setState({ordersListForTickets: [...arrayWithUnitedAdjacentTickets]})
            this.setState({ordersListForTickets: arrayWithUnitedAdjacentTickets})
            
            this.convertOrdersToRender(arrayWithUnitedAdjacentTickets)
        }  
    }

    convertOrdersToRender(orders) {
        let OrdersListForRendering = []
        const timeOptionsForRendering = {
            day: 'numeric',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
        }
        for (let i = 0; i < orders.length; i++) {
            let orderForRendering = {
                hall_title: orders[i].hall_title,
                from: new Intl.DateTimeFormat('en-GB', timeOptionsForRendering).format(orders[i].from),
                to: new Intl.DateTimeFormat('en-GB', timeOptionsForRendering).format(orders[i].to),
            }
            OrdersListForRendering.push(orderForRendering)       
        }           
            this.setState({ordersListForRendering: OrdersListForRendering})
            this.setState({paymentQuestion: true})
    }

    handleClickedConfirm() {
        this.setState({paymentQuestion: false})
        sessionStorage.removeItem('chosenSlots')
        this.setState({ chosenSlots: [] })
        this.setState({ordersListForRendering: ''})
        this.issueTickets()


        
	}
 
    issueTickets(){

        let axiosRequests = []

        for (let i = 0; i < this.state.ordersListForTickets.length; i++) {
            let request = axios({
                method: 'post',
                url: 'http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/tickets',
                data: {
                    hall_id: this.state.ordersListForTickets[i].hall_id,
                    user_id: localStorage.getItem('user_id'),
                    title: "default",
                    from: this.state.ordersListForTickets[i].from,
                    to: this.state.ordersListForTickets[i].to,
                },
                headers: {      
                    ContentType: "application/x-www-form-urlencoded",              
                    Authorization: localStorage.getItem('token'),
                }
            })
            
            axiosRequests.push(request)
        }

        
        Promise.all(axiosRequests)
        //.then(res => console.log(res))
        .then(()=> this.setState({ordersListForTickets: ''}))
        .then(()=> {
            this.forceUpdate()
            this.setState({rerenderDays: true})
            
        })
        .then(() => this.clickChild())
        .catch(error => console.log(error.message))
    }




    
    componentDidMount() {

        Promise.all([
            axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/halls'),         // to get all halls
            axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/tickets')        // to get all tickets
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


        this.setState({ dayCardsID: [...this.renderDayCards().dayCardsID] })
        if (sessionStorage.getItem('chosenSlots') !== null) {
            this.setState({ chosenSlots: JSON.parse(sessionStorage.getItem('chosenSlots')) })
        }
    }

    redirect() {
        this.props.history.push('/login')
    }

    render() {
        return (
            (typeof sessionStorage.getItem('LoggedIn') === "string" && sessionStorage.getItem('LoggedIn').length > 2)

                ?

                <div className={this.state.myClasses.main}>
                    <ButtonAppBarBooking history={this.props.history} confirm={this.confirmReservation.bind(this)} />
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
                                Enter a date or scroll down the page.
                                Only logged in users can make reservations.
                                </p>
                            <p className="manual-par">
                                9" means 9:00-10:00; 10" means 10:00-11:00.
                                </p>
                            <p className='manual-par'>
                                Once you have selected all the rooms you would like to book
                                click payment button
                                </p>
                            <p className='manual-par'>
                                in order to make reservation
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
												{
													this.state.paymentQuestion

														?

														<div className="ui fluid container" style={{position:"fixed", background: "#3f51b5", color:"white", top: "1em", padding: "2em", marginRight: "2em", marginLeft: "2em", borderRadius: "1em", overflowY: "auto",
                                                        maxHeight: "90%"}}>
																<h2>Do you confirm the following order?</h2>
																{this.state.ordersListForRendering.map((i, index) => {
																				return (
																					<div key={index}>
																						<p>
																							HALL: {this.state.ordersListForRendering[index].hall_title} <br /> 
																							FROM: {this.state.ordersListForRendering[index].from} <br />
																							TO: {this.state.ordersListForRendering[index].to}
																						</p>
																						<p></p>
																					</div>																																			
																				 ); 																
																	})		
																}
																<div style={{width:"100%", display:"flex", flexDirection:"row", justifyContent: "space-between"}}>
																	<button className="ui primary button" onClick={()=>{this.handleClickedConfirm()}}>
																		Confirm
																	</button>
																	<button className="ui button" onClick={()=>{this.setState({paymentQuestion: false})}}>
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
                                                <HallCard  image={i.imageURL} title={i.title} description={i.description} cssClass={`${this.state.colours[index]}-hall`} />
                                            </div>
                                        )
                                    })}
                                </div>
                                :

                                <div> </div>
                        }
                    </div>

                    {   
                        this.state.displayDayCards

                            ?

                            this.renderDayCards(this.chosenSlot).days

                            :

                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingTop: "3em" }}>
                                <CircularProgress />
                            </div>
                    }
                </div>

                :
                <Redirect to='/login' />
        );
    }
} 