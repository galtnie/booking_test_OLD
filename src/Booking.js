import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class Booking extends Component {
    state={}

    render() {
        return (
            <div> Booking page
                <Link to="/"> 
                    <button>Sign out</button> 
                </Link> 
            </div>
        );
    }
} 