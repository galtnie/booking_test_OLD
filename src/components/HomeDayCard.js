import React, { Component } from 'react'
import HomeDayBar from './HomeDayBar';
import '../css/HomeDayCard.css';
import { RedFreeHome, RedBusy, BlueFreeHome, BlueBusy, GreenFreeHome, GreenBusy } from './Rooms'

export default class HomeDayCard extends Component {
    state = {}

    renderHour(hour) {
        return <div style={{ paddingLeft: "0.38em" }}>{hour}"</div>
    }

    renderRooms(colour, date, time) {
        switch (colour) {
            case "red":
                return (
                    <div>
                        <RedFreeHome id={`${date}${time}red`}/>
                    </div>
                );
            case "blue":
                return (
                    <div>
                        <BlueFreeHome id={`${date}${time}blu`}/>
                    </div>
                );
            case "green":
                return (
                    <div>
                        <GreenFreeHome id={`${date}${time}gre`}/>
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
                    {this.renderRooms('red', this.props.date, i)}
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