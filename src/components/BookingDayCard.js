import React, { Component } from 'react'
import HomeDayBar from './HomeDayBar';
import '../css/HomeDayCard.css';
import { RedFree, RedBusy, RedChosen, BlueFree, BlueBusy, BlueChosen, GreenFree, GreenBusy, GreenChosen, VioletFree, VioletBusy, VioletChosen, BrownFree, BrownBusy, BrownChosen } from './Rooms'
import axios from 'axios';
export default class BookingDayCard extends Component {


    constructor(props) {
        super(props);


        this.state = {
            
            rerender : false,
            reservedSlots : [],   // moved from parent
            halls : [],
            tickets : [],
            colours : ['bro', 'gre', 'red', 'blu', 'vio'],

        }

        this.getAlert = this.getAlert.bind(this);
    }


    getAlert() {
        this.setState({rerender: true})
        console.log('child rerenders')
        console.log(this.state.rerender)
        this.forceUpdate()
     }

     // MOVING HERE FUNCTIONS FROM PARENT IN ORDER TO MAKE THE COMPONENT UPDATE INDEPENDENTLY AFTER MAKING RESERVATIONS

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
        return this.state.reservedSlots.includes(slotID)
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

    deleteMinutesSecondsMilisecs(time) {
        let datehour = new Date(time.setMilliseconds(0))
        datehour = new Date(datehour.setSeconds(0))
        datehour = new Date(datehour.setMinutes(0))
        return datehour
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

    addColourToID(hall_id) {
        let arraysHallsID = this.state.halls.map(i => i._id)
        let hallNumber = arraysHallsID.indexOf(hall_id)

        console.log(this.state.colours)
        console.log(hallNumber)
        return `colour:${this.state.colours[hallNumber]}`
    }

    addSlotToReservationList(time, hall_id) {
        let slotIdTimeHour = this.convertTimeIntoSlotID(time)
        let slotIdColour = this.addColourToID(hall_id)
        let slotId = slotIdTimeHour + slotIdColour
        let newReservedSlotsList = this.state.reservedSlots.slice();
        newReservedSlotsList.push(slotId)
        this.setState({ reservedSlots: newReservedSlotsList })
        console.log(this.state.reservedSlots)
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

    renderHour(hour) {
        return <div style={{ paddingLeft: "0.38em" }}>{hour}"</div>
    }

    renderRooms(date, hour, colour) {
        switch (colour) {
            case "red":
                if (this.props.checkReservation(date + hour + "colour:red")) {
                    return <RedBusy id={date + hour + "colour:red"} />;
                } else if (this.props.checkSlot(date + hour + "colour:red")) {
                    return <RedChosen id={date + hour + "colour:red"} deselect={this.props.deselect} />;
                } else {
                    return <RedFree id={date + hour + "colour:red"} chooseSlot={this.props.chooseSlot} />;
                }
            case "blue":
                if (this.props.checkReservation(date + hour + "colour:blu")) {
                    return <BlueBusy id={date + hour + "colour:blu"} />;
                } else if (this.props.checkSlot(date + hour + "colour:blu")) {
                    return <BlueChosen id={date + hour + "colour:blu"} deselect={this.props.deselect} />;
                } else {
                    return <BlueFree id={date + hour + "colour:blu"} chooseSlot={this.props.chooseSlot} />;
                }
            case "green":
                if (this.props.checkReservation(date + hour + "colour:gre")) {
                    return <GreenBusy id={date + hour + "colour:gre"} />;
                } else if (this.props.checkSlot(date + hour + "colour:gre")) {
                    return <GreenChosen id={date + hour + "colour:gre"} deselect={this.props.deselect} />;
                } else {
                    return <GreenFree id={date + hour + "colour:gre"} chooseSlot={this.props.chooseSlot} />
                }


            case "violet":
                if (this.props.checkReservation(date + hour + "colour:vio")) {
                    return <VioletBusy id={date + hour + "colour:vio"} />;
                } else if (this.props.checkSlot(date + hour + "colour:vio")) {
                    return <VioletChosen id={date + hour + "colour:vio"} deselect={this.props.deselect} />;
                } else {
                    return <VioletFree id={date + hour + "colour:vio"} chooseSlot={this.props.chooseSlot} />;
                }


            case "brown":
                if (this.props.checkReservation(date + hour + "colour:bro")) {
                    return <BrownBusy id={date + hour + "colour:bro"} />;
                } else if (this.props.checkSlot(date + hour + "colour:bro")) {
                    return <BrownChosen id={date + hour + "colour:bro"} deselect={this.props.deselect} />;
                } else {
                    return <BrownFree id={date + hour + "colour:bro"} chooseSlot={this.props.chooseSlot} />;
                }
            default:
                return "room";
        }
    }

    renderOneHourContainer() {
        let hours = []
        for (let i = 0; i <= 23; i++) {
            let hourForIdName = String(i).length === 1 ? "hour:0" + i : "hour:" + i;

            hours.push(
                <div id={this.props.id + hourForIdName} key={`${this.id}${hourForIdName}`} className='home-one-hour-countainer'>
                    {this.renderHour(i)}
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'blue')}
                    </div>
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'green')}
                    </div>
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'red')}
                    </div>
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'violet')}
                    </div>
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'brown')}
                    </div>
                </div>
            );
        }
        return hours
    }

    componentDidMount() {
        this.props.setClick(this.getAlert);
        this.setState({rerender: false})
        
        Promise.all([           // COMMENT THIS PROMISE IF CODE DOES NOT WORK
            axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/halls'),         // to get all halls
            axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/tickets')        // to get all tickets
        ])
            .then(res => {
                console.log(res)
                this.setState({ halls: res[0].data.halls })
                this.setState({ tickets: res[1].data })
            })
            .then(() => {
                this.calculateSlotsReserved()
            })    
            .catch((e) => console.log(e))
    }




    render() {

        return (
            <div id={this.props.id}>
                <HomeDayBar date={this.props.date} />
                <div className="home-hours-card">{this.renderOneHourContainer()}</div>
            </div>
        );
    }
}