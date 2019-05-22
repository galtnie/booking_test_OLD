import React, { Component } from 'react'
import '../css/HomeDayCard.css';
import { RedFreeHome, RedBusy, BlueFreeHome, BlueBusy, GreenFreeHome, GreenBusy, VioletFreeHome, VioletBusy, BrownFreeHome, BrownBusy } from './Rooms'

export default class HomeCardHour extends Component {
    state = {
        reservedSlots: []
    }

    renderHour(hour) {
        return <div style={{ paddingLeft: "0.38em" }}>{hour}"</div>
    }

    checkReservation(slotID) {
        console.log(this.state.reservedSlots)
        let newArrayWithoutTitles = this.state.reservedSlots.map(e => e.slice(0, 28))
        console.log(newArrayWithoutTitles)
        let newArrayOfTitles = this.state.reservedSlots.map(e => e.slice(28))
    
    
        return newArrayWithoutTitles.includes(slotID)
            ?
            newArrayOfTitles[newArrayWithoutTitles.findIndex(e => e === slotID)]
            :
            false
    }

    renderOneHourContainer() {
        let hours = []
        for (let i = 0; i <= 23; i++) {
            let hourForIdName = String(i).length === 1 ? "hour:0" + i : "hour:" + i;

            hours.push(
                <div id={this.props.id + hourForIdName} key={`${this.id}${hourForIdName}`} className='home-one-hour-countainer'>
                    {this.renderHour(i)}
                    <div>
                        {(this.checkReservation(this.props.id + hourForIdName + "colour:bro")) 
                        ? 
                        <BrownBusy id={this.props.id + hourForIdName + "colour:bro" + this.checkReservation(this.props.id + hourForIdName + "colour:bro")} />
                        :
                        <BrownFreeHome id={this.props.id + hourForIdName + "colour:bro"} chooseSlot={this.props.chooseSlot} />           
                        }
                    </div>
                    <div>
                        {(this.checkReservation(this.props.id + hourForIdName + "colour:gre")) 
                        ?
                        <GreenBusy id={this.props.id + hourForIdName + "colour:gre" + this.checkReservation(this.props.id + hourForIdName + "colour:gre")} />
                        :
                        <GreenFreeHome id={this.props.id + hourForIdName + "colour:gre"} chooseSlot={this.props.chooseSlot} />
                        }
                    </div>
                    <div>
                        {(this.checkReservation(this.props.id + hourForIdName + "colour:red")) 
                        ? 
                        <RedBusy id={this.props.id + hourForIdName + "colour:red" + this.checkReservation(this.props.id + hourForIdName + "colour:red")} />
                        :
                        <RedFreeHome id={this.props.id + hourForIdName + "colour:red"} chooseSlot={this.props.chooseSlot} />
                        }
                    </div>
                    <div>
                        {(this.checkReservation(this.props.id + hourForIdName + "colour:blu")) 
                        ?
                        <BlueBusy id={this.props.id + hourForIdName + "colour:blu" + this.checkReservation(this.props.id + hourForIdName + "colour:blu")} />
                        :
                        <BlueFreeHome id={this.props.id + hourForIdName + "colour:blu"} chooseSlot={this.props.chooseSlot} />
                        }
                    </div>
                    <div>
                        {(this.checkReservation(this.props.id + hourForIdName + "colour:vio")) 
                        ?
                        <VioletBusy id={this.props.id + hourForIdName + "colour:vio" + this.checkReservation(this.props.id + hourForIdName + "colour:vio")} />
                        :
                        <VioletFreeHome id={this.props.id + hourForIdName + "colour:vio"} chooseSlot={this.props.chooseSlot} />
                        }
                    </div>
                </div>
            );
        }
        return hours
    }


    componentWillMount(){
        this.setState({reservedSlots: this.props.reservedSlots})
    }

    render() {
        return (
            this.renderOneHourContainer()
        );
    }
}