import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Booking from './Booking';
import SignUpForm from './SignUp';

//import logo from './logo.svg';
import './css/App.css';



function App() {
  localStorage.setItem('loginDetails', JSON.stringify(
    [
      {
        username: 'Mike@nowhere.net',
        password: '1111',
      },
      {
        username: 'Pete@nowhere.net',
        password: '2222',
      },
      {
        username: 'linda@nowhere.net',
        password: '3333',
      },
    ]
  ))

//  let loginDetailsList = JSON.parse(localStorage.getItem('loginDetails'))



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







// import React from 'react';
// import ReactDOM from 'react-dom';
// import Button from '@material-ui/core/Button';

// function App() {
//   return (
//     <Button variant="contained" color="primary">
//       Hello World
//     </Button>
//   );
// }

// export default App;
