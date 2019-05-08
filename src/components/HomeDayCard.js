import React, { Component } from 'react'
import HomeDayBar from './HomeDayBar';
import '../css/HomeDayCard.css';
import { RedFreeHome, RedBusy, BlueFreeHome, BlueBusy, GreenFreeHome, GreenBusy } from './Rooms'

export default class HomeDayCard extends Component {
    state = {}

    renderHour(hour) {
        return <div style={{ paddingLeft: "0.38em" }}>{hour}"</div>
    }

    renderRooms(date, hour, colour) {
        switch (colour) {
            case "red":
                if (this.props.checkReservation(date + hour + "colour:red")) {
                    return (
                        <div>
                            <RedBusy id={date + hour + "colour:red"} />
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <RedFreeHome id={date + hour + "colour:red"} chooseSlot={this.props.chooseSlot} />
                        </div>
                    );
                }
            case "blue":
            if (this.props.checkReservation(date + hour + "colour:blu")) {
                return (
                    <div>
                        <BlueBusy id={date + hour + "colour:blu"} />
                    </div>
                )
            } else {
                return (
                    <div>
                        <BlueFreeHome id={date + hour + "colour:blu"} chooseSlot={this.props.chooseSlot} />
                    </div>
                );
            }
            case "green":
            if (this.props.checkReservation(date + hour + "colour:gre")) {
                return (
                    <div>
                        <GreenBusy id={date + hour + "colour:gre"} />
                    </div>
                );
            } else {
                return (
                    <div>
                        <GreenFreeHome id={date + hour + "colour:gre"} chooseSlot={this.props.chooseSlot} />
                    </div>
                );
            }
            default: 
                return (
                    <div>
                        Slot
                    </div>
                )
        }
    }
    renderOneHourContainer() {
        let hours = []
        for (let i = 0; i <= 23; i++) {
            let hourForIdName = String(i).length === 1 ? "hour:0" + i : "hour:" + i;

            hours.push(
                <div id={this.props.id + hourForIdName} key={`${this.id}${hourForIdName}`} className='home-one-hour-countainer'>
                    {this.renderHour(i)}
                    {this.renderRooms(this.props.id, hourForIdName, 'red')}
                    {this.renderRooms(this.props.id, hourForIdName, 'blue')}
                    {this.renderRooms(this.props.id, hourForIdName, 'green')}
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