import React, { Component } from 'react';
import '../css/Rooms.css'

export class RedFreeHome extends Component {
    state = {}
    render() {
        return <div className="red-room-free-home" id={this.props.id}>F</div>;
    }
}

export class BlueFreeHome extends Component {
    state = {}
    render() {
        return <div className="blue-room-free-home" id={this.props.id}>F</div>;
    }
}

export class GreenFreeHome extends Component {
    state = {}
    render() {
        return <div className="green-room-free-home" id={this.props.id}>F</div>;
    }
}

export class VioletFreeHome extends Component {
    state = {}
    render() {
        return <div className="violet-room-free-home" id={this.props.id}>F</div>;
    }
}

export class BrownFreeHome extends Component {
    state = {}
    render() {
        return <div className="brown-room-free-home" id={this.props.id}>F</div>;
    }
}

export class RedBusy extends Component {
    state = {}
    render() {       
        return <div className="red-room-reserved" id={this.props.id} data-tooltip={this.props.id ? this.props.id.slice(34): null} >R</div>;
    }
}

export class BlueBusy extends Component {
    state = {}
    render() {
        return <div className="blue-room-reserved" id={this.props.id} data-tooltip={this.props.id ? this.props.id.slice(34): null}>R</div>;
    }
}

export class GreenBusy extends Component {
    state = {}
    render() {
        return <div className="green-room-reserved" id={this.props.id} data-tooltip={this.props.id ? this.props.id.slice(34): null} >R</div>;
    }
}

export class VioletBusy extends Component {
    state = {}
    render() {
        return <div className="violet-room-reserved" id={this.props.id} data-tooltip={this.props.id ? this.props.id.slice(34): null} >R</div>;
    }
}

export class BrownBusy extends Component {
    state = {}
    render() {
        return <div className="brown-room-reserved" id={this.props.id} data-tooltip={this.props.id ? this.props.id.slice(34): null}>R</div>;
    }
}

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

export class VioletFree extends Component {
    state = {}
    render() {
        return <div className="violet-room-free" id={this.props.id}
            onClick={() => { this.props.chooseSlot(this.props.id) }}
        >F</div>;
    }
}

export class BrownFree extends Component {
    state = {}
    render() {
        return <div className="brown-room-free" id={this.props.id}
            onClick={() => { this.props.chooseSlot(this.props.id) }}
        >F</div>;
    }
}

export class RedChosen extends Component {
    state = {}

    render() {
        return <div className="red-room-chosen" id={this.props.id}
            onClick={() => { this.props.deselect(this.props.id) }}
        >S</div>;
    }
}

export class BlueChosen extends Component {
    state = {}
    render() {
        return <div className="blue-room-chosen" id={this.props.id}
            onClick={() => { this.props.deselect(this.props.id) }}
        >S</div>;
    }
}

export class GreenChosen extends Component {
    state = {}
    render() {
        return <div className="green-room-chosen" id={this.props.id}
            onClick={() => { this.props.deselect(this.props.id) }}
        >S</div>;
    }
}

export class VioletChosen extends Component {
    state = {}
    render() {
        return <div className="violet-room-chosen" id={this.props.id}
            onClick={() => { this.props.deselect(this.props.id) }}
        >S</div>;
    }
}

export class BrownChosen extends Component {
    state = {}
    render() {
        return <div className="brown-room-chosen" id={this.props.id}
            onClick={() => { this.props.deselect(this.props.id) }}
        >S</div>;
    }
}