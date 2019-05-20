import React, { Component } from 'react'
import '../css/HomeDayCard.css';
import { RedFreeHome, RedBusy, BlueFreeHome, BlueBusy, GreenFreeHome, GreenBusy, VioletFreeHome, VioletBusy, BrownFreeHome, BrownBusy } from './Rooms'

export default class HomeDayCard extends Component {
    state = {}

    renderHour(hour) {
        return <div style={{ paddingLeft: "0.38em" }}>{hour}"</div>
    }

    renderRooms(date, hour, colour) {
        switch (colour) {
            case "red":
                if (this.props.checkReservation(date + hour + "colour:red")) {
                    return <RedBusy id={date + hour + "colour:red"} />
                } else {
                    return <RedFreeHome id={date + hour + "colour:red"} chooseSlot={this.props.chooseSlot} />
                    }
            case "blue":
                if (this.props.checkReservation(date + hour + "colour:blu")) {
                    return <BlueBusy id={date + hour + "colour:blu"} />
                } else {
                    return <BlueFreeHome id={date + hour + "colour:blu"} chooseSlot={this.props.chooseSlot} />
                }
            case "green":
                if (this.props.checkReservation(date + hour + "colour:gre")) {
                    return <GreenBusy id={date + hour + "colour:gre"} />
                } else {
                    return <GreenFreeHome id={date + hour + "colour:gre"} chooseSlot={this.props.chooseSlot} />

                }
            case "violet":
                if (this.props.checkReservation(date + hour + "colour:vio")) {
                    return <VioletBusy id={date + hour + "colour:vio"} />
                } else {
                    return <VioletFreeHome id={date + hour + "colour:vio"} chooseSlot={this.props.chooseSlot} />
                }
            case "brown":
                if (this.props.checkReservation(date + hour + "colour:bro")) {
                    return <BrownBusy id={date + hour + "colour:bro"} />
                } else {
                    return <BrownFreeHome id={date + hour + "colour:bro"} chooseSlot={this.props.chooseSlot} />        
                }

            default:
                return "Slot"
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
                        {this.renderRooms(this.props.id, hourForIdName, 'brown')}
                    </div>
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'green')}
                    </div>
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'red')}
                    </div>
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'blue')}
                    </div>
                    <div>
                        {this.renderRooms(this.props.id, hourForIdName, 'violet')}
                    </div>
                </div>
            );
        }
        return hours
    }


    render() {
        return (
            <div id={this.props.id} style={{ marginTop: "2em", marginBottom: "2em"}}>
                <div className="home-hours-card">{this.renderOneHourContainer()}</div>
            </div>
        );
    }
}