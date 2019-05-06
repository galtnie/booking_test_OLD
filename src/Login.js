import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class Login extends Component {
    state={}

    render() {
        return (
            <div> Login page
                <Link to="/booking"> 
                    <button> Booking</button> 
                </Link> 
            </div>
        );
    }
} 