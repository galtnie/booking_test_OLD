import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import ButtonAppBar from './components/HomeUpperBar';
import HomeDayCard from './components/HomeDayCard';
import { Redirect } from 'react-router-dom';
import { RedFree, RedBusy } from './components/Rooms'
import './css/Home.css';
import axios from 'axios';
// import { array } from 'prop-types';

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

let indic = -1

export default class Home extends Component {

    state = {
        myClasses: styles,
        dayCardsID: "initial",
        reservedSlots: [],
        halls: [],
        displayHalls: 'none',
        hall1title: '',
        hall2title: '',
        hall3title: '',
        hall4title: '',
        hall5title: '',
        hall1blue: '',
        hall2green: '',
        hall3red: '',
        hall4violet: '',
        hall5brown: '',
        hall1description: '',
        hall2description: '',
        hall3description: '',
        hall4description: '',
        hall5description: '',
        tickets: [],
        img: '',
        img2: '',
        img3: '',
    }

    calculateDate(fullDate, counter) {
        // let fullDate = new Date();
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
        for (let i = 1; i < 32; i++) {
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
        return `date:${fullDate}${fullMonth}${fullYear}hour:${hour}`
    }

    deleteMinutesSecondsMilisecs(time){
        let datehour = new Date(time.setMilliseconds(0))
        datehour = new Date(datehour.setSeconds(0))
        datehour = new Date(datehour.setMinutes(0))
        return datehour
    }

    addingHoursIntoReservation(time1, time2, Tid){
        
        indic += 1
        console.log(indic)
        
        console.log('time 1')
        console.log(time1)
        console.log(Tid)
        console.log('time 2')
        console.log(time2)
        

        let id =  this.convertTimeIntoSlotID(time1)
        this.setState({ reservedSlots: [[...this.state.dayCardsID], id] })

        let firstHour  = time1.getHours()
        let secondHour = time2.getHours()   
        if(firstHour < secondHour){
            let nextHour = new Date(time1.setTime(time1.getTime() + (60*60*1000)))
            this.addingHoursIntoReservation(nextHour, time2, Tid)
        }     
    }

    addingDaysIntoReservation(time1, time2, Tid) {
        if (time1 < time2 && 
        (   time1.getDate() !== time2.getDate() ||
            time1.getMonth() !== time2.getMonth() ||
            time1.getYear() !== time2.getYear()
        )) {
            this.addingHoursIntoReservation(time1, time1.setHours(23))
            let tomorrow = this.calculateDate(time1, 1).dateObject
            tomorrow = tomorrow.setHours(0)
            this.addingDaysIntoReservation(tomorrow, time2, Tid)
        } else {
            this.addingHoursIntoReservation(time1, time2, Tid)
        }
    }

    calculateSlotsReserved() {
        debugger;

        for(let i=0; i<this.state.tickets.length; i++) {
            let fromTime = new Date(this.state.tickets[i].from)
            let toTime = new Date(this.state.tickets[i].to)         

            if (fromTime !== toTime && fromTime < toTime) {
                fromTime = this.deleteMinutesSecondsMilisecs(fromTime)
                toTime = this.deleteMinutesSecondsMilisecs(toTime)
                this.addingDaysIntoReservation(fromTime, toTime, this.state.tickets[i]._id)
            }
        }   
    }

    componentDidMount() {
        axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/halls')         // to get all halls
            .then(res => {
                console.log(res)
                this.setState({ halls: res.data.halls })
                this.setState({hall1title : this.state.halls[0].title})
                this.setState({hall2title : this.state.halls[1].title})
                this.setState({hall3title : this.state.halls[2].title})
                this.setState({hall4title : this.state.halls[3].title})
                this.setState({hall5title : this.state.halls[4].title})
                this.setState({hall1description : this.state.halls[0].description})
                this.setState({hall2description : this.state.halls[1].description})
                this.setState({hall3description : this.state.halls[2].description})
                this.setState({hall4description : this.state.halls[3].description})
                this.setState({hall5description : this.state.halls[4].description})
                this.setState({hall1blu : this.state.halls[0]._id})
                this.setState({hall2gre : this.state.halls[1]._id})
                this.setState({hall3red : this.state.halls[2]._id})
                this.setState({hall4vio : this.state.halls[3]._id})
                this.setState({hall5bro : this.state.halls[4]._id})
                this.setState({img : this.state.halls[0].imageURL})
                this.setState({img2 : this.state.halls[1].imageURL})
                this.setState({img3 : this.state.halls[2].imageURL})
            })
            .then(() => {
                this.setState({ displayHalls: 'flex'})
            })

        axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/tickets')         // to get all tickets
            .then(res => {
                console.log(res);
                this.setState({tickets : res.data})
            })
            .then(()=> {
                console.log(this.state.tickets)
                
                // this.calculateSlotsReserved() 
            })
            .then(()=> console.log(this.state.reservedSlots))


        this.setState({ dayCardsID: [...this.renderDayCards().dayCardsID] })
        // if (localStorage.getItem('bookedSlots') !== null) {                                          //I SWITCHED OFF bookedSlots FROM LOCAL STORAGE
        //     this.setState({ reservedSlots: JSON.parse(localStorage.getItem('bookedSlots')) })
        // }
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
                        <div style={{ display: this.state.displayHalls, flexDirection: "column", width: '100%' }}>
                            <div className="hall-info-container blue-hall">
                                <img src={this.state.img} alt='image'/>
                                <p className='hall-title'>{this.state.hall1title}</p>
                                <p>{this.state.hall1description}</p>
                            </div>
                            <div className="hall-info-container green-hall">
                                <img src={this.state.img2} alt='image'/>
                                <p className='hall-title'>{this.state.hall2title}</p>
                                <p>{this.state.hall2description}</p>
                            </div>
                            <div className="hall-info-container red-hall">
                                <img src={this.state.img3} alt='image'/>
                                <p className='hall-title'>{this.state.hall3title}</p>
                                <p>{this.state.hall3description}</p>
                            </div>
                            <div className="hall-info-container violet-hall">
                                <p className='hall-title'>{this.state.hall4title}</p>
                                <p>{this.state.hall4description}</p>
                            </div>
                            <div className="hall-info-container brown-hall">
                                <p className='hall-title'>{this.state.hall5title}</p>
                                <p>{this.state.hall5description}</p>
                            </div>
                        </div>
                    </div>
                    { this.renderDayCards().days }
                </div >

            )
        } else {
            return <Redirect to='/booking' />
        }
    }
}



























// import React, { Component } from 'react';
// // import { Link } from 'react-router-dom';
// import ButtonAppBar from './components/HomeUpperBar';
// import HomeDayCard from './components/HomeDayCard';
// import { Redirect } from 'react-router-dom';
// import { RedFree, RedBusy } from './components/Rooms'
// import './css/Home.css';
// import axios from 'axios';
// // import { array } from 'prop-types';

// const styles = {
//     main: {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//     },
//     title: {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         color: '#7D6B91',
//         paddingTop: '2em',
//         paddingBottom: '1em',
//         marginLeft: "0.5em",
//         marginRight: "0.5em",
//     }
// }

// let indic = -1

// export default class Home extends Component {

//     state = {
//         myClasses: styles,
//         dayCardsID: "initial",
//         reservedSlots: [],
//         halls: [],
//         displayHalls: 'none',
//         hall1title: '',
//         hall2title: '',
//         hall3title: '',
//         hall4title: '',
//         hall5title: '',
//         hall1blue: '',
//         hall2green: '',
//         hall3red: '',
//         hall4violet: '',
//         hall5brown: '',
//         hall1description: '',
//         hall2description: '',
//         hall3description: '',
//         hall4description: '',
//         hall5description: '',
//         tickets: [],
//         img: '',
//         img2: '',
//         img3: '',
//     }

//     calculateDate(fullDate, counter) {
//         // let fullDate = new Date();
//         let nextDate = fullDate.getDate() + counter;
//         fullDate.setDate(nextDate);
//         const tomorrow = fullDate
//         const monthOption = { month: 'long' };
//         const weekdayOption = { weekday: 'long' };
//         const date = fullDate.getDate()
//         const month = new Intl.DateTimeFormat('en-GB', monthOption).format(fullDate)
//         const weekday = new Intl.DateTimeFormat('en-GB', weekdayOption).format(fullDate)
//         const keyDate = date.toString().length === 2 ? date : "0" + date;
//         const keyMonth = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1) : "0" + (fullDate.getMonth() + 1);
//         const keyYear = fullDate.getYear().toString().slice(1)

//         return ({
//             dateObject: tomorrow,
//             date: `${date} ${month}, ${weekday}`,
//             key: `${keyDate}${keyMonth}${keyYear}`,
//         });
//     }

//     renderDayCards() {
//         let days = [];
//         let IDs = [];
//         for (let i = 1; i < 32; i++) {
//             const cardDate = this.calculateDate(new Date(), i).date;
//             const cardKey = this.calculateDate(new Date(), i).key;
//             days.push(<HomeDayCard
//                 date={cardDate}
//                 key={cardKey}
//                 anchor={cardKey}
//                 id={"date:" + cardKey}
//                 checkReservation={this.checkReservation.bind(this)}
//             />)
//             IDs.push(cardKey)
//         }
//         return {
//             days: days,
//             dayCardsID: IDs
//         }
//     }

//     checkReservation(slotID) {
//         return this.state.reservedSlots.includes(slotID)
//     }

//     convertTimeIntoSlotID(fullRecord) {
//         let date = fullRecord.getDate()
//         let fullDate = date.toString().length === 2 ? date : "0" + date;
//         let fullMonth = (fullRecord.getMonth() + 1).toString().length === 2 ? (fullRecord.getMonth() + 1) : "0" + (fullRecord.getMonth() + 1);
//         let fullYear = fullRecord.getYear().toString().slice(1)
//         let hour = fullRecord.getHours()
//         return `date:${fullDate}${fullMonth}${fullYear}hour:${hour}`
//     }

//     deleteMinutesSecondsMilisecs(time){
//         let datehour = new Date(time.setMilliseconds(0))
//         datehour = new Date(datehour.setSeconds(0))
//         datehour = new Date(datehour.setMinutes(0))
//         return datehour
//     }

//     addingHoursIntoReservation(time1, time2, Tid){
        
//         indic += 1
//         console.log(indic)
        
//         console.log('time 1')
//         console.log(time1)
//         console.log(Tid)
//         console.log('time 2')
//         console.log(time2)
        

//         let id =  this.convertTimeIntoSlotID(time1)
//         this.setState({ reservedSlots: [[...this.state.dayCardsID], id] })

//         let firstHour  = time1.getHours()
//         let secondHour = time2.getHours()   
//         if(firstHour < secondHour){
//             let nextHour = new Date(time1.setTime(time1.getTime() + (60*60*1000)))
//             this.addingHoursIntoReservation(nextHour, time2, Tid)
//         }     
//     }

//     addingDaysIntoReservation(time1, time2, Tid) {
//         if (time1 < time2 && 
//         (   time1.getDate() !== time2.getDate() ||
//             time1.getMonth() !== time2.getMonth() ||
//             time1.getYear() !== time2.getYear()
//         )) {
//             this.addingHoursIntoReservation(time1, time1.setHours(23))
//             let tomorrow = this.calculateDate(time1, 1).dateObject
//             tomorrow = tomorrow.setHours(0)
//             this.addingDaysIntoReservation(tomorrow, time2, Tid)
//         } else {
//             this.addingHoursIntoReservation(time1, time2, Tid)
//         }
//     }

//     calculateSlotsReserved() {
//         debugger;

//         for(let i=0; i<this.state.tickets.length; i++) {
//             let fromTime = new Date(this.state.tickets[i].from)
//             let toTime = new Date(this.state.tickets[i].to)         

//             if (fromTime !== toTime && fromTime < toTime) {
//                 fromTime = this.deleteMinutesSecondsMilisecs(fromTime)
//                 toTime = this.deleteMinutesSecondsMilisecs(toTime)
//                 this.addingDaysIntoReservation(fromTime, toTime, this.state.tickets[i]._id)
//             }
//         }   
//     }

//     componentDidMount() {
//         axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/halls')         // to get all halls
//             .then(res => {
//                 console.log(res)
//                 this.setState({ halls: res.data.halls })
//                 this.setState({hall1title : this.state.halls[0].title})
//                 this.setState({hall2title : this.state.halls[1].title})
//                 this.setState({hall3title : this.state.halls[2].title})
//                 this.setState({hall4title : this.state.halls[3].title})
//                 this.setState({hall5title : this.state.halls[4].title})
//                 this.setState({hall1description : this.state.halls[0].description})
//                 this.setState({hall2description : this.state.halls[1].description})
//                 this.setState({hall3description : this.state.halls[2].description})
//                 this.setState({hall4description : this.state.halls[3].description})
//                 this.setState({hall5description : this.state.halls[4].description})
//                 this.setState({hall1blu : this.state.halls[0]._id})
//                 this.setState({hall2gre : this.state.halls[1]._id})
//                 this.setState({hall3red : this.state.halls[2]._id})
//                 this.setState({hall4vio : this.state.halls[3]._id})
//                 this.setState({hall5bro : this.state.halls[4]._id})
//                 this.setState({img : this.state.halls[0].imageURL})
//                 this.setState({img2 : this.state.halls[1].imageURL})
//                 this.setState({img3 : this.state.halls[2].imageURL})
//             })
//             .then(() => {
//                 this.setState({ displayHalls: 'flex'})
//             })

//         axios.get('http://ec2-3-84-16-108.compute-1.amazonaws.com:4000/tickets')         // to get all tickets
//             .then(res => {
//                 console.log(res);
//                 this.setState({tickets : res.data})
//             })
//             .then(()=> {
//                 console.log(this.state.tickets)
                
//                 // this.calculateSlotsReserved() 
//             })
//             .then(()=> console.log(this.state.reservedSlots))


//         this.setState({ dayCardsID: [...this.renderDayCards().dayCardsID] })
//         // if (localStorage.getItem('bookedSlots') !== null) {                                          //I SWITCHED OFF bookedSlots FROM LOCAL STORAGE
//         //     this.setState({ reservedSlots: JSON.parse(localStorage.getItem('bookedSlots')) })
//         // }
//     }

//     render() {
//         if (typeof sessionStorage.getItem('LoggedIn') !== "string") {
//             return (
//                 <div className={this.state.myClasses.main}>
//                     <ButtonAppBar />
//                     <div style={this.state.myClasses.title}>
//                         <div>
//                             <h1 className="ui header" style={{ color: 'inherit' }}>Conference Venue Booking</h1>
//                         </div>
//                     </div>
//                     <div className="manual">
//                         <div>
//                             <p className="manual-par">
//                                 Enter a date or scroll down the page.
//                             </p>
//                             <p className="manual-par">
//                                 Only logged in users can make reservations.
//                             </p>
//                             <p className="manual-par">
//                                 9" means 9:00-10:00; 10" means 10:00-11:00.
//                             </p>
//                         </div>
//                         <div>
//                             <div className="manual-div">
//                                 <RedFree />
//                                 <span className="manual-par">
//                                     The red room is free at this time
//                                 </span>
//                             </div>
//                             <div className="manual-div">
//                                 <RedBusy />
//                                 <span className="manual-par">
//                                     The red room is reserved at this time
//                                 </span>
//                             </div>
//                         </div>
//                         <div style={{ display: this.state.displayHalls, flexDirection: "column", width: '100%' }}>
//                             <div className="hall-info-container blue-hall">
//                                 <img src={this.state.img} alt='image'/>
//                                 <p className='hall-title'>{this.state.hall1title}</p>
//                                 <p>{this.state.hall1description}</p>
//                             </div>
//                             <div className="hall-info-container green-hall">
//                                 <img src={this.state.img2} alt='image'/>
//                                 <p className='hall-title'>{this.state.hall2title}</p>
//                                 <p>{this.state.hall2description}</p>
//                             </div>
//                             <div className="hall-info-container red-hall">
//                                 <img src={this.state.img3} alt='image'/>
//                                 <p className='hall-title'>{this.state.hall3title}</p>
//                                 <p>{this.state.hall3description}</p>
//                             </div>
//                             <div className="hall-info-container violet-hall">
//                                 <p className='hall-title'>{this.state.hall4title}</p>
//                                 <p>{this.state.hall4description}</p>
//                             </div>
//                             <div className="hall-info-container brown-hall">
//                                 <p className='hall-title'>{this.state.hall5title}</p>
//                                 <p>{this.state.hall5description}</p>
//                             </div>
//                         </div>
//                     </div>
//                     { this.renderDayCards().days }
//                 </div >

//             )
//         } else {
//             return <Redirect to='/booking' />
//         }
//     }
// }