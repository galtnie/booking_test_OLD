import React, { Component } from 'react';
import '../css/Rooms.css'

export class RedFreeHome extends Component {
    state={}
    render() {
        return <div className="red-room-free-home">F</div>;
    }
}

export class RedFree extends Component {
    state={}
    render() {
        return <div className="red-room-free">F</div>;
    }
}

export class RedBusy extends Component {
    state={}
    render() {
        return <div className="red-room-reserved">R</div>;
    }
}

export class BlueFreeHome extends Component {
    state={}
    render() {
        return <div className="blue-room-free-home">F</div>;
    }
}

export class BlueFree extends Component {
    state={}
    render() {
        return <div className="blue-room-free">F</div>;
    }
}

export class BlueBusy extends Component {
    state={}
    render() {
        return <div className="blue-room-reserved">R</div>;
    }
}

export class GreenFreeHome extends Component {
    state={}
    render() {
        return <div className="green-room-free-home">F</div>;
    }
}

export class GreenFree extends Component {
    state={}
    render() {
        return <div className="green-room-free">F</div>;
    }
}

export class GreenBusy extends Component {
    state={}
    render() {
        return <div className="green-room-reserved">R</div>;
    }
}