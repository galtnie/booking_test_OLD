import React, { Component } from 'react'
import HomeDayBar from './HomeDayBar';
import '../css/HomeDayCard.css';
import { RedFree, RedBusy, BlueFree, BlueBusy, GreenFree, GreenBusy } from './Rooms'

export default class BookingDayCard extends Component {
    state = {}

    renderHour(hour) {
        return <div style={{ paddingLeft: "0.38em" }}>{hour}"</div>
    }

    renderRooms(colour) {
        switch (colour) {
            case "red":
                return (
                    <div>
                        <RedFree />
                    </div>
                );
            case "blue":
                return (
                    <div>
                        <BlueFree />
                    </div>
                );
            case "green":
                return (
                    <div>
                        <GreenFree />
                    </div>
                );
            default:
                return <div>room</div>;
        }
    }

    renderOneHourContainer() {
        let hours = []
        for (let i = 0; i <= 23; i++) {
            let hourForKeyName = String(i).length === 1 ? "0" + i : i;
            hours.push(
                <div key={this.props.anchor + hourForKeyName} className='home-one-hour-countainer'>
                    {this.renderHour(i)}
                    {this.renderRooms('red')}
                    {this.renderRooms('blue')}
                    {this.renderRooms('green')}
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