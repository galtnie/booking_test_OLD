import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Booking from './Booking';
import SignUpForm from './SignUp';

//import logo from './logo.svg';
import './css/App.css';



function App() {
  



  return (
    <div>
      <BrowserRouter >
        <div>
          
            <Route path="/login" component={Login} />
            <Route path="/" exact component={Home} />
            <Route path='/booking' component={Booking} />
            <Route path='/signup' component={SignUpForm} />

        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;





