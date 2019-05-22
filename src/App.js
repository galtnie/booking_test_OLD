import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Booking from './Booking';
import SignUpForm from './SignUp';
import './App.css'
function App() {

  return (
    <div>
      <BrowserRouter basename={undefined}>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" exact component={Home} />
            <Route path='/booking' component={Booking} />
            <Route path='/signup' component={SignUpForm} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;





