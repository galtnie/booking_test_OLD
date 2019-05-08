import React, { Component } from 'react'
import HomeDayBar from './HomeDayBar';
import '../css/HomeDayCard.css';
import { RedFree, RedBusy, RedChosen, BlueFree, BlueBusy, BlueChosen, GreenFree, GreenBusy, GreenChosen } from './Rooms'

export default class BookingDayCard extends Component {
    state = {}

    renderHour(hour) {
        return <div style={{ paddingLeft: "0.38em" }}>{hour}"</div>
    }

    renderRooms(date, hour, colour) {
        switch (colour) {
            case "red":
                // console.log(this.props.checkSlot(date+hour+"colour:red").bind(this))
                if (this.props.checkSlot(date + hour + "colour:red")) {
                    return (
                        <div>
                            <RedChosen id={date + hour + "colour:red"} deselect={this.props.deselect} />
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <RedFree id={date + hour + "colour:red"} chooseSlot={this.props.chooseSlot} />
                        </div>
                    );
                }
            case "blue":
                if (this.props.checkSlot(date + hour + "colour:blu")) {
                    return (
                        <div>
                            <BlueChosen id={date + hour + "colour:blu"} deselect={this.props.deselect} />
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <BlueFree id={date + hour + "colour:blu"} chooseSlot={this.props.chooseSlot} />
                        </div>
                    );
                }
            case "green":

                if (this.props.checkSlot(date + hour + "colour:gre")) {
                    return (
                        <div>
                            <GreenChosen id={date + hour + "colour:gre"} deselect={this.props.deselect} />
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <GreenFree id={date + hour + "colour:gre"} chooseSlot={this.props.chooseSlot} />
                        </div>
                    );
                }
            default:
                return <div>room</div>;
        }
    }

    renderOneHourContainer() {
        let hours = []
        for (let i = 0; i <= 23; i++) {
            let hourForIdName = String(i).length === 1 ? "hour:" + "0" + i : "hour:" + i;

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