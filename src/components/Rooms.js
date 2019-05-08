import React, { Component } from 'react';
import '../css/Rooms.css'

export class RedFreeHome extends Component {
    state = {}
    render() {
        return <div className="red-room-free-home">F</div>;
    }
}

export class BlueFreeHome extends Component {
    state = {}
    render() {
        return <div className="blue-room-free-home">F</div>;
    }
}

export class GreenFreeHome extends Component {
    state = {}
    render() {
        return <div className="green-room-free-home">F</div>;
    }
}

export class RedBusy extends Component {
    state = {}
    render() {
        return <div className="red-room-reserved">R</div>;
    }
}

export class BlueBusy extends Component {
    state = {}
    render() {
        return <div className="blue-room-reserved">R</div>;
    }
}

export class GreenBusy extends Component {
    state = {}
    render() {
        return <div className="green-room-reserved">R</div>;
    }
}



// BOOKING FREE CLASSES

export class RedFree extends Component {
    state = {}

    render() {
        return <div className="red-room-free" id={this.props.id}
            onClick={() => { this.props.chooseSlot(this.props.id) }}
        >F</div>;
    }
}

export class BlueFree extends Component {
    state = {}
    render() {
        return <div className="blue-room-free" id={this.props.id}
            onClick={() => { this.props.chooseSlot(this.props.id) }}
        >F</div>;
    }
}

export class GreenFree extends Component {
    state = {}
    render() {
        return <div className="green-room-free" id={this.props.id}
            onClick={() => { this.props.chooseSlot(this.props.id) }}
        >F</div>;
    }
}

// BOOKING CHOSEN CLASSES

export class RedChosen extends Component {
    state = {}

    render() {
        return <div className="red-room-chosen" id={this.props.id}
            onClick={() => { this.props.deselect(this.props.id) }}
        >C</div>;
    }
}

export class BlueChosen extends Component {
    state = {}
    render() {
        return <div className="blue-room-chosen" id={this.props.id}
            onClick={() => { this.props.deselect(this.props.id) }}
        >C</div>;
    }
}

export class GreenChosen extends Component {
    state = {}
    render() {
        return <div className="green-room-chosen" id={this.props.id}
            onClick={() => { this.props.deselect(this.props.id) }}
        >C</div>;
    }
}