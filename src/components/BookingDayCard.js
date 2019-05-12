import React, { Component } from 'react'
import HomeDayBar from './HomeDayBar';
import '../css/HomeDayCard.css';
import { RedFree, RedBusy, RedChosen, BlueFree, BlueBusy, BlueChosen, GreenFree, GreenBusy, GreenChosen, VioletFree, VioletBusy, VioletChosen, BrownFree, BrownBusy, BrownChosen } from './Rooms'

export default class BookingDayCard extends Component {
    state = {}

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


    render() {
        return (
            <div id={this.props.id}>
                <HomeDayBar date={this.props.date} />
                <div className="home-hours-card">{this.renderOneHourContainer()}</div>
            </div>
        );
    }
}