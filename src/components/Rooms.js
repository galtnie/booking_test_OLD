import React, { Component } from 'react';
import '../css/Rooms.css'

export class RedFree extends Component {
    state={}

    render() {
        return (
            <div>
                <div className="red-room-free">F</div>
            </div>
        );
    }
}

export class RedBusy extends Component {
    state={}

    render() {
        return (
            <div>
                <div className="red-room-reserved">R</div>
            </div>
        );
    }
}